import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Shuffle,
  Repeat,
  Repeat1,
} from 'lucide-react';
import type { PlaybackState, RepeatMode } from '../../types/listeningRoom';
import styles from './ListeningRoom.module.css';

interface PlaybackControlsProps {
  playbackState: PlaybackState;
  shuffle: boolean;
  repeat: RepeatMode;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  hasTrack: boolean;
  duration?: number;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  playbackState,
  shuffle,
  repeat,
  onTogglePlay,
  onPrev,
  onNext,
  onSeekBackward,
  onSeekForward,
  onToggleShuffle,
  onToggleRepeat,
  hasTrack,
  duration = 0,
}) => {
  const isPlaying = playbackState === 'PLAYING';
  const isBuffering = playbackState === 'BUFFERING';
  const canSeek = duration > 0;

  return (
    <div className={styles.controlsRow} role="toolbar" aria-label="Audio playback controls">
      {/* 1. Shuffle Button */}
      <button
        type="button"
        onClick={onToggleShuffle}
        className={`${styles.iconButton} ${shuffle ? styles.activeOption : ''}`}
        aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
        aria-pressed={shuffle}
        title={shuffle ? 'Shuffle: On' : 'Shuffle: Off'}
      >
        <Shuffle size={16} />
      </button>

      {/* 2. Rewind 10s Button */}
      <button
        type="button"
        onClick={() => onSeekBackward()}
        className={`${styles.iconButton} ${styles.seekBtn}`}
        aria-label="Rewind 10 seconds"
        disabled={!canSeek}
        title="Rewind 10 seconds (-10s)"
      >
        <Rewind size={17} />
        <span className={styles.seekBtnBadge}>-10s</span>
      </button>

      {/* 3. Previous Track Button */}
      <button
        type="button"
        onClick={onPrev}
        className={styles.iconButton}
        aria-label="Previous track"
        disabled={!hasTrack}
        title="Previous track"
      >
        <SkipBack size={19} />
      </button>

      {/* 4. Main Play / Pause Button (Emphasized primary action) */}
      <button
        type="button"
        onClick={onTogglePlay}
        className={`${styles.playButton} ${isPlaying ? styles.playActive : ''}`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        disabled={!hasTrack}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause size={22} className={styles.playIcon} />
        ) : (
          <Play size={22} className={`${styles.playIcon} ${styles.offsetPlay}`} />
        )}
        {isBuffering && <span className={styles.bufferingSpinner} aria-hidden="true" />}
      </button>

      {/* 5. Next Track Button */}
      <button
        type="button"
        onClick={onNext}
        className={styles.iconButton}
        aria-label="Next track"
        disabled={!hasTrack}
        title="Next track"
      >
        <SkipForward size={19} />
      </button>

      {/* 6. Forward 10s Button */}
      <button
        type="button"
        onClick={() => onSeekForward()}
        className={`${styles.iconButton} ${styles.seekBtn}`}
        aria-label="Forward 10 seconds"
        disabled={!canSeek}
        title="Forward 10 seconds (+10s)"
      >
        <FastForward size={17} />
        <span className={styles.seekBtnBadge}>+10s</span>
      </button>

      {/* 7. Repeat Button (Off -> All -> One -> Off) */}
      <button
        type="button"
        onClick={onToggleRepeat}
        className={`${styles.iconButton} ${repeat !== 'off' ? styles.activeOption : ''}`}
        aria-label={`Repeat mode: ${repeat}`}
        aria-pressed={repeat !== 'off'}
        title={`Repeat: ${repeat === 'off' ? 'Off' : repeat === 'all' ? 'All' : 'One'}`}
      >
        {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
      </button>
    </div>
  );
};
