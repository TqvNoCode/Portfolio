import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import type { PlaybackState, RepeatMode } from '../../types/listeningRoom';
import styles from './ListeningRoom.module.css';

interface PlaybackControlsProps {
  playbackState: PlaybackState;
  shuffle: boolean;
  repeat: RepeatMode;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  hasTrack: boolean;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  playbackState,
  shuffle,
  repeat,
  onTogglePlay,
  onPrev,
  onNext,
  onToggleShuffle,
  onToggleRepeat,
  hasTrack,
}) => {
  const isPlaying = playbackState === 'PLAYING';
  const isBuffering = playbackState === 'BUFFERING';

  return (
    <div className={styles.controlsRow} role="toolbar" aria-label="Audio playback controls">
      {/* Shuffle Button */}
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

      {/* Previous Track Button */}
      <button
        type="button"
        onClick={onPrev}
        className={styles.iconButton}
        aria-label="Previous track"
        disabled={!hasTrack}
        title="Previous track"
      >
        <SkipBack size={18} />
      </button>

      {/* Main Play / Pause Button */}
      <button
        type="button"
        onClick={onTogglePlay}
        className={`${styles.playButton} ${isPlaying ? styles.playActive : ''}`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        disabled={!hasTrack}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause size={20} className={styles.playIcon} />
        ) : (
          <Play size={20} className={`${styles.playIcon} ${styles.offsetPlay}`} />
        )}
        {isBuffering && <span className={styles.bufferingSpinner} aria-hidden="true" />}
      </button>

      {/* Next Track Button */}
      <button
        type="button"
        onClick={onNext}
        className={styles.iconButton}
        aria-label="Next track"
        disabled={!hasTrack}
        title="Next track"
      >
        <SkipForward size={18} />
      </button>

      {/* Repeat Button */}
      <button
        type="button"
        onClick={onToggleRepeat}
        className={`${styles.iconButton} ${repeat !== 'off' ? styles.activeOption : ''}`}
        aria-label={`Repeat mode: ${repeat}`}
        title={`Repeat: ${repeat}`}
      >
        {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
      </button>
    </div>
  );
};
