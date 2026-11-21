import React from 'react';
import type { PlaybackState } from '../../types/listeningRoom';
import styles from './ListeningRoom.module.css';

interface WaveformVisualizerProps {
  playbackState: PlaybackState;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ playbackState }) => {
  const isPlaying = playbackState === 'PLAYING';
  const isBuffering = playbackState === 'BUFFERING';

  // 18 harmonious wave bars with varying base heights
  const bars = [
    { base: 35, delay: '0.0s', animDur: '1.2s' },
    { base: 60, delay: '0.15s', animDur: '1.4s' },
    { base: 85, delay: '0.3s', animDur: '1.1s' },
    { base: 45, delay: '0.45s', animDur: '1.5s' },
    { base: 95, delay: '0.1s', animDur: '1.3s' },
    { base: 70, delay: '0.25s', animDur: '1.6s' },
    { base: 40, delay: '0.4s', animDur: '1.2s' },
    { base: 80, delay: '0.05s', animDur: '1.4s' },
    { base: 100, delay: '0.2s', animDur: '1.1s' },
    { base: 65, delay: '0.35s', animDur: '1.5s' },
    { base: 50, delay: '0.12s', animDur: '1.3s' },
    { base: 90, delay: '0.28s', animDur: '1.6s' },
    { base: 75, delay: '0.42s', animDur: '1.2s' },
    { base: 40, delay: '0.08s', animDur: '1.4s' },
    { base: 85, delay: '0.22s', animDur: '1.1s' },
    { base: 55, delay: '0.38s', animDur: '1.5s' },
    { base: 70, delay: '0.18s', animDur: '1.3s' },
    { base: 30, delay: '0.32s', animDur: '1.6s' },
  ];

  return (
    <div className={styles.waveformContainer}>
      <div
        className={`${styles.waveformBars} ${isPlaying ? styles.wavePlaying : ''} ${
          isBuffering ? styles.waveBuffering : ''
        }`}
        aria-hidden="true"
      >
        {bars.map((bar, idx) => (
          <span
            key={idx}
            className={styles.waveformBar}
            style={
              {
                '--base-height': `${bar.base}%`,
                '--anim-delay': bar.delay,
                '--anim-duration': bar.animDur,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <span className="sr-only">
        Playback visualizer: {playbackState.toLowerCase()}
      </span>
    </div>
  );
};
