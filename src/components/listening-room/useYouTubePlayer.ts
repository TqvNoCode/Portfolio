import { useEffect, useRef, useState, useCallback } from 'react';
import type { PlaybackState } from '../../types/listeningRoom';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface UseYouTubePlayerProps {
  initialVideoId?: string | null;
  onEnded?: () => void;
  onError?: (errorCode: number) => void;
}

export function useYouTubePlayer({ initialVideoId, onEnded, onError }: UseYouTubePlayerProps) {
  const containerId = useRef(`yt-player-${Math.random().toString(36).slice(2, 9)}`).current;
  const playerRef = useRef<any>(null);

  const [isReady, setIsReady] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('UNSTARTED');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(initialVideoId || null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.YT) {
      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      const mountEl = document.getElementById(containerId);
      if (!mountEl) return;

      try {
        playerRef.current = new window.YT.Player(containerId, {
          height: '100%',
          width: '100%',
          videoId: initialVideoId || undefined,
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
              setIsReady(true);
              const dur = event.target.getDuration();
              if (dur && !isNaN(dur)) setDuration(dur);
            },
            onStateChange: (event: any) => {
              const stateCode = event.data;
              let nextState: PlaybackState = 'UNSTARTED';

              switch (stateCode) {
                case window.YT.PlayerState.UNSTARTED:
                  nextState = 'UNSTARTED';
                  break;
                case window.YT.PlayerState.ENDED:
                  nextState = 'ENDED';
                  if (onEnded) onEnded();
                  break;
                case window.YT.PlayerState.PLAYING:
                  nextState = 'PLAYING';
                  break;
                case window.YT.PlayerState.PAUSED:
                  nextState = 'PAUSED';
                  break;
                case window.YT.PlayerState.BUFFERING:
                  nextState = 'BUFFERING';
                  break;
                case window.YT.PlayerState.CUED:
                  nextState = 'CUED';
                  break;
                default:
                  nextState = 'UNSTARTED';
              }

              setPlaybackState(nextState);

              const dur = event.target.getDuration();
              if (dur && !isNaN(dur)) setDuration(dur);
            },
            onError: (event: any) => {
              setPlaybackState('ERROR');
              if (onError) onError(event.data);
            },
          },
        });
      } catch (err) {
        console.error('Failed to initialize YouTube player:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
    };
  }, [containerId, initialVideoId, onEnded, onError]);

  // Polling current playback time (only while PLAYING)
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
    }, 350);

    return () => clearInterval(interval);
  }, [playbackState]);

  const play = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      playerRef.current.playVideo();
    }
  }, []);

  const pause = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      playerRef.current.pauseVideo();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (playbackState === 'PLAYING') {
      pause();
    } else {
      play();
    }
  }, [playbackState, play, pause]);

  const loadVideo = useCallback((videoId: string, shouldPlay = true) => {
    setCurrentVideoId(videoId);
    setCurrentTime(0);

    if (playerRef.current) {
      try {
        if (shouldPlay && typeof playerRef.current.loadVideoById === 'function') {
          playerRef.current.loadVideoById(videoId);
        } else if (typeof playerRef.current.cueVideoById === 'function') {
          playerRef.current.cueVideoById(videoId);
        }
      } catch (e) {
        console.error('Error loading video:', e);
      }
    }
  }, []);

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
    play,
    pause,
    togglePlay,
    loadVideo,
    seekTo,
  };
}
