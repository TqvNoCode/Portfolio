/**
 * YouTube Music / Audio Focus Stream Configuration
 *
 * Safe URL parser:
 * Accepts:
 *  - music.youtube.com/playlist?list=ID
 *  - www.youtube.com/playlist?list=ID
 *  - youtube.com/watch?v=...&list=ID
 *  - youtu.be/...
 *
 * Generates privacy-enhanced embed URL:
 * https://www.youtube-nocookie.com/embed/videoseries?list=ID
 */

export interface ListeningRoomConfig {
  title: string;
  subtitle: string;
  description: string;
  playlistUrl: string;
}

export function parseYouTubePlaylistId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const listParam = parsed.searchParams.get('list');
    if (listParam && /^[a-zA-Z0-9_-]+$/.test(listParam)) {
      return listParam;
    }
  } catch {
    // If not a full URL, check if raw playlist ID was provided
    if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) {
      return trimmed;
    }
  }

  return null;
}

export function getEmbedUrl(playlistId: string | null): string | null {
  if (!playlistId) return null;
  return `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(playlistId)}`;
}

export const LISTENING_ROOM_CONFIG: ListeningRoomConfig = {
  title: 'TQV / LISTENING ROOM',
  subtitle: 'Deep Work & Engineering Flow Cadence',
  description:
    'Curated auditory backdrop for sustained cognitive focus, architectural modeling, and late-night terminal sessions on Arch Linux.',
  // Initially empty per specification; handles empty state gracefully
  playlistUrl: '',
};
