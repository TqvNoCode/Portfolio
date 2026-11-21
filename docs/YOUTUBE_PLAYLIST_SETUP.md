# YouTube Playlist Setup & Architecture Guide

The **TQV Engineering Lab — Listening Room** uses a client-driven, zero-credential architecture powered by the official **YouTube IFrame Player API** and **YouTube oEmbed**.

**No Google Cloud Project, YouTube Data API v3, or API keys are required.**

---

## 1. Where to Configure Your Playlist

The playlist is configured as a public setting in a single central file:

[`src/data/listeningRoom.ts`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/data/listeningRoom.ts)

```typescript
export const LISTENING_ROOM_CONFIG: ListeningRoomConfig = {
  eyebrow: 'TQV / LISTENING ROOM',
  title: 'Engineering Flow',
  subtitle: 'A personal soundtrack for deep work, technical exploration, and late-night engineering sessions.',
  description: 'A personal soundtrack for deep work, technical exploration, and late-night engineering sessions.',
  playlistUrl: 'https://music.youtube.com/playlist?list=PLV8hEip3Kp-o',
  defaultPlaylistId: 'PLV8hEip3Kp-o',
};
```

To use a different playlist:
1. Copy the playlist URL from YouTube or YouTube Music.
2. Update `playlistUrl` and `defaultPlaylistId` in [`src/data/listeningRoom.ts`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/data/listeningRoom.ts).
3. The application automatically normalizes and parses the playlist identifier.

---

## 2. How Playlist Discovery Works

1. The embedded YouTube player is initialized with the playlist:
   ```javascript
   playerVars: {
     listType: 'playlist',
     list: 'PLV8hEip3Kp-o',
     autoplay: 0,
     controls: 1,
     enablejsapi: 1
   }
   ```
2. When the player signals readiness (`onReady` / `CUED`), the application calls `player.getPlaylist()`.
3. This retrieves the authentic array of video IDs in their current playlist order directly from YouTube's streaming engine.
4. If YouTube takes a moment to cue the list, a controlled readiness strategy retries up to 6 times at 300ms intervals before displaying a status message.

---

## 3. How Track Metadata Retrieval Works

1. For each discovered video ID, the client requests basic metadata from YouTube's public oEmbed endpoint:
   ```text
   https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=VIDEO_ID
   ```
2. **Bounded Concurrency**: Requests are processed in a lightweight worker pool with a maximum concurrency of 4–5 requests to avoid network congestion.
3. **Lightweight Caching**: Successfully fetched metadata is cached in `sessionStorage` by video ID, making subsequent page views instant.
4. **Resilience**: A failure to retrieve metadata for any single track never breaks the rest of the playlist. Unresolved tracks fall back to standard YouTube thumbnail CDNs (`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`).

---

## 4. Handling Unavailable or Incomplete Tracks

- **Duration**: YouTube's oEmbed endpoint provides title, author, and thumbnail, but does not provide duration. The application displays a neutral `--:--` placeholder for queued tracks and synchronizes the exact duration dynamically via `player.getDuration()` as each song loads into the player.
- **Unavailable / Restricted Videos**: Videos deleted by creators or disallowed from external embedding are badged as `Restricted` in the playlist. Selecting a restricted track transitions the player badge to `RESTRICTED` without crashing playback.

---

## 5. Troubleshooting the Embedded Player

1. **Player Shows Standby / Ready but Does Not Play**:
   - Modern browsers require user interaction before allowing audio playback. Click the Play button or select any track row.
2. **Third-Party Cookie Blockers**:
   - The player uses standard privacy-respecting YouTube embedding. If an adblocker blocks `www.youtube.com`, allow `youtube.com` for local preview.
3. **Playlist Changes**:
   - Click the **Refresh** button in the playlist header to re-cue the playlist and fetch metadata for any newly added songs.
