import React, { useCallback } from 'react';
import { ExternalLink, Radio } from 'lucide-react';
import { LISTENING_ROOM_CONFIG } from '../../data/listeningRoom';
import { usePlaylist } from './usePlaylist';
import { useYouTubePlayer } from './useYouTubePlayer';
import { PlaylistLibrary } from './PlaylistLibrary';
import { NowPlaying } from './NowPlaying';
import type { PlaylistTrack } from '../../types/listeningRoom';
import styles from './ListeningRoom.module.css';

export const ListeningRoom: React.FC = () => {
  const playlistId = LISTENING_ROOM_CONFIG.defaultPlaylistId;

  const player = useYouTubePlayer({
    playlistId,
    onEnded: () => {
      if (playlist.repeat === 'one') {
        player.seekTo(0);
        player.play();
      }
    },
  });

  const playlist = usePlaylist({
    videoIds: player.playlistVideoIds,
    currentVideoId: player.currentVideoId,
    currentIndex: player.currentIndex,
    playerDuration: player.duration,
    onSelectIndex: (index: number) => {
      player.playVideoAt(index);
    },
    onRefreshPlayer: () => {
      player.refreshPlaylist();
    },
  });

  // When user explicitly clicks a track row in the library (resolves against internal shuffled order)
  const handleSelectTrack = useCallback(
    (track: PlaylistTrack) => {
      playlist.selectTrack(track);
      if (track.embeddable === false) {
        player.setError(150);
      } else {
        player.playVideoId(track.videoId, track.position - 1);
      }
    },
    [playlist, player]
  );

  // Next Track Action
  const handleNext = useCallback(() => {
    player.nextVideo();
  }, [player]);

  // Previous Track Action
  const handlePrev = useCallback(() => {
    player.previousVideo();
  }, [player]);

  // Shuffle toggle
  const handleToggleShuffle = useCallback(() => {
    const nextShuffle = !playlist.shuffle;
    playlist.toggleShuffle();
    player.setShuffle(nextShuffle);
  }, [playlist, player]);

  // Repeat toggle
  const handleToggleRepeat = useCallback(() => {
    playlist.toggleRepeat();
    const nextRepeat = playlist.repeat === 'off' ? 'all' : playlist.repeat === 'all' ? 'one' : 'off';
    player.setLoop(nextRepeat === 'all');
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
            lastSyncedAt={playlist.lastSyncedAt}
            searchQuery={playlist.searchQuery}
            playlistUrl={playlist.playlistUrl}
            onSearchChange={playlist.setSearchQuery}
            onSelectTrack={handleSelectTrack}
            onRefresh={playlist.refreshPlaylist}
          />

          {/* Right Panel: Now Playing (48%) */}
          <NowPlaying
            containerId={player.containerId}
            isReady={player.isReady}
            selectedTrack={playlist.selectedTrack}
            playbackState={player.playbackState}
            currentTime={player.currentTime}
            duration={player.duration || playlist.selectedTrack?.durationSeconds || 0}
            shuffle={playlist.shuffle}
            repeat={playlist.repeat}
            playlistUrl={playlist.playlistUrl}
            onTogglePlay={player.togglePlay}
            onPrev={handlePrev}
            onNext={handleNext}
            onToggleShuffle={handleToggleShuffle}
            onToggleRepeat={handleToggleRepeat}
            onSeek={player.seekTo}
          />
        </div>
      </div>
    </section>
  );
};

export default ListeningRoom;