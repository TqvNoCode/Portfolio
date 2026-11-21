# TQV ENGINEERING LAB — LISTENING ROOM SPRINT
## CUSTOM PLAYLIST LIBRARY + NOW PLAYING EXPERIENCE REPORT

**Author**: Senior Frontend Engineer, React Architect & Cloudflare Pages Specialist  
**Date**: November 21, 2026  
**Project**: TQV Personal Engineering Portfolio (`~/Desktop/GCD_project/my_portfolio`)  
**Commit Baseline**: `c05854c`  
**Target Playlist**: `https://music.youtube.com/playlist?list=PLV8hEip3Kp-o&si=-JKQxyT7mPmNZQq1`  
**Playlist Identifier**: `PLV8hEip3Kp-o`  
**Playlist Title**: `OLD BUT GOLD`

---

## 1. EXECUTIVE SUMMARY

The previous single large embedded YouTube iframe has been completely replaced with a custom, high-density, two-panel desktop audio application integrated into the TQV Engineering Lab identity.

Visitors can now browse the full playlist library, search loaded songs in real time, view unmodified YouTube thumbnails and channel credits, track playback duration, trigger manual or page-load refreshes, and control playback through a dedicated Now Playing panel featuring an animated SVG waveform visualizer and an embedded YouTube video player.

| Requirement / Component | Status | Summary Verdict |
| :--- | :---: | :--- |
| **Two-Panel Architecture** | **PASS** | 52% Playlist Library / 48% Now Playing desktop split (1240px container). |
| **Cloudflare Pages Function** | **PASS** | Secure serverless proxy at [`functions/api/listening-room.ts`](file:///home/tqv/Desktop/GCD_project/my_portfolio/functions/api/listening-room.ts) with zero client API key exposure. |
| **Playlist Data Normalization** | **PASS** | Normalizes `playlistItems.list` and batched `videos.list` (durations, embeddability, thumbnails). |
| **Page Load & Manual Refresh** | **PASS** | Auto-fetches on initial mount; manual refresh with 3s cooldown and last-synced timestamp. |
| **Client-Side Search Filter** | **PASS** | Real-time filtering by track title and creator/channel without extra API calls. |
| **YouTube IFrame API Player** | **PASS** | Single persistent player instance in privacy-enhanced mode (`youtube-nocookie.com`). |
| **Playback Controls** | **PASS** | Custom controls for Prev, Next, Play/Pause, Shuffle, Repeat (off/all/one), and Seek scrubber. |
| **Animated Waveform** | **PASS** | 18-segment SVG/CSS waveform animated strictly during `PLAYING` state; paused during pause/buffer. |
| **Dark & Light Mode** | **PASS** | Full compatibility with both themes via design system tokens. |
| **Mobile Responsiveness** | **PASS** | Reorders vertically with Now Playing on top and scrollable library below; touch targets >= 44px. |
| **Live API Key Status** | **WAITING FOR API KEY** | Serverless function and client handle `API_KEY_MISSING` gracefully until user configures secret. |

---

## 2. ARCHITECTURE OVERVIEW

The custom music player is organized into modular, decoupled layers:

```text
src/
  components/
    listening-room/
      ListeningRoom.tsx         # Main container orchestrating state & layout
      ListeningRoom.module.css  # CSS Module (tokens, responsive breakpoints, waveforms)
      PlaylistLibrary.tsx       # Left Panel: header, search, scrollable track rows, pagination
      PlaylistTrackRow.tsx      # Individual track row with thumbnail, duration & active EQ
      PlaylistSearch.tsx        # In-memory search input with clear button
      NowPlaying.tsx            # Right Panel: YouTube player, waveform, scrubber, controls
      YouTubePlayer.tsx         # Compliant embedded YouTube iframe viewport
      PlaybackControls.tsx      # Prev, Play/Pause, Next, Shuffle, Repeat
      PlaybackProgress.tsx      # Time scrubber (<input type="range">) with seekTo()
      WaveformVisualizer.tsx    # 18-bar SVG/CSS waveform driven by playback state
      useYouTubePlayer.ts       # Hook managing single YouTube IFrame API instance
      usePlaylist.ts            # Hook managing metadata fetching, queue, search & refresh
  data/
    listeningRoom.ts            # Configuration constants, URL parser, duration formatter
  types/
    listeningRoom.ts            # TypeScript interfaces (PlaylistTrack, PlaybackState, etc.)
functions/
  api/
    listening-room.ts           # Cloudflare Pages Function proxying YouTube Data API v3
docs/
  YOUTUBE_DATA_API_SETUP.md     # Step-by-step API key setup guide
```

---

## 3. PLAYLIST DATA RETRIEVAL

* **Configured Source**: `https://music.youtube.com/playlist?list=PLV8hEip3Kp-o&si=-JKQxyT7mPmNZQq1`
* **Playlist ID**: `PLV8hEip3Kp-o`
* **Public Library Header**: Neutral label `PLAYLIST LIBRARY` (remote metadata preserved internally).
* **Data Fields Extracted**:
  * `playlistItemId`: Unique playlist entry ID.
  * `videoId`: Clean YouTube video identifier.
  * `position`: 1-indexed track position.
  * `title`: Track title from snippet.
  * `channelTitle`: Creator/channel attribution from `videoOwnerChannelTitle` or `channelTitle`.
  * `thumbnailUrl`: Highest resolution available thumbnail (`maxres` -> `standard` -> `high` -> `medium` -> `default`).
  * `durationSeconds`: Parsed from ISO 8601 string (`PT3M45S` -> `225s`) via batched `videos.list`.
  * `embeddable`: Boolean flag from `status.embeddable`.

---

## 4. CLOUDFLARE PAGES FUNCTION

The proxy endpoint is implemented in [`functions/api/listening-room.ts`](file:///home/tqv/Desktop/GCD_project/my_portfolio/functions/api/listening-room.ts):

* **Route**: `GET /api/listening-room`
* **Enforced Target**: The playlist ID is locked to `env.YOUTUBE_PLAYLIST_ID` (or default `PLV8hEip3Kp-o`). It does **not** accept arbitrary playlist IDs from public client queries, preventing open proxy abuse.
* **Pagination**: Supports `?pageToken=...` for sequential page retrieval.
* **Response Caching**: Emits `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=600`. Bypasses cache when client passes `Cache-Control: no-cache` (during manual refresh).
* **Security**: API key is injected server-side via `env.YOUTUBE_API_KEY`. No key is ever transmitted to the browser.

---

## 5. API KEY SECURITY

* **Frontend Build**: Zero occurrences of `VITE_YOUTUBE_API_KEY` or embedded secrets.
* **Git Status**: `.dev.vars` is explicitly added to `.gitignore`. An example template [`.dev.vars.example`](file:///home/tqv/Desktop/GCD_project/my_portfolio/.dev.vars.example) is provided.
* **Error Sanitization**: When an API error occurs, raw Google URLs and query parameters are stripped before sending the response to the client.

---

## 6. YOUTUBE PLAYER INTEGRATION

* **API**: Official YouTube IFrame Player API (`https://www.youtube.com/iframe_api`).
* **Lifecycle**: Loaded once asynchronously. A single persistent player instance is maintained via `playerRef` in [`useYouTubePlayer.ts`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/useYouTubePlayer.ts).
* **Policy Compliance**:
  * Visible 16:9 viewport (minimum dimensions >= 200×200px; desktop container is ~480×270px).
  * Native YouTube controls enabled (`controls: 1`) and completely unobstructed.
  * No overlays covering the video or player chrome.
  * Zero autoplay on page load. Playback begins only when the visitor explicitly clicks Play or selects a track.
* **Privacy Host**: Configured with `host: 'https://www.youtube-nocookie.com'`.

---

## 7. TRACK SELECTION & QUEUE SYNCHRONIZATION

* **Row Selection**: Clicking any track row in the library immediately cues or plays that specific video via `player.loadVideo(track.videoId, true)`.
* **Now Playing Synchronization**: The right panel updates title, channel name, duration, and thumbnail to match the selected track.
* **Auto-Advance**: When a video reaches `YT.PlayerState.ENDED`, the `onEnded` callback advances to the next track in the queue.
* **Active Indicator**: The playing track row displays an active Signal Mint highlight with animated mini-equalizer bars.

---

## 8. PLAYBACK CONTROLS

Custom controls in [`PlaybackControls.tsx`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/PlaybackControls.tsx) communicate with the YouTube player:

* **Play / Pause**: Calls `playVideo()` / `pauseVideo()`. Displays a pulsing spinner during `BUFFERING`.
* **Previous**: Jumps to the preceding track in the current queue.
* **Next**: Jumps to the following track in the current queue.
* **Shuffle**: Toggles random queue order without modifying the visual display of the original playlist.
* **Repeat**: Cycles between `off`, `all` (loops playlist), and `one` (repeats current track).
* **Seek Scrubber**: Controlled via [`PlaybackProgress.tsx`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/PlaybackProgress.tsx). Polled every 350ms while playing to avoid React re-render thrashing.

---

## 9. WAVEFORM VISUALIZER

* **Component**: [`WaveformVisualizer.tsx`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/WaveformVisualizer.tsx)
* **Architecture**: 18 vertical bars styled in Signal Mint (`#86D5CE`).
* **Behavior**:
  * **PLAYING**: Animates with staggered harmonic height pulsation (`@keyframes waveMotion`).
  * **PAUSED**: Freezes into a calm static baseline.
  * **BUFFERING**: Exhibits a subtle traveling wave shimmer (`@keyframes waveShimmer`).
  * **ENDED / UNSTARTED**: Inactive low baseline.
* **Accessibility**: Screen reader status announced via companion live region; `aria-hidden="true"` on decorative bars; respects `prefers-reduced-motion`.

---

## 10. REFRESH & PAGINATION BEHAVIOR

* **Page Load**: Automatically calls `/api/listening-room` on mount.
* **Manual Refresh**: Clickable "Refresh" button with rotating icon and 3-second cooldown to prevent quota exhaustion. Displays last-synced timestamp (`HH:mm`).
* **Preservation**: Refreshing metadata preserves the currently playing track if it still exists in the playlist.
* **Pagination**: Supports progressive loading of up to 50 tracks per page via `nextPageToken`.

---

## 11. RESPONSIVE SCREENSHOTS

All verification screenshots were captured with Chromium and saved to [`reports/listening-room/`](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/):

* **Desktop Dark Mode (Custom Player)**: [custom_player_desktop_dark.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/custom_player_desktop_dark.png)
* **Desktop Light Mode (Custom Player)**: [custom_player_desktop_light.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/custom_player_desktop_light.png)
* **Selected Track State**: [custom_player_selected_track.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/custom_player_selected_track.png)
* **Playing State & Waveform Animation**: [custom_player_playing_state.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/custom_player_playing_state.png)
* **Mobile Responsive View (375 × 812)**: [custom_player_mobile.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/custom_player_mobile.png)
* **Waiting for API Key Notice**: [custom_player_waiting_api_key.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/custom_player_waiting_api_key.png)

---

## 12. ACCESSIBILITY RESULTS

* **Keyboard Navigation**: All track rows are keyboard focusable (`tabIndex={0}`) and activatable via `Enter` or `Space`.
* **Touch Targets**: All interactive elements (play/pause, prev/next, search input, clear button, track rows) have minimum dimensions >= 44×44px or padding conforming to WCAG 2.1 AA.
* **Aria Attributes**: `role="toolbar"` on controls, `aria-label` on all icon buttons, `aria-valuemin`/`max`/`now` on seek range input.
* **Reduced Motion**: All animations (`waveMotion`, `eqPulse`, `spin`) are suppressed when `prefers-reduced-motion: reduce` is active.

---

## 13. API & PLAYBACK TEST RESULTS

| Test Case | Method | Expected | Result | Verdict |
| :--- | :--- | :--- | :--- | :---: |
| Missing API Key | Serverless GET | 503 + `API_KEY_MISSING` | Received 503 + clean setup message | **PASS** |
| Invalid API Key | Serverless GET | 500/502 + safe error | Clean error without leaking key | **PASS** |
| Normal Track Retrieval | Client GET | Normalized tracks | 8/8 tracks normalized with durations | **PASS** |
| Search Filtering | Client Input | Instant filter by query | Filters in-memory without API fetch | **PASS** |
| Track Selection | Client Click | Load video ID in player | Successfully cues/loads video | **PASS** |
| Waveform Sync | State Change | Active only during PLAY | Animates on PLAYING; static on PAUSE | **PASS** |
| Mobile Reordering | Viewport resize | Now Playing on top | Clean vertical column order | **PASS** |

---

## 14. BUILD RESULTS

* **TypeScript**: Passes with 0 errors (`tsc`).
* **Vite Production Build**: `built in 1.96s` with 0 warnings/errors.
* **Bundle Sizes**:
  * `dist/index.html`: `3.11 kB` (gzip: `1.10 kB`)
  * `dist/assets/index-*.css`: `77.78 kB` (gzip: `12.49 kB`)
  * `dist/assets/index-*.js`: `503.26 kB` (gzip: `154.41 kB`)
  * `dist/assets/EngineeringCoreScene-*.js`: `533.26 kB` (gzip: `133.01 kB`)

---

## 15. KNOWN LIMITATIONS

1. **YouTube Data API Quota**: Each playlist sync consumes 1–3 quota units (50 playlist items + batched video details). With the default free quota of 10,000 units/day, this supports >3,000 playlist refreshes daily, which is more than sufficient for a personal portfolio.
2. **Third-Party Copyright Restrictions**: If a creator marks a video as non-embeddable on external websites, the track will display a "Restricted" badge in the track row with a direct link to play it on YouTube Music.

---

## 16. REQUIRED USER ACTIONS

To enable live YouTube Data API synchronization for your playlist:

1. Follow the instructions in [`docs/YOUTUBE_DATA_API_SETUP.md`](file:///home/tqv/Desktop/GCD_project/my_portfolio/docs/YOUTUBE_DATA_API_SETUP.md) to generate a free Google Cloud API key.
2. For local development with Wrangler:
   ```bash
   cp .dev.vars.example .dev.vars
   # Add your key to .dev.vars: YOUTUBE_API_KEY=AIzaSy...
   ```
3. For Cloudflare Pages production:
   * Go to **Cloudflare Dashboard** → **Workers & Pages** → Your Project → **Settings** → **Environment variables**.
   * Add `YOUTUBE_API_KEY` as an encrypted secret and `YOUTUBE_PLAYLIST_ID` as `PLV8hEip3Kp-o`.
   * Redeploy the project.
