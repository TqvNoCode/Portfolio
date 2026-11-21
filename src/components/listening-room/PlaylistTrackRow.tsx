import React from 'react';
import { ExternalLink, AlertCircle } from 'lucide-react';
import type { PlaylistTrack, PlaybackState } from '../../types/listeningRoom';
import { formatDuration } from '../../data/listeningRoom';
import styles from './ListeningRoom.module.css';

interface PlaylistTrackRowProps {
  track: PlaylistTrack;
  index: number;
  isSelected: boolean;
  isPlaying: boolean;
  playbackState: PlaybackState;
  onSelect: (track: PlaylistTrack) => void;
}

export const PlaylistTrackRow: React.FC<PlaylistTrackRowProps> = ({
  track,
  index,
  isSelected,
  isPlaying,
  playbackState,
  onSelect,
}) => {
  const isBuffering = isSelected && playbackState === 'BUFFERING';
  const isPaused = isSelected && playbackState === 'PAUSED';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(track);
    }
  };

  const formattedPos = (index + 1).toString().padStart(2, '0');

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(track)}
      onKeyDown={handleKeyDown}
      className={`${styles.trackRow} ${isSelected ? styles.trackSelected : ''} ${
        isPlaying ? styles.trackPlaying : ''
      } ${!track.embeddable ? styles.trackUnavailable : ''}`}
      aria-label={`${track.title} by ${track.channelTitle}`}
      aria-current={isSelected ? 'true' : undefined}
    >
      {/* Position index / Playing visualizer */}
      <div className={styles.trackIndexCol}>
        {isPlaying ? (
          <div className={styles.miniEqualizer} aria-label="Currently playing">
            <span className={styles.eqBar} style={{ animationDelay: '0.1s' }} />
            <span className={styles.eqBar} style={{ animationDelay: '0.3s' }} />
            <span className={styles.eqBar} style={{ animationDelay: '0.2s' }} />
          </div>
        ) : isPaused ? (
          <span className={styles.pausedIndicator}>||</span>
        ) : isBuffering ? (
          <span className={styles.bufferingDot} />
        ) : (
          <span className={styles.trackIndexNumber}>{formattedPos}</span>
        )}
      </div>

      {/* Thumbnail */}
      <div className={styles.thumbWrapper}>
        {track.thumbnailUrl ? (
          <img
            src={track.thumbnailUrl}
            alt=""
            loading="lazy"
            className={styles.trackThumb}
            onError={(e) => {
              // Hide image if failed to load
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className={styles.thumbFallback} />
        )}
      </div>

      {/* Title & Channel */}
      <div className={styles.trackInfoCol}>
        <div className={styles.trackTitleRow}>
          <span className={styles.trackTitleText} title={track.title}>
            {track.title}
          </span>
          {!track.embeddable && (
            <span className={styles.unavailableBadge} title="Playback restricted by creator">
              <AlertCircle size={10} />
              <span>Restricted</span>
            </span>
          )}
        </div>
        <span className={styles.channelText} title={track.channelTitle || 'YouTube Creator'}>
          {track.channelTitle || 'YouTube Creator'}
        </span>
      </div>

      {/* Duration & External Link */}
      <div className={styles.trackMetaCol}>
        <span className={styles.durationText}>
          {formatDuration(track.durationSeconds)}
        </span>
        <a
          href={`https://music.youtube.com/watch?v=${track.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={styles.externalTrackLink}
          aria-label={`Open ${track.title} on YouTube Music`}
          title="Open in YouTube Music"
        >
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};
