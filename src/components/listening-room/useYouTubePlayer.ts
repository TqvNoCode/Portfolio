import { useEffect, useRef, useState, useCallback } from 'react';
import type { PlaybackState } from '../../types/listeningRoom';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
    __ytReadyCallbacks?: Array<() => void>;
  }
}

interface UseYouTubePlayerProps {
  initialVideoId?: string | null;
  onEnded?: () => void;
  onError?: (errorCode: number) => void;
}

export function useYouTubePlayer({ initialVideoId, onEnded, onError }: UseYouTubePlayerProps) {
  // Stable unique container ID that persists across re-renders
  const containerId = useRef(`yt-player-${Math.random().toString(36).slice(2, 9)}`).current;
  const playerRef = useRef<any>(null);

  // Store latest callbacks and initialVideoId in refs to prevent player teardown
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const initialVideoIdRef = useRef(initialVideoId);
  const pendingVideoRef = useRef<{ videoId: string; shouldPlay: boolean } | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('UNSTARTED');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(initialVideoId || null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorCode, setErrorCode] = useState<number | null>(null);

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
        // Element not mounted yet, retry on next frame
        setTimeout(initPlayer, 50);
        return;
      }

      try {
        const vidToLoad = pendingVideoRef.current?.videoId || initialVideoIdRef.current || undefined;

        playerRef.current = new window.YT.Player(containerId, {
          height: '100%',
          width: '100%',
          videoId: vidToLoad,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
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

              const dur = event.target.getDuration();
              if (dur && !isNaN(dur) && dur > 0) {
                setDuration(dur);
              }

              // If a pending video was requested prior to onReady, execute it now
              if (pendingVideoRef.current) {
                const { videoId, shouldPlay } = pendingVideoRef.current;
                pendingVideoRef.current = null;
                if (shouldPlay) {
                  event.target.loadVideoById(videoId);
                } else {
                  event.target.cueVideoById(videoId);
                }
              } else if (vidToLoad) {
                // Initial video cued
                setPlaybackState('CUED');
              }
            },
            onStateChange: (event: any) => {
              if (!isSubscribed) return;
              const stateCode = event.data;
              let nextState: PlaybackState = 'UNSTARTED';

              // Map official YouTube player states strictly
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
                  break;
                default:
                  nextState = 'UNSTARTED';
              }

              setPlaybackState(nextState);

              const dur = event.target.getDuration();
              if (dur && !isNaN(dur) && dur > 0) {
                setDuration(dur);
              }
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

      // Inject script if not already present
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
  }, [containerId]); // Strict single initialization on mount

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

  const setError = useCallback((code: number) => {
    setPlaybackState('ERROR');
    setErrorCode(code);
    if (onErrorRef.current) onErrorRef.current(code);
  }, []);

  const loadVideo = useCallback((videoId: string, shouldPlay = true) => {
    setCurrentVideoId(videoId);
    setCurrentTime(0);

    if (playerRef.current && isReady) {
      try {
        if (shouldPlay && typeof playerRef.current.loadVideoById === 'function') {
          playerRef.current.loadVideoById(videoId);
        } else if (typeof playerRef.current.cueVideoById === 'function') {
          playerRef.current.cueVideoById(videoId);
        }
      } catch (e) {
        console.error('Error changing video in player:', e);
      }
    } else {
      // Player not ready yet: queue for execution in onReady
      pendingVideoRef.current = { videoId, shouldPlay };
    }
  }, [isReady]);

  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seconds, true);
      setCurrentTime(seconds);
    }
  }, []);

  return {
    containerId,
    isReady,
    playbackState,
    currentVideoId,
    currentTime,
    duration,
    errorCode,
    play,
    pause,
    togglePlay,
    loadVideo,
    seekTo,
    setError,
  };
}
