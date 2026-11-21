/**
 * YouTube Music / Audio Focus Stream Configuration
 */

export interface ListeningRoomConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  playlistUrl: string;
  defaultPlaylistId: string;
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

export function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === undefined || isNaN(seconds) || seconds < 0) {
    return '--:--';
  }
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getEmbedUrl(playlistId: string | null): string | null {
  if (!playlistId) return null;
  return `https://www.youtube-nocookie.com/embed?listType=playlist&list=${encodeURIComponent(playlistId)}`;
}

export const LISTENING_ROOM_CONFIG: ListeningRoomConfig = {
  eyebrow: 'TQV / LISTENING ROOM',
  title: 'Engineering Flow',
  subtitle: 'A personal soundtrack for deep work, technical exploration, and late-night engineering sessions.',
  description: 'A personal soundtrack for deep work, technical exploration, and late-night engineering sessions.',
  playlistUrl: 'https://music.youtube.com/playlist?list=PLV8hEip3Kp-o&si=-JKQxyT7mPmNZQq1',
  defaultPlaylistId: 'PLV8hEip3Kp-o',
};
