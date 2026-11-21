import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PlaylistTrack, PlaylistApiResponse, RepeatMode } from '../../types/listeningRoom';
import { LISTENING_ROOM_CONFIG } from '../../data/listeningRoom';

export function usePlaylist() {
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  const [playlistTitle, setPlaylistTitle] = useState<string>('OLD BUT GOLD');
  const [totalResults, setTotalResults] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  // Playback queue state
  const [selectedTrack, setSelectedTrack] = useState<PlaylistTrack | null>(null);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);

  // Fetch playlist data
  const fetchPlaylist = useCallback(async (token: string | null = null, isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else if (!token) {
      setIsLoading(true);
    }

    try {
      const url = new URL('/api/listening-room', window.location.origin);
      if (token) {
        url.searchParams.set('pageToken', token);
      }

      const res = await fetch(url.toString(), {
        headers: isManualRefresh ? { 'Cache-Control': 'no-cache' } : {},
      });

      const data: PlaylistApiResponse = await res.json();

      if (!res.ok || data.error) {
        setError(data.message || 'Failed to load playlist data.');
        setErrorCode(data.error || 'API_ERROR');
        if (data.playlistTitle) setPlaylistTitle(data.playlistTitle);
        return;
      }

      setError(null);
      setErrorCode(null);

      if (token) {
        // Appending page results
        setTracks((prev) => {
          const existingIds = new Set(prev.map((t) => t.videoId));
          const newTracks = data.tracks.filter((t) => !existingIds.has(t.videoId));
          return [...prev, ...newTracks];
        });
      } else {
        // Fresh list replacement
        setTracks(data.tracks);
        setLastSyncedAt(new Date(data.fetchedAt));

        // Preserve current selected track or select first track
        setSelectedTrack((prev) => {
          if (!prev) return data.tracks[0] || null;
          const found = data.tracks.find((t) => t.videoId === prev.videoId);
          return found || prev;
        });
      }

      if (data.playlistTitle) {
        setPlaylistTitle(data.playlistTitle);
      }
      setTotalResults(data.totalResults || data.tracks.length);
      setNextPageToken(data.nextPageToken || null);
    } catch (err: any) {
      console.warn('Playlist fetch failed:', err);
      setError('Unable to connect to playlist metadata service.');
      setErrorCode('NETWORK_ERROR');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load on page load / mount
  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  // Manual refresh with 3s cooldown
  const refreshPlaylist = useCallback(async () => {
    const now = Date.now();
    if (now < cooldownUntil || isRefreshing) return;

    setCooldownUntil(now + 3000);
    await fetchPlaylist(null, true);
  }, [cooldownUntil, isRefreshing, fetchPlaylist]);

  // Load more pages
  const loadMore = useCallback(async () => {
    if (!nextPageToken || isLoading || isRefreshing) return;
    await fetchPlaylist(nextPageToken, false);
  }, [nextPageToken, isLoading, isRefreshing, fetchPlaylist]);

  // Search filter
  const filteredTracks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tracks;
    return tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.channelTitle.toLowerCase().includes(query)
    );
  }, [tracks, searchQuery]);

  // Track selection
  const selectTrack = useCallback((track: PlaylistTrack) => {
    setSelectedTrack(track);
  }, []);

  // Current track index
  const currentTrackIndex = useMemo(() => {
    if (!selectedTrack) return -1;
    return tracks.findIndex((t) => t.videoId === selectedTrack.videoId);
  }, [tracks, selectedTrack]);

  // Next track in queue
  const nextTrack = useCallback(() => {
    if (tracks.length === 0) return null;

    if (repeat === 'one' && selectedTrack) {
      return selectedTrack;
    }

    if (shuffle) {
      const candidates = tracks.filter((t) => t.videoId !== selectedTrack?.videoId);
      if (candidates.length === 0) return selectedTrack;
      const randomIdx = Math.floor(Math.random() * candidates.length);
      const next = candidates[randomIdx];
      setSelectedTrack(next);
      return next;
    }

    const nextIdx = currentTrackIndex + 1;
    if (nextIdx < tracks.length) {
      const next = tracks[nextIdx];
      setSelectedTrack(next);
      return next;
    } else if (repeat === 'all' && tracks.length > 0) {
      const first = tracks[0];
      setSelectedTrack(first);
      return first;
    }

    return null;
  }, [tracks, currentTrackIndex, shuffle, repeat, selectedTrack]);

  // Previous track in queue
  const prevTrack = useCallback(() => {
    if (tracks.length === 0) return null;

    if (shuffle) {
      const candidates = tracks.filter((t) => t.videoId !== selectedTrack?.videoId);
      if (candidates.length === 0) return selectedTrack;
      const randomIdx = Math.floor(Math.random() * candidates.length);
      const prev = candidates[randomIdx];
      setSelectedTrack(prev);
      return prev;
    }

    const prevIdx = currentTrackIndex - 1;
    if (prevIdx >= 0) {
      const prev = tracks[prevIdx];
      setSelectedTrack(prev);
      return prev;
    } else if (repeat === 'all' && tracks.length > 0) {
      const last = tracks[tracks.length - 1];
      setSelectedTrack(last);
      return last;
    }

    return null;
  }, [tracks, currentTrackIndex, shuffle, repeat, selectedTrack]);

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
    playlistTitle,
    totalResults,
    isLoading,
    isRefreshing,
    error,
    errorCode,
    lastSyncedAt,
    nextPageToken,
    selectedTrack,
    currentTrackIndex,
    searchQuery,
    setSearchQuery,
    selectTrack,
    nextTrack,
    prevTrack,
    refreshPlaylist,
    loadMore,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
    playlistUrl: LISTENING_ROOM_CONFIG.playlistUrl,
  };
}
