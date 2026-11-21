import { useEffect, useRef, useState, useCallback } from 'react';
import type { PlaybackState } from '../../types/listeningRoom';
import { LISTENING_ROOM_CONFIG } from '../../data/listeningRoom';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
    __ytReadyCallbacks?: Array<() => void>;
    __ytPlayer?: any;
  }
}

interface UseYouTubePlayerProps {
  playlistId?: string;
  onEnded?: () => void;
  onError?: (errorCode: number) => void;
  onPlaylistDiscovered?: (videoIds: string[]) => void;
}

export function useYouTubePlayer({
  playlistId = LISTENING_ROOM_CONFIG.defaultPlaylistId,
  onEnded,
  onError,
  onPlaylistDiscovered,
}: UseYouTubePlayerProps = {}) {
  // Stable unique container ID that persists across re-renders
  const containerId = useRef(`yt-player-${Math.random().toString(36).slice(2, 9)}`).current;
  const playerRef = useRef<any>(null);

  // Store latest callbacks in refs to prevent player teardown
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const onPlaylistDiscoveredRef = useRef(onPlaylistDiscovered);
  onPlaylistDiscoveredRef.current = onPlaylistDiscovered;

  const playlistIdRef = useRef(playlistId);
  playlistIdRef.current = playlistId;

  const pendingIndexRef = useRef<number | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('UNSTARTED');
  const [playlistVideoIds, setPlaylistVideoIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);

  // Controlled playlist discovery strategy
  const discoverPlaylist = useCallback((player: any, attempt = 0) => {
    if (!player) return;
    try {
      const list = typeof player.getPlaylist === 'function' ? player.getPlaylist() : null;
      if (Array.isArray(list) && list.length > 0) {
        setPlaylistVideoIds(list);
        setDiscoveryError(null);

        const idx = typeof player.getPlaylistIndex === 'function' ? player.getPlaylistIndex() : 0;
        const validIdx = idx >= 0 && idx < list.length ? idx : 0;
        setCurrentIndex(validIdx);
        setCurrentVideoId(list[validIdx] || null);

        if (onPlaylistDiscoveredRef.current) {
          onPlaylistDiscoveredRef.current(list);
        }
        return;
      }
    } catch (e) {
      console.warn('Error reading player.getPlaylist():', e);
    }

    // Retry strategy with reasonable delay (up to 6 attempts = 1.8s)
    if (attempt < 6) {
      setTimeout(() => {
        if (playerRef.current) {
          discoverPlaylist(playerRef.current, attempt + 1);
        }
      }, 300);
    } else {
      setDiscoveryError('Playlist discovery timed out.');
    }
  }, []);

  // Load YouTube IFrame API script and initialize player exactly once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isSubscribed = true;

    const initPlayer = () => {
      if (!isSubscribed) return;
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      const mountEl = document.getElementById(containerId);
      if (!mountEl) {
        setTimeout(initPlayer, 50);
        return;
      }

      try {
        playerRef.current = new window.YT.Player(containerId, {
          height: '100%',
          width: '100%',
          playerVars: {
            listType: 'playlist',
            list: playlistIdRef.current,
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin,
            fs: 1,
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              if (!isSubscribed) return;
              setIsReady(true);
              setErrorCode(null);
              window.__ytPlayer = event.target;

              // Discover playlist video IDs
              discoverPlaylist(event.target, 0);

              // Update duration if available
              const dur = event.target.getDuration();
              if (dur && !isNaN(dur) && dur > 0) {
                setDuration(dur);
              }

              // Execute pending index if requested prior to onReady
              if (pendingIndexRef.current !== null) {
                const targetIdx = pendingIndexRef.current;
                pendingIndexRef.current = null;
                event.target.playVideoAt(targetIdx);
              } else {
                setPlaybackState('CUED');
              }
            },
            onStateChange: (event: any) => {
              if (!isSubscribed) return;
              const stateCode = event.data;
              let nextState: PlaybackState = 'UNSTARTED';

              switch (stateCode) {
                case window.YT.PlayerState.UNSTARTED: // -1
                  nextState = 'UNSTARTED';
                  break;
                case window.YT.PlayerState.ENDED: // 0
                  nextState = 'ENDED';
                  if (onEndedRef.current) onEndedRef.current();
                  break;
                case window.YT.PlayerState.PLAYING: // 1
                  nextState = 'PLAYING';
                  setErrorCode(null);
                  break;
                case window.YT.PlayerState.PAUSED: // 2
                  nextState = 'PAUSED';
                  break;
                case window.YT.PlayerState.BUFFERING: // 3
                  nextState = 'BUFFERING';
                  break;
                case window.YT.PlayerState.CUED: // 5
                  nextState = 'CUED';
                  setErrorCode(null);
                  // Check if playlist IDs are now available
                  discoverPlaylist(event.target, 0);
                  break;
                default:
                  nextState = 'UNSTARTED';
              }

              setPlaybackState(nextState);

              // Update duration, index, and video ID from player
              try {
                const dur = event.target.getDuration();
                if (dur && !isNaN(dur) && dur > 0) {
                  setDuration(dur);
                }

                const idx = typeof event.target.getPlaylistIndex === 'function' ? event.target.getPlaylistIndex() : -1;
                if (idx >= 0) {
                  setCurrentIndex(idx);
                }

                const data = typeof event.target.getVideoData === 'function' ? event.target.getVideoData() : null;
                if (data && data.video_id) {
                  setCurrentVideoId(data.video_id);
                }
              } catch {}
            },
            onError: (event: any) => {
              if (!isSubscribed) return;
              const err = event.data;
              console.warn('YouTube Player reported error:', err);
              setPlaybackState('ERROR');
              setErrorCode(err);
              if (onErrorRef.current) onErrorRef.current(err);
            },
          },
        });
      } catch (err) {
        console.error('Failed to instantiate YouTube player:', err);
      }
    };

    // Shared global callback queue for onYouTubeIframeAPIReady
    if (!window.YT || !window.YT.Player) {
      if (!window.__ytReadyCallbacks) {
        window.__ytReadyCallbacks = [];
      }
      window.__ytReadyCallbacks.push(initPlayer);

      window.onYouTubeIframeAPIReady = () => {
        if (window.__ytReadyCallbacks) {
          window.__ytReadyCallbacks.forEach((cb) => {
            try {
              cb();
            } catch (e) {
              console.error(e);
            }
          });
          window.__ytReadyCallbacks = [];
        }
      };

      if (!document.getElementById('youtube-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }
    } else {
      initPlayer();
    }

    return () => {
      isSubscribed = false;
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
    };
  }, [containerId, discoverPlaylist]);

  // Polling current playback time ONLY while genuinely in PLAYING state
  useEffect(() => {
    if (playbackState !== 'PLAYING' || !playerRef.current) return;

    const interval = setInterval(() => {
      try {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const t = playerRef.current.getCurrentTime();
          if (typeof t === 'number' && !isNaN(t)) {
            setCurrentTime(t);
          }
          const d = playerRef.current.getDuration();
          if (typeof d === 'number' && !isNaN(d) && d > 0) {
            setDuration(d);
          }
        }
      } catch {}
    }, 300);

    return () => clearInterval(interval);
  }, [playbackState]);

  const play = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        playerRef.current.playVideo();
      } catch (e) {
        console.error('Error invoking playVideo:', e);
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try {
        playerRef.current.pauseVideo();
      } catch (e) {
        console.error('Error invoking pauseVideo:', e);
      }
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    try {
      const state = typeof playerRef.current.getPlayerState === 'function'
        ? playerRef.current.getPlayerState()
        : null;
      // 1 = PLAYING, 3 = BUFFERING
      if (state === 1 || state === 3 || playbackState === 'PLAYING') {
        pause();
      } else {
        play();
      }
    } catch {
      if (playbackState === 'PLAYING') {
        pause();
      } else {
        play();
      }
    }
  }, [playbackState, play, pause]);

  const playVideoAt = useCallback((index: number) => {
    if (playerRef.current && isReady && typeof playerRef.current.playVideoAt === 'function') {
      try {
        playerRef.current.playVideoAt(index);
        setCurrentIndex(index);
        setCurrentTime(0);
      } catch (e) {
        console.error('Error in playVideoAt:', e);
      }
    } else {
      pendingIndexRef.current = index;
    }
  }, [isReady]);

  const nextVideo = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.nextVideo === 'function') {
      try {
        playerRef.current.nextVideo();
        setCurrentTime(0);
      } catch (e) {
        console.error('Error in nextVideo:', e);
      }
    }
  }, []);

  const previousVideo = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.previousVideo === 'function') {
      try {
        playerRef.current.previousVideo();
        setCurrentTime(0);
      } catch (e) {
        console.error('Error in previousVideo:', e);
      }
    }
  }, []);

  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seconds, true);
      setCurrentTime(seconds);
    }
  }, []);

  const setShuffle = useCallback((shuffle: boolean) => {
    if (playerRef.current && typeof playerRef.current.setShuffle === 'function') {
      try {
        playerRef.current.setShuffle(shuffle);
      } catch (e) {
        console.error('Error setting shuffle:', e);
      }
    }
  }, []);

  const setLoop = useCallback((loop: boolean) => {
    if (playerRef.current && typeof playerRef.current.setLoop === 'function') {
      try {
        playerRef.current.setLoop(loop);
      } catch (e) {
        console.error('Error setting loop:', e);
      }
    }
  }, []);

  const setErrorState = useCallback((code: number) => {
    setPlaybackState('ERROR');
    setErrorCode(code);
    if (onErrorRef.current) onErrorRef.current(code);
  }, []);

  const refreshPlaylist = useCallback(() => {
    if (!playerRef.current) return;
    try {
      if (typeof playerRef.current.cuePlaylist === 'function') {
        playerRef.current.cuePlaylist({
          listType: 'playlist',
          list: playlistIdRef.current,
        });
      }
      discoverPlaylist(playerRef.current, 0);
    } catch (e) {
      console.warn('Error refreshing playlist in YouTube player:', e);
    }
  }, [discoverPlaylist]);

  return {
    containerId,
    isReady,
    playbackState,
    playlistVideoIds,
    currentIndex,
    currentVideoId,
    currentTime,
    duration,
    errorCode,
    discoveryError,
    play,
    pause,
    togglePlay,
    playVideoAt,
    nextVideo,
    previousVideo,
    seekTo,
    setShuffle,
    setLoop,
    setError: setErrorState,
    refreshPlaylist,
  };
}