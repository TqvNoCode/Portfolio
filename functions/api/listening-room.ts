/**
 * Cloudflare Pages Function: Public YouTube oEmbed Fallback Proxy
 * Route: GET /api/listening-room?videoId=VIDEO_ID
 *
 * Architecture:
 * - NO API KEY or Google Cloud credentials required.
 * - Validates YouTube video ID format strictly (^[a-zA-Z0-9_-]{11}$).
 * - Forwards to YouTube public oEmbed endpoint.
 * - Protects against open proxy abuse by restricting strictly to YouTube watch URLs.
 */

interface Env {
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

const VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export const onRequestGet = async (context: EventContext<Env, any, any>): Promise<Response> => {
  const { request } = context;
  const url = new URL(request.url);
  const videoId = url.searchParams.get('videoId')?.trim();

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Cache-Control',
    'Cache-Control': 'public, max-age=86400',
  });

  if (!videoId || !VIDEO_ID_REGEX.test(videoId)) {
    return new Response(
      JSON.stringify({
        error: 'INVALID_VIDEO_ID',
        message: 'A valid 11-character YouTube videoId query parameter is required.',
      }),
      { status: 400, headers }
    );
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(
      `https://www.youtube.com/watch?v=${videoId}`
    )}`;

    const upstreamRes = await fetch(oembedUrl);
    if (!upstreamRes.ok) {
      return new Response(
        JSON.stringify({
          videoId,
          title: `Track ${videoId}`,
          author_name: 'YouTube Creator',
          thumbnail_url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          metadataStatus: 'unavailable',
          embeddable: false,
        }),
        { status: upstreamRes.status, headers }
      );
    }

    const data = (await upstreamRes.json()) as any;
    return new Response(
      JSON.stringify({
        videoId,
        title: data.title || `Track ${videoId}`,
        author_name: data.author_name || 'YouTube Creator',
        thumbnail_url: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        metadataStatus: 'loaded',
        embeddable: true,
      }),
      { status: 200, headers }
    );
  } catch {
    return new Response(
      JSON.stringify({
        error: 'UPSTREAM_ERROR',
        message: 'Failed to retrieve metadata from YouTube oEmbed service.',
      }),
      { status: 502, headers }
    );
  }
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Cache-Control',
    },
  });
};