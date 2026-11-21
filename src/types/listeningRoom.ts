/**
 * Types for TQV Engineering Lab — Listening Room
 */

export interface PlaylistTrack {
  playlistItemId: string;
  videoId: string;
  position: number;
  title: string;
  channelTitle: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  embeddable: boolean;
  madeForKids?: boolean;
}

export interface PlaylistApiResponse {
  playlistId: string;
  playlistTitle: string | null;
  totalResults: number;
  tracks: PlaylistTrack[];
  nextPageToken: string | null;
  fetchedAt: string;
  error?: string;
  message?: string;
}

export type PlaybackState = 'UNSTARTED' | 'ENDED' | 'PLAYING' | 'PAUSED' | 'BUFFERING' | 'CUED' | 'ERROR';

export type RepeatMode = 'off' | 'all' | 'one';

export interface ListeningRoomConfig {
  title: string;
  subtitle: string;
  description: string;
  playlistUrl: string;
  defaultPlaylistId: string;
}
