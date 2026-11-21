/**
 * YouTube Music / Audio Focus Stream Configuration
 *
 * Safe URL parser:
 * Accepts:
 *  - music.youtube.com/playlist?list=ID
 *  - www.youtube.com/playlist?list=ID
 *  - youtube.com/playlist?list=ID
 *  - youtube.com/watch?v=...&list=ID
 *  - youtu.be/...
 *
 * Generates privacy-enhanced embed URL:
 * https://www.youtube-nocookie.com/embed?listType=playlist&list=ID
 */

export interface ListeningRoomConfig {
  title: string;
  subtitle: string;
  description: string;
  playlistUrl: string;
}

export function parseYouTubePlaylistId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  let trimmed = url.trim();
  if (!trimmed) return null;

  // Ensure protocol is present for URL parser if domain was passed directly
  if (!/^https?:\/\//i.test(trimmed) && trimmed.includes('.')) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    const listParam = parsed.searchParams.get('list');
    if (listParam && /^[a-zA-Z0-9_-]+$/.test(listParam)) {
      return listParam;
    }
  } catch {
    // If not a full URL, check if raw playlist ID was provided directly
    if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) {
      return trimmed;
    }
  }

  return null;
}

export function getEmbedUrl(playlistId: string | null): string | null {
  if (!playlistId) return null;
  return `https://www.youtube-nocookie.com/embed?listType=playlist&list=${encodeURIComponent(playlistId)}`;
}

export const LISTENING_ROOM_CONFIG: ListeningRoomConfig = {
  title: 'TQV / LISTENING ROOM',
  subtitle: 'Deep Work & Engineering Flow Cadence',
  description:
    'Curated auditory backdrop for sustained cognitive focus, architectural modeling, and late-night terminal sessions on Arch Linux.',
  playlistUrl: 'https://music.youtube.com/playlist?list=PLV8hEip3Kp-o&si=-JKQxyT7mPmNZQq1',
};
