import React, { useState, useEffect } from 'react';
import { formatDuration } from '../../data/listeningRoom';
import styles from './ListeningRoom.module.css';

interface PlaybackProgressProps {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
}

export const PlaybackProgress: React.FC<PlaybackProgressProps> = ({
  currentTime,
  duration,
  onSeek,
}) => {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);

  useEffect(() => {
    if (!isScrubbing) {
      setScrubValue(currentTime);
    }
  }, [currentTime, isScrubbing]);

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (scrubValue / duration) * 100)) : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScrubValue(parseFloat(e.target.value));
  };

  const handleMouseDown = () => {
    setIsScrubbing(true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setIsScrubbing(false);
    onSeek(parseFloat((e.target as HTMLInputElement).value));
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLInputElement>) => {
    setIsScrubbing(false);
    onSeek(parseFloat((e.target as HTMLInputElement).value));
  };

  return (
    <div className={styles.progressContainer}>
      <span className={styles.timeLabel}>{formatDuration(scrubValue)}</span>

      <div className={styles.sliderWrapper}>
        <div
          className={styles.sliderFill}
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.5}
          value={scrubValue}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
          className={styles.rangeInput}
          aria-label="Seek track position"
          aria-valuemin={0}
          aria-valuemax={duration || 100}
          aria-valuenow={scrubValue}
          aria-valuetext={`${formatDuration(scrubValue)} of ${formatDuration(duration)}`}
          disabled={!duration || duration <= 0}
        />
      </div>

      <span className={styles.timeLabel}>{formatDuration(duration)}</span>
    </div>
  );
};
