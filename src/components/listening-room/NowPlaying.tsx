import React from 'react';
import { ExternalLink, Radio, Disc } from 'lucide-react';
import type { PlaylistTrack, PlaybackState, RepeatMode } from '../../types/listeningRoom';
import { YouTubePlayer } from './YouTubePlayer';
import { WaveformVisualizer } from './WaveformVisualizer';
import { PlaybackProgress } from './PlaybackProgress';
import { PlaybackControls } from './PlaybackControls';
import styles from './ListeningRoom.module.css';

interface NowPlayingProps {
  containerId: string;
  isReady: boolean;
  selectedTrack: PlaylistTrack | null;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: RepeatMode;
  playlistUrl: string;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onSeek: (seconds: number) => void;
}

export const NowPlaying: React.FC<NowPlayingProps> = ({
  containerId,
  isReady,
  selectedTrack,
  playbackState,
  currentTime,
  duration,
  shuffle,
  repeat,
  playlistUrl,
  onTogglePlay,
  onPrev,
  onNext,
  onSeekBackward,
  onSeekForward,
  onToggleShuffle,
  onToggleRepeat,
  onSeek,
}) => {
  const isPlaying = playbackState === 'PLAYING';
  const isBuffering = playbackState === 'BUFFERING';
  const isPaused = playbackState === 'PAUSED';
  const isCued = playbackState === 'CUED';
  const isEnded = playbackState === 'ENDED';
  const isError = playbackState === 'ERROR' || (selectedTrack !== null && selectedTrack.embeddable === false);

  const statusLabel = isPlaying
    ? 'PLAYING'
    : isBuffering
    ? 'BUFFERING'
    : isPaused
    ? 'PAUSED'
    : isCued
    ? 'READY'
    : isEnded
    ? 'ENDED'
    : isError
    ? 'RESTRICTED'
    : 'STANDBY';

  const statusClass = isPlaying
    ? styles.statusPlaying
    : isBuffering
    ? styles.statusBuffering
    : isCued
    ? styles.statusReady
    : isPaused
    ? styles.statusPaused
    : isError
    ? styles.statusError
    : '';

  const effectiveDuration = duration || selectedTrack?.durationSeconds || 0;

  return (
    <div className={styles.nowPlayingPanel}>
      {/* 1. Header with compact playback status badge */}
      <div className={styles.nowPlayingHeader}>
        <div className={styles.nowPlayingHeaderLeft}>
          <Disc size={15} className={`${styles.discIcon} ${isPlaying ? styles.spinDisc : ''}`} />
          <span className={styles.nowPlayingLabel}>NOW PLAYING</span>
        </div>

        <div className={styles.nowPlayingHeaderRight}>
          <span className={`${styles.statusBadge} ${statusClass}`}>
            {isPlaying && <span className={styles.pulsingDot} />}
            {isBuffering && <span className={styles.bufferingDot} />}
            <span>{statusLabel}</span>
          </span>
        </div>
      </div>

      {/* 2. Visible YouTube Video Player (Compliant with YouTube Developer Policy) */}
      <YouTubePlayer containerId={containerId} isReady={isReady} />

      {/* 3 & 4. Track Title & Creator Attribution Block */}
      <div className={styles.trackMetaBlock}>
        <h4 className={styles.nowPlayingTitle} title={selectedTrack?.title || 'No Track Selected'}>
          {selectedTrack ? selectedTrack.title : 'Select a track to start listening'}
        </h4>
        <div className={styles.channelRow}>
          <span className={styles.nowPlayingChannel}>
            {selectedTrack?.channelTitle || 'TQV Curated Audio Focus'}
          </span>
          <span className={styles.sourceTag}>
            <Radio size={11} aria-hidden="true" />
            <span>YouTube Music</span>
          </span>
        </div>
      </div>

      {/* 5. Playback Waveform (Dedicated Full-Width Animated Row) */}
      <div className={styles.waveformSection}>
        <WaveformVisualizer
          videoId={selectedTrack?.videoId}
          playbackState={playbackState}
        />
      </div>

      {/* 6. Playback Scrubber & Time Labels (Completely Independent Component) */}
      <div className={styles.progressSection}>
        <PlaybackProgress
          currentTime={currentTime}
          duration={effectiveDuration}
          onSeek={onSeek}
        />
      </div>

      {/* 7. External Audio Controls Hierarchy */}
      <div className={styles.controlsSection}>
        <PlaybackControls
          playbackState={playbackState}
          shuffle={shuffle}
          repeat={repeat}
          onTogglePlay={onTogglePlay}
          onPrev={onPrev}
          onNext={onNext}
          onSeekBackward={onSeekBackward}
          onSeekForward={onSeekForward}
          onToggleShuffle={onToggleShuffle}
          onToggleRepeat={onToggleRepeat}
          hasTrack={Boolean(selectedTrack)}
          duration={effectiveDuration}
        />
      </div>

      {/* 8. Panel Footer Attribution & External Link */}
      <div className={styles.nowPlayingFooter}>
        <span className={styles.complianceNote}>
          Embedded via YouTube IFrame API &bull; Privacy-Enhanced Mode
        </span>
        {selectedTrack && (
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.openStreamLink}
            aria-label="Open playlist on YouTube Music"
          >
            <span>Open in YouTube Music</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
};
