import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { PlaylistTrack, RepeatMode } from '../../types/listeningRoom';
import { LISTENING_ROOM_CONFIG } from '../../data/listeningRoom';

interface UsePlaylistOptions {
  videoIds: string[];
  currentVideoId?: string | null;
  currentIndex?: number;
  playerDuration?: number;
  onSelectIndex?: (index: number) => void;
  onRefreshPlayer?: () => void;
}

const CACHE_PREFIX = 'tqv_oembed_v1_';

function getCachedMetadata(videoId: string) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(`${CACHE_PREFIX}${videoId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function setCachedMetadata(videoId: string, data: { title: string; channelTitle: string; thumbnailUrl: string; status: 'loaded' | 'unavailable' }) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(`${CACHE_PREFIX}${videoId}`, JSON.stringify(data));
  } catch {}
}

export function usePlaylist({
  videoIds,
  currentVideoId,
  currentIndex = 0,
  playerDuration = 0,
  onSelectIndex,
  onRefreshPlayer,
}: UsePlaylistOptions) {
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Playback navigation state
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);

  const isFetchingRef = useRef<boolean>(false);
  const tracksRef = useRef<PlaylistTrack[]>([]);
  tracksRef.current = tracks;

  // Initialize and update track list whenever videoIds change
  useEffect(() => {
    if (!videoIds || videoIds.length === 0) {
      if (tracks.length === 0) {
        setIsLoading(true);
      }
      return;
    }

    setIsLoading(false);
    setError(null);
    setLastSyncedAt(new Date());

    // Build initial list using cache or deterministic fallbacks
    const newTracks: PlaylistTrack[] = videoIds.map((id, idx) => {
      // Preserve existing loaded track if present
      const existing = tracksRef.current.find((t) => t.videoId === id);
      if (existing && existing.metadataStatus === 'loaded') {
        return { ...existing, position: idx + 1 };
      }

      // Check session storage cache
      const cached = getCachedMetadata(id);
      if (cached) {
        return {
          videoId: id,
          position: idx + 1,
          title: cached.title,
          channelTitle: cached.channelTitle,
          thumbnailUrl: cached.thumbnailUrl,
          durationSeconds: null,
          metadataStatus: cached.status || 'loaded',
          embeddable: cached.status !== 'unavailable',
        };
      }

      // Unresolved track placeholder
      return {
        videoId: id,
        position: idx + 1,
        title: `Track ${idx + 1}`,
        channelTitle: null,
        thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        durationSeconds: null,
        metadataStatus: 'partial',
        embeddable: true,
      };
    });

    setTracks(newTracks);

    // Default select first track if none selected yet
    setSelectedTrackId((prev) => prev || newTracks[0]?.videoId || null);
  }, [videoIds]);

  // Synchronize selected track with player's active video
  useEffect(() => {
    if (currentVideoId) {
      setSelectedTrackId(currentVideoId);
    } else if (typeof currentIndex === 'number' && tracks[currentIndex]) {
      setSelectedTrackId(tracks[currentIndex].videoId);
    }
  }, [currentVideoId, currentIndex, tracks]);

  // Update duration for the currently selected track when player provides it
  useEffect(() => {
    if (playerDuration > 0 && selectedTrackId) {
      setTracks((prev) =>
        prev.map((t) =>
          t.videoId === selectedTrackId && (!t.durationSeconds || t.durationSeconds === 0)
            ? { ...t, durationSeconds: Math.round(playerDuration) }
            : t
        )
      );
    }
  }, [playerDuration, selectedTrackId]);

  // Bounded Concurrency Metadata Fetching (oEmbed)
  useEffect(() => {
    const pendingTracks = tracks.filter((t) => t.metadataStatus === 'partial');
    if (pendingTracks.length === 0 || isFetchingRef.current) return;

    isFetchingRef.current = true;
    let isCancelled = false;

    const fetchSingleMetadata = async (videoId: string, position: number) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(
          `https://www.youtube.com/watch?v=${videoId}`
        )}`;

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          const meta = {
            title: data.title || `Track ${position}`,
            channelTitle: data.author_name || 'YouTube Creator',
            thumbnailUrl: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            status: 'loaded' as const,
          };
          setCachedMetadata(videoId, meta);
          return { videoId, ...meta, embeddable: true };
        } else {
          // Video unavailable or restricted
          const fallback = {
            title: `Track ${position}`,
            channelTitle: 'YouTube Creator',
            thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            status: 'unavailable' as const,
          };
          setCachedMetadata(videoId, fallback);
          return { videoId, ...fallback, embeddable: false };
        }
      } catch {
        return {
          videoId,
          title: `Track ${position}`,
          channelTitle: 'YouTube Creator',
          thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          status: 'unavailable' as const,
          embeddable: true,
        };
      }
    };

    // Worker pool with 4 concurrent requests
    const CONCURRENCY = 4;
    let poolIndex = 0;

    const runWorker = async () => {
      while (poolIndex < pendingTracks.length && !isCancelled) {
        const item = pendingTracks[poolIndex++];
        const result = await fetchSingleMetadata(item.videoId, item.position);
        if (isCancelled) break;

        setTracks((prev) =>
          prev.map((t) =>
            t.videoId === result.videoId
              ? {
                  ...t,
                  title: result.title,
                  channelTitle: result.channelTitle,
                  thumbnailUrl: result.thumbnailUrl,
                  metadataStatus: result.status,
                  embeddable: result.embeddable,
                }
              : t
          )
        );
      }
    };

    Promise.all(Array.from({ length: CONCURRENCY }, () => runWorker())).finally(() => {
      isFetchingRef.current = false;
    });

    return () => {
      isCancelled = true;
      isFetchingRef.current = false;
    };
  }, [tracks]);

  // Currently selected track object
  const selectedTrack = useMemo(() => {
    return tracks.find((t) => t.videoId === selectedTrackId) || tracks[0] || null;
  }, [tracks, selectedTrackId]);

  // Filtered tracks for search
  const filteredTracks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tracks;
    return tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.channelTitle && t.channelTitle.toLowerCase().includes(q))
    );
  }, [tracks, searchQuery]);

  // Track selection
  const selectTrack = useCallback(
    (track: PlaylistTrack) => {
      setSelectedTrackId(track.videoId);
      if (onSelectIndex) {
        onSelectIndex(track.position - 1);
      }
    },
    [onSelectIndex]
  );

  // Manual Refresh with cooldown
  const refreshPlaylist = useCallback(async () => {
    const now = Date.now();
    if (now < cooldownUntil || isRefreshing) return;

    setCooldownUntil(now + 3000);
    setIsRefreshing(true);

    if (onRefreshPlayer) {
      onRefreshPlayer();
    }

    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncedAt(new Date());
    }, 800);
  }, [cooldownUntil, isRefreshing, onRefreshPlayer]);

  // Navigation handlers
  const toggleShuffle = useCallback(() => {
    setShuffle((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  return {
    tracks,
    filteredTracks,
    totalResults: tracks.length,
    selectedTrack,
    isLoading,
    isRefreshing,
    error,
    lastSyncedAt,
    searchQuery,
    setSearchQuery,
    shuffle,
    repeat,
    selectTrack,
    refreshPlaylist,
    toggleShuffle,
    toggleRepeat,
    playlistUrl: LISTENING_ROOM_CONFIG.playlistUrl,
  };
}