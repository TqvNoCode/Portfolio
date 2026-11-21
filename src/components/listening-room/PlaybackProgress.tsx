import React, { useState, useEffect, useRef } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [draftValue, setDraftValue] = useState(0);
  const draftRef = useRef(draftValue);
  draftRef.current = draftValue;

  // Keep scrub value synced with player currentTime when user is NOT actively dragging
  useEffect(() => {
    if (!isDragging) {
      setDraftValue(currentTime);
    }
  }, [currentTime, isDragging]);

  // Global pointer up handler while dragging outside the range input boundary
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalPointerUp = () => {
      setIsDragging(false);
      onSeek(draftRef.current);
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [isDragging, onSeek]);

  const activeValue = isDragging ? draftValue : currentTime;
  const progressPercent =
    duration > 0 ? Math.min(100, Math.max(0, (activeValue / duration) * 100)) : 0;

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setDraftValue(val);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
    setIsDragging(false);
    const val = parseFloat((e.target as HTMLInputElement).value);
    onSeek(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!duration || duration <= 0) return;

    let targetTime: number | null = null;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      targetTime = Math.max(0, activeValue - 5);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      targetTime = Math.min(duration, activeValue + 5);
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetTime = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetTime = duration;
    }

    if (targetTime !== null) {
      setDraftValue(targetTime);
      onSeek(targetTime);
    }
  };

  return (
    <div className={styles.progressContainer}>
      <span className={styles.timeLabel} aria-hidden="true">
        {formatDuration(activeValue)}
      </span>

      <div className={styles.sliderWrapper}>
        <div className={styles.sliderTrackBg} aria-hidden="true" />
        <div
          className={styles.sliderFill}
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />
        <input
          type="range"
          min={0}
          max={duration > 0 ? duration : 100}
          step={0.5}
          value={activeValue}
          onChange={handleChange}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          className={styles.rangeInput}
          aria-label="Seek track position"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration || 100)}
          aria-valuenow={Math.round(activeValue)}
          aria-valuetext={`${formatDuration(activeValue)} of ${formatDuration(duration)}`}
          disabled={!duration || duration <= 0}
        />
      </div>

      <span className={styles.timeLabel} aria-hidden="true">
        {formatDuration(duration)}
      </span>
    </div>
  );
};
