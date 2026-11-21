import React, { useMemo } from 'react';
import type { PlaybackState } from '../../types/listeningRoom';
import { generateTrackWaveform } from './waveformGenerator';
import styles from './ListeningRoom.module.css';

interface WaveformVisualizerProps {
  videoId: string | null | undefined;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  onSeek?: (seconds: number) => void;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  videoId,
  playbackState,
  currentTime,
  duration,
  onSeek,
}) => {
  const isPlaying = playbackState === 'PLAYING';
  const isBuffering = playbackState === 'BUFFERING';
  const isPaused = playbackState === 'PAUSED';

  // Memoize the deterministic 42-bar waveform so it never recalculates on simple progress ticks
  const bars = useMemo(() => generateTrackWaveform(videoId, 42), [videoId]);

  // Compute playback timeline percentage [0, 100]
  const progressPercent =
    duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || !duration || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <div
      className={styles.waveformContainer}
      onClick={handleContainerClick}
      role="button"
      tabIndex={onSeek && duration > 0 ? 0 : -1}
      aria-label={`Playback waveform: ${Math.round(progressPercent)}% completed`}
      title={duration > 0 ? 'Click waveform to seek' : undefined}
    >
      <div
        className={`${styles.waveformBars} ${
          isPlaying
            ? styles.wavePlaying
            : isBuffering
            ? styles.waveBuffering
            : isPaused
            ? styles.wavePaused
            : styles.waveStatic
        }`}
        aria-hidden="true"
      >
        {bars.map((bar, idx) => {
          // Determine if this bar falls within the played portion of the timeline
          const barProgress = (idx / (bars.length - 1)) * 100;
          const isPlayed = barProgress <= progressPercent;

          return (
            <span
              key={idx}
              className={`${styles.waveformBar} ${
                isPlayed ? styles.waveformBarPlayed : styles.waveformBarUnplayed
              }`}
              style={
                {
                  '--bar-height': `${bar.baseHeight}%`,
                  '--anim-delay': bar.delay,
                  '--anim-duration': bar.duration,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>
      <span className="sr-only">
        Playback waveform: {playbackState.toLowerCase()}, {Math.round(progressPercent)}% played
      </span>
    </div>
  );
};
