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

  return (
    <div className={styles.nowPlayingPanel}>
      {/* Panel Header */}
      <div className={styles.nowPlayingHeader}>
        <div className={styles.nowPlayingHeaderLeft}>
          <Disc size={15} className={`${styles.discIcon} ${isPlaying ? styles.spinDisc : ''}`} />
          <span className={styles.nowPlayingLabel}>NOW PLAYING</span>
        </div>

        <div className={styles.nowPlayingHeaderRight}>
          <span
            className={`${styles.statusBadge} ${
              isPlaying
                ? styles.statusPlaying
                : isBuffering
                ? styles.statusBuffering
                : isCued
                ? styles.statusReady
                : isPaused
                ? styles.statusPaused
                : isError
                ? styles.statusError
                : ''
            }`}
          >
            {isPlaying && <span className={styles.pulsingDot} />}
            {isBuffering && <span className={styles.bufferingDot} />}
            <span>{statusLabel}</span>
          </span>
        </div>
      </div>

      {/* Visible YouTube Player (strictly compliant with YouTube Developer Policy) */}
      <YouTubePlayer containerId={containerId} isReady={isReady} />

      {/* Track Metadata Section */}
      <div className={styles.nowPlayingInfo}>
        <div className={styles.titleChannelBlock}>
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

        {/* Dynamic Animated Waveform */}
        <WaveformVisualizer playbackState={playbackState} />
      </div>

      {/* Playback Scrubber & Time */}
      <PlaybackProgress
        currentTime={currentTime}
        duration={duration || selectedTrack?.durationSeconds || 0}
        onSeek={onSeek}
      />

      {/* External Audio Controls */}
      <div className={styles.controlsSection}>
        <PlaybackControls
          playbackState={playbackState}
          shuffle={shuffle}
          repeat={repeat}
          onTogglePlay={onTogglePlay}
          onPrev={onPrev}
          onNext={onNext}
          onToggleShuffle={onToggleShuffle}
          onToggleRepeat={onToggleRepeat}
          hasTrack={Boolean(selectedTrack)}
        />
      </div>

      {/* Panel Footer */}
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
