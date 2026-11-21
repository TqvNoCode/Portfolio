import React, { useEffect, useCallback } from 'react';
import { ExternalLink, Radio } from 'lucide-react';
import { LISTENING_ROOM_CONFIG } from '../../data/listeningRoom';
import { usePlaylist } from './usePlaylist';
import { useYouTubePlayer } from './useYouTubePlayer';
import { PlaylistLibrary } from './PlaylistLibrary';
import { NowPlaying } from './NowPlaying';
import type { PlaylistTrack } from '../../types/listeningRoom';
import styles from './ListeningRoom.module.css';

export const ListeningRoom: React.FC = () => {
  const playlist = usePlaylist();

  // Queue progression when a video finishes
  const handleTrackEnded = useCallback(() => {
    const next = playlist.nextTrack();
    if (next) {
      player.loadVideo(next.videoId, true);
    }
  }, [playlist]);

  const defaultVideoId = '0LuignGmX_0';

  const player = useYouTubePlayer({
    initialVideoId: playlist.selectedTrack?.videoId || defaultVideoId,
    onEnded: handleTrackEnded,
  });

  // Cue initial video when playlist finishes loading without autoplaying
  useEffect(() => {
    if (playlist.selectedTrack && player.isReady && !player.currentVideoId) {
      player.loadVideo(playlist.selectedTrack.videoId, false);
    }
  }, [playlist.selectedTrack, player.currentVideoId, player.isReady, player.loadVideo]);

  // When user explicitly clicks a track row in the library
  const handleSelectTrack = useCallback(
    (track: PlaylistTrack) => {
      playlist.selectTrack(track);
      player.loadVideo(track.videoId, true);
    },
    [playlist, player]
  );

  // Next Track Action
  const handleNext = useCallback(() => {
    const next = playlist.nextTrack();
    if (next) {
      player.loadVideo(next.videoId, true);
    }
  }, [playlist, player]);

  // Previous Track Action
  const handlePrev = useCallback(() => {
    const prev = playlist.prevTrack();
    if (prev) {
      player.loadVideo(prev.videoId, true);
    }
  }, [playlist, player]);

  return (
    <section
      id="listening-room"
      className={styles.listeningSection}
      aria-label="TQV Engineering Lab Audio Cadence and Listening Room"
    >
      <div className={`container ${styles.listeningContainer}`}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.headerTopLine}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowPrefix}>//</span>
              <span>{LISTENING_ROOM_CONFIG.eyebrow}</span>
            </div>
            <a
              href={LISTENING_ROOM_CONFIG.playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceBadge}
              aria-label="Open source playlist on YouTube Music"
            >
              <Radio size={12} aria-hidden="true" />
              <span>YOUTUBE MUSIC SOURCE</span>
              <ExternalLink size={11} aria-hidden="true" />
            </a>
          </div>

          <h2 className={styles.sectionTitle}>{LISTENING_ROOM_CONFIG.title}</h2>
          <p className={styles.sectionLead}>{LISTENING_ROOM_CONFIG.subtitle}</p>
        </div>

        {/* Main Custom Two-Panel Application Container */}
        <div className={styles.twoPanelContainer}>
          {/* Left Panel: Playlist Library (52%) */}
          <PlaylistLibrary
            tracks={playlist.tracks}
            filteredTracks={playlist.filteredTracks}
            totalResults={playlist.totalResults}
            selectedTrack={playlist.selectedTrack}
            playbackState={player.playbackState}
            isLoading={playlist.isLoading}
            isRefreshing={playlist.isRefreshing}
            error={playlist.error}
            errorCode={playlist.errorCode}
            lastSyncedAt={playlist.lastSyncedAt}
            nextPageToken={playlist.nextPageToken}
            searchQuery={playlist.searchQuery}
            playlistUrl={playlist.playlistUrl}
            onSearchChange={playlist.setSearchQuery}
            onSelectTrack={handleSelectTrack}
            onRefresh={playlist.refreshPlaylist}
            onLoadMore={playlist.loadMore}
          />

          {/* Right Panel: Now Playing (48%) */}
          <NowPlaying
            containerId={player.containerId}
            isReady={player.isReady}
            selectedTrack={playlist.selectedTrack}
            playbackState={player.playbackState}
            currentTime={player.currentTime}
            duration={player.duration}
            shuffle={playlist.shuffle}
            repeat={playlist.repeat}
            playlistUrl={playlist.playlistUrl}
            onTogglePlay={player.togglePlay}
            onPrev={handlePrev}
            onNext={handleNext}
            onToggleShuffle={playlist.toggleShuffle}
            onToggleRepeat={playlist.toggleRepeat}
            onSeek={player.seekTo}
          />
        </div>
      </div>
    </section>
  );
};

export default ListeningRoom;
