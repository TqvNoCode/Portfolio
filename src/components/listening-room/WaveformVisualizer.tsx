import React, { useMemo } from 'react';
import type { PlaybackState } from '../../types/listeningRoom';
import { generateTrackWaveform } from './waveformGenerator';
import styles from './ListeningRoom.module.css';

interface WaveformVisualizerProps {
  videoId: string | null | undefined;
  playbackState: PlaybackState;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  videoId,
  playbackState,
}) => {
  const isPlaying = playbackState === 'PLAYING';
  const isBuffering = playbackState === 'BUFFERING';
  const isPaused = playbackState === 'PAUSED';
  const isEnded = playbackState === 'ENDED';
  const isError = playbackState === 'ERROR';

  // Memoize the deterministic 40-bar waveform so it only updates when changing tracks
  const bars = useMemo(() => generateTrackWaveform(videoId, 40), [videoId]);

  const stateClass = isPlaying
    ? styles.wavePlaying
    : isPaused
    ? styles.wavePaused
    : isBuffering
    ? styles.waveBuffering
    : isEnded || isError
    ? styles.waveEnded
    : styles.waveStatic;

  return (
    <div
      className={styles.waveformContainer}
      aria-hidden="true"
      title={isPlaying ? 'Audio Visualizer (Active Stream)' : 'Audio Visualizer'}
    >
      <div className={`${styles.waveformBars} ${stateClass}`}>
        {bars.map((bar, idx) => (
          <span
            key={idx}
            className={`${styles.waveformBar} ${styles[`barAnimVariant${bar.animVariant}`]}`}
            style={
              {
                '--bar-height': `${bar.baseHeight}%`,
                '--anim-duration': bar.duration,
                '--anim-delay': bar.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <span className="sr-only">
        Playback audio visualizer: {playbackState.toLowerCase()}
      </span>
    </div>
  );
};
