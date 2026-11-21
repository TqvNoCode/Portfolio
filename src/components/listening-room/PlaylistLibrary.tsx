import React from 'react';
import { RotateCw, ExternalLink, KeyRound, AlertTriangle, Music } from 'lucide-react';
import type { PlaylistTrack, PlaybackState } from '../../types/listeningRoom';
import { PlaylistSearch } from './PlaylistSearch';
import { PlaylistTrackRow } from './PlaylistTrackRow';
import styles from './ListeningRoom.module.css';

interface PlaylistLibraryProps {
  tracks: PlaylistTrack[];
  filteredTracks: PlaylistTrack[];
  totalResults: number;
  playlistTitle: string;
  selectedTrack: PlaylistTrack | null;
  playbackState: PlaybackState;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  errorCode: string | null;
  lastSyncedAt: Date | null;
  nextPageToken: string | null;
  searchQuery: string;
  playlistUrl: string;
  onSearchChange: (query: string) => void;
  onSelectTrack: (track: PlaylistTrack) => void;
  onRefresh: () => void;
  onLoadMore: () => void;
}

export const PlaylistLibrary: React.FC<PlaylistLibraryProps> = ({
  tracks,
  filteredTracks,
  totalResults,
  playlistTitle,
  selectedTrack,
  playbackState,
  isLoading,
  isRefreshing,
  error,
  errorCode,
  lastSyncedAt,
  nextPageToken,
  searchQuery,
  playlistUrl,
  onSearchChange,
  onSelectTrack,
  onRefresh,
  onLoadMore,
}) => {
  const isPlaying = playbackState === 'PLAYING';

  return (
    <div className={styles.libraryPanel}>
      {/* Library Top Header */}
      <div className={styles.libraryHeader}>
        <div className={styles.libraryTitleArea}>
          <div className={styles.titleWithBadge}>
            <h3 className={styles.libraryTitle}>{playlistTitle}</h3>
            <span className={styles.trackCountBadge}>
              {totalResults > 0 ? `${totalResults} Tracks` : `${tracks.length} Tracks`}
            </span>
          </div>
          {lastSyncedAt && (
            <span className={styles.lastSyncedText}>
              Synced {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        <div className={styles.libraryActions}>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing || isLoading}
            className={`${styles.refreshButton} ${isRefreshing ? styles.refreshing : ''}`}
            aria-label="Refresh playlist from YouTube Music"
            title="Refresh playlist metadata"
          >
            <RotateCw size={14} className={isRefreshing ? styles.spinIcon : ''} />
            <span className={styles.refreshBtnText}>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchSection}>
        <PlaylistSearch
          value={searchQuery}
          onChange={onSearchChange}
          totalLoaded={tracks.length}
          filteredCount={filteredTracks.length}
        />
      </div>

      {/* Main Track List Region */}
      <div className={styles.trackListScrollArea} role="region" aria-label="Playlist tracks">
        {isLoading && tracks.length === 0 ? (
          // Loading Skeletons
          <div className={styles.skeletonContainer}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeletonRow}>
                <div className={styles.skeletonIndex} />
                <div className={styles.skeletonThumb} />
                <div className={styles.skeletonInfo}>
                  <div className={styles.skeletonLine} style={{ width: '70%' }} />
                  <div className={styles.skeletonLine} style={{ width: '45%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : errorCode === 'API_KEY_MISSING' ? (
          // Waiting for API Key State
          <div className={styles.emptyStateNotice}>
            <div className={styles.emptyNoticeIcon}>
              <KeyRound size={28} />
            </div>
            <h4 className={styles.emptyNoticeTitle}>YouTube Data API Key Required</h4>
            <p className={styles.emptyNoticeDesc}>
              The secure Cloudflare Pages Function requires a Google Cloud API Key in <code>.dev.vars</code> (local) or Cloudflare Secrets (production) to query live tracks.
            </p>
            <div className={styles.emptyNoticeActions}>
              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.openStreamBtn}
              >
                <span>Listen on YouTube Music</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <div className={styles.setupHint}>
              <span>Guide:</span>
              <code>docs/YOUTUBE_DATA_API_SETUP.md</code>
            </div>
          </div>
        ) : error && tracks.length === 0 ? (
          // General Error State
          <div className={styles.emptyStateNotice}>
            <div className={styles.emptyNoticeIcon}>
              <AlertTriangle size={28} />
            </div>
            <h4 className={styles.emptyNoticeTitle}>Unable to Load Playlist</h4>
            <p className={styles.emptyNoticeDesc}>{error}</p>
            <button type="button" onClick={onRefresh} className={styles.retryButton}>
              Try Again
            </button>
          </div>
        ) : filteredTracks.length === 0 ? (
          // Search No Results
          <div className={styles.noSearchResults}>
            <Music size={24} className={styles.noSearchIcon} />
            <p>No tracks matching &ldquo;{searchQuery}&rdquo;</p>
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className={styles.clearFilterLink}
            >
              Clear filter
            </button>
          </div>
        ) : (
          // Render Track Rows
          <div className={styles.trackList}>
            {filteredTracks.map((track, idx) => (
              <PlaylistTrackRow
                key={track.videoId || track.playlistItemId}
                track={track}
                index={idx}
                isSelected={selectedTrack?.videoId === track.videoId}
                isPlaying={isPlaying && selectedTrack?.videoId === track.videoId}
                playbackState={playbackState}
                onSelect={onSelectTrack}
              />
            ))}

            {/* Load More Button */}
            {nextPageToken && !searchQuery && (
              <div className={styles.loadMoreWrapper}>
                <button
                  type="button"
                  onClick={onLoadMore}
                  disabled={isLoading || isRefreshing}
                  className={styles.loadMoreButton}
                >
                  {isLoading ? 'Loading more tracks...' : 'Load more tracks'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
