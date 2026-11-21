/**
 * Cloudflare Pages Function: Secure YouTube Data API Proxy
 * Route: GET /api/listening-room
 *
 * Capabilities:
 * - Reads YOUTUBE_API_KEY (secret) and YOUTUBE_PLAYLIST_ID (variable) from context.env
 * - Enforces fixed playlist target (prevents open proxy vulnerabilities)
 * - Queries YouTube Data API v3 playlistItems.list & batched videos.list
 * - Returns normalized JSON playlist metadata with durations & embeddable status
 * - Never leaks the API key or raw Google URLs in responses or logs
 */

interface Env {
  YOUTUBE_API_KEY?: string;
  YOUTUBE_PLAYLIST_ID?: string;
}

interface EventContext<Env, P extends string, Data> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env;
  params: Record<P, string | string[]>;
  data: Data;
}

interface NormalizedTrack {
  playlistItemId: string;
  videoId: string;
  position: number;
  title: string;
  channelTitle: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  embeddable: boolean;
  madeForKids: boolean;
}

const DEFAULT_PLAYLIST_ID = 'PLV8hEip3Kp-o';

/**
 * Parses ISO 8601 duration format (e.g., PT3M45S -> 225)
 */
function parseISO8601Duration(duration: string | undefined): number | null {
  if (!duration || typeof duration !== 'string') return null;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export const onRequestGet = async (context: EventContext<Env, any, any>): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url, 'http://localhost');

  const playlistId = env.YOUTUBE_PLAYLIST_ID?.trim() || DEFAULT_PLAYLIST_ID;
  const apiKey = env.YOUTUBE_API_KEY?.trim();

  // CORS & Security headers
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Cache-Control',
  });

  // Check if API key is configured
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'API_KEY_MISSING',
        message: 'YouTube Data API key is not configured in Cloudflare Pages environment variables. See docs/YOUTUBE_DATA_API_SETUP.md for setup instructions.',
        playlistId,
        playlistTitle: null,
        totalResults: 0,
        tracks: [],
        nextPageToken: null,
        fetchedAt: new Date().toISOString(),
      }),
      { status: 503, headers }
    );
  }

  const pageToken = url.searchParams.get('pageToken') || '';

  try {
    // 1. Fetch playlist metadata and items in parallel if on initial page
    const playlistItemsUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    playlistItemsUrl.searchParams.set('part', 'snippet,contentDetails');
    playlistItemsUrl.searchParams.set('playlistId', playlistId);
    playlistItemsUrl.searchParams.set('maxResults', '50');
    if (pageToken) {
      playlistItemsUrl.searchParams.set('pageToken', pageToken);
    }
    playlistItemsUrl.searchParams.set('key', apiKey);

    // If initial page, also fetch playlist title
    let playlistTitlePromise: Promise<string | null> = Promise.resolve(null);
    if (!pageToken) {
      const playlistMetaUrl = new URL('https://www.googleapis.com/youtube/v3/playlists');
      playlistMetaUrl.searchParams.set('part', 'snippet');
      playlistMetaUrl.searchParams.set('id', playlistId);
      playlistMetaUrl.searchParams.set('key', apiKey);

      playlistTitlePromise = fetch(playlistMetaUrl.toString())
        .then((res) => (res.ok ? res.json() : null))
        .then((data: any) => data?.items?.[0]?.snippet?.title || null)
        .catch(() => null);
    }

    const [itemsResponse, playlistTitle] = await Promise.all([
      fetch(playlistItemsUrl.toString()),
      playlistTitlePromise,
    ]);

    if (!itemsResponse.ok) {
      const status = itemsResponse.status;
      let errMessage = 'Failed to fetch playlist items from YouTube Data API.';
      if (status === 404) errMessage = 'Playlist not found on YouTube.';
      if (status === 403) errMessage = 'YouTube Data API quota exceeded or key invalid.';

      return new Response(
        JSON.stringify({
          error: 'UPSTREAM_API_ERROR',
          status,
          message: errMessage,
          playlistId,
          tracks: [],
          nextPageToken: null,
          fetchedAt: new Date().toISOString(),
        }),
        { status, headers }
      );
    }

    const itemsData: any = await itemsResponse.json();
    const rawItems: any[] = itemsData.items || [];
    const nextPageToken = itemsData.nextPageToken || null;
    const totalResults = itemsData.pageInfo?.totalResults || rawItems.length;

    // 2. Batch fetch video durations and embeddable status
    const videoIds = rawItems
      .map((item) => item.contentDetails?.videoId || item.snippet?.resourceId?.videoId)
      .filter((id): id is string => Boolean(id) && id !== 'private' && id !== 'deleted');

    const videoDetailsMap = new Map<string, { duration: number | null; embeddable: boolean; madeForKids: boolean }>();

    if (videoIds.length > 0) {
      const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
      videosUrl.searchParams.set('part', 'contentDetails,status');
      videosUrl.searchParams.set('id', videoIds.join(','));
      videosUrl.searchParams.set('key', apiKey);

      try {
        const videosRes = await fetch(videosUrl.toString());
        if (videosRes.ok) {
          const videosData: any = await videosRes.json();
          for (const v of videosData.items || []) {
            videoDetailsMap.set(v.id, {
              duration: parseISO8601Duration(v.contentDetails?.duration),
              embeddable: v.status?.embeddable !== false,
              madeForKids: Boolean(v.status?.madeForKids),
            });
          }
        }
      } catch {
        // Non-blocking: continue without duration metadata if video detail fetch fails
      }
    }

    // 3. Normalize track objects
    const tracks: NormalizedTrack[] = rawItems.map((item, idx) => {
      const snippet = item.snippet || {};
      const videoId = item.contentDetails?.videoId || snippet.resourceId?.videoId || '';
      const videoDetails = videoDetailsMap.get(videoId);

      // Best available thumbnail: maxres -> standard -> high -> medium -> default
      const thumbs = snippet.thumbnails || {};
      const thumbUrl =
        thumbs.maxres?.url ||
        thumbs.standard?.url ||
        thumbs.high?.url ||
        thumbs.medium?.url ||
        thumbs.default?.url ||
        (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);

      return {
        playlistItemId: item.id || `track-${idx}`,
        videoId,
        position: typeof snippet.position === 'number' ? snippet.position + 1 : idx + 1,
        title: snippet.title || 'Untitled Track',
        channelTitle: snippet.videoOwnerChannelTitle || snippet.channelTitle || 'Unknown Creator',
        thumbnailUrl: thumbUrl,
        durationSeconds: videoDetails ? videoDetails.duration : null,
        embeddable: videoDetails ? videoDetails.embeddable : true,
        madeForKids: videoDetails ? videoDetails.madeForKids : false,
      };
    });

    // Cache-Control: if client specifically requests no-cache, respect it; otherwise 5-min CDN cache
    const clientCache = request.headers.get('Cache-Control');
    if (clientCache && clientCache.includes('no-cache')) {
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    } else {
      headers.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    }

    return new Response(
      JSON.stringify({
        playlistId,
        playlistTitle: playlistTitle || 'OLD BUT GOLD',
        totalResults,
        tracks,
        nextPageToken,
        fetchedAt: new Date().toISOString(),
      }),
      { status: 200, headers }
    );
  } catch (err: any) {
    const isNetwork = err?.cause?.code === 'EAI_AGAIN' || err?.message?.includes('fetch failed');
    return new Response(
      JSON.stringify({
        error: isNetwork ? 'NETWORK_ERROR' : 'INTERNAL_ERROR',
        message: isNetwork
          ? 'Network resolution error connecting to YouTube Data API.'
          : 'Internal error processing playlist metadata.',
        playlistId,
        tracks: [],
        nextPageToken: null,
        fetchedAt: new Date().toISOString(),
      }),
      { status: isNetwork ? 502 : 500, headers }
    );
  }
};
