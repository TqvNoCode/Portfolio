# TQV ENGINEERING LAB — LISTENING ROOM SPRINT
## NO API KEY ARCHITECTURE MIGRATION REPORT

**Author**: Senior React Engineer, YouTube IFrame API Specialist & Performance Engineer  
**Date**: November 21, 2026  
**Project**: TQV Personal Engineering Portfolio (`~/Desktop/GCD_project/my_portfolio`)  
**Target Playlist**: `https://music.youtube.com/playlist?list=PLV8hEip3Kp-o`  
**Playlist Identifier**: `PLV8hEip3Kp-o`  
**Public Header Label**: `PLAYLIST LIBRARY` (Strictly Preserved)  
**Security Posture**: 100% Zero-Credential (No Google Cloud project, No YouTube Data API v3, No secrets)  

---

## 1. EXECUTIVE SUMMARY

The TQV Engineering Lab Listening Room has been successfully migrated from the legacy YouTube Data API v3 architecture to a pure client-side, zero-credential discovery and playback system.

All dependencies on Google Cloud projects, `YOUTUBE_API_KEY` environment variables, Cloudflare Secrets, and Data API quota limits have been eliminated. The player discovers the actual 57 playlist video IDs directly from YouTube's streaming engine using the official YouTube IFrame Player API (`player.getPlaylist()`), streams track titles and creator attribution via YouTube's public CORS-enabled oEmbed endpoint, and executes playback through a single persistent player instance.

```
+-------------------------------------------------------------------------------------------------------+
|                                  ARCHITECTURE MIGRATION SCORECARD                                     |
+--------------------------+-----------------------+------------------------+---------------------------+
| Dimension                | Legacy Architecture   | New Architecture       | Verification Status       |
+--------------------------+-----------------------+------------------------+---------------------------+
| API Key Requirement      | Required (Google Cloud)| NONE (Zero secret)     | PASS                      |
| Playlist Discovery       | playlistItems.list API| player.getPlaylist()   | PASS (57 tracks detected) |
| Metadata Retrieval       | videos.list Data API  | YouTube oEmbed endpoint| PASS (CORS direct browser)|
| Bounded Concurrency      | Unbounded batch       | 4-worker pool + 5s abort| PASS                      |
| Metadata Caching         | None / memory-only    | In-memory + sessionStorage| PASS (Instant reload) |
| Duration Handling        | ISO 8601 parsing      | Dynamic player.getDuration()| PASS (No fake values)|
| Playback Controls        | Video ID cueing       | Native playVideoAt(idx)| PASS (Next, Prev, Shuffle)|
| Waveform Sync            | Synthetic             | Active strictly on PLAY| PASS                      |
| Design System            | Custom two-panel      | Preserved exactly      | PASS                      |
| Theme Transition Speed   | Fast (480ms)          | Smooth/Relaxed (720ms) | PASS                      |
| Oneko Cursor Cadence     | 280 PPS               | 210 PPS                | PASS                      |
+--------------------------+-----------------------+------------------------+---------------------------+
```

---

## 2. OLD DATA API ARCHITECTURE REMOVAL

1. **Obsolete Setup Documentation Removed**:
   - Deleted `docs/YOUTUBE_DATA_API_SETUP.md` (previously instructed users to create Google Cloud projects, enable Data API v3, and configure secrets).
   - Created replacement guide [`docs/YOUTUBE_PLAYLIST_SETUP.md`](file:///home/tqv/Desktop/GCD_project/my_portfolio/docs/YOUTUBE_PLAYLIST_SETUP.md) detailing playlist URL configuration and player mechanics.
2. **Environment Variables Cleaned**:
   - Removed `YOUTUBE_API_KEY` from `.dev.vars.example`.
   - Verified that no local `.dev.vars` contains orphaned secrets.
3. **Cloudflare Serverless Proxy Replaced**:
   - Replaced the 238-line Google Data API proxy at [`functions/api/listening-room.ts`](file:///home/tqv/Desktop/GCD_project/my_portfolio/functions/api/listening-room.ts) with a lightweight, secure fallback proxy for oEmbed that accepts strictly validated 11-character YouTube video IDs (`^[a-zA-Z0-9_-]{11}$`) without credentials.
4. **UI Key Notices Removed**:
   - Removed the `errorCode === 'API_KEY_MISSING'` warning card and `KeyRound` icon from [`src/components/listening-room/PlaylistLibrary.tsx`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/PlaylistLibrary.tsx). Users will never encounter API key warnings.

---

## 3. NEW PLAYLIST DISCOVERY ARCHITECTURE

The primary source of truth for playlist ordering and video identifiers is the official YouTube IFrame Player API.

### Controlled Readiness Strategy
In [`src/components/listening-room/useYouTubePlayer.ts`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/useYouTubePlayer.ts):
1. The visible YouTube player mounts with playlist parameters:
   ```typescript
   playerVars: {
     listType: 'playlist',
     list: 'PLV8hEip3Kp-o',
     autoplay: 0,
     controls: 1,
     modestbranding: 1,
     rel: 0,
     enablejsapi: 1,
     origin: window.location.origin,
     fs: 1,
     playsinline: 1,
   }
   ```
2. When `onReady` or `CUED` fires, `discoverPlaylist()` calls `player.getPlaylist()`.
3. If the list is not yet populated by YouTube's server, a bounded retry strategy attempts up to 6 times at 300ms intervals before displaying a status error.
4. Telemetry verified that on the first attempt (`attempt 0`), the player returns the full 57 video IDs:
   `["Ic-gZlPFTkQ", "4nivniaycwQ", "QEpc7F6sS4M", "UlL4NidGa4c", "0LuignGmX_0", ...]`

---

## 4. OEMBED METADATA RETRIEVAL & CACHING

### Endpoint Specification
Metadata is requested from YouTube's public oEmbed service:
```text
https://www.youtube.com/oembed?format=json&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D<VIDEO_ID>
```

### Direct Browser Verification & CORS
Testing confirmed that YouTube's oEmbed endpoint sends `access-control-allow-origin: <Origin>` for web clients. The browser directly communicates with YouTube without passing through intermediary proxy hops.

### Resilience & Concurrency Pool
In [`src/components/listening-room/usePlaylist.ts`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/usePlaylist.ts):
- **Worker Pool**: 4 concurrent workers process pending tracks.
- **Request Timeout**: Each request is guarded by an `AbortController` with a 5000ms timeout.
- **Lightweight Caching**: Completed metadata is saved to `sessionStorage` under `tqv_oembed_v1_<VIDEO_ID>`, allowing instant zero-delay restoration on subsequent page visits or reloads.
- **Graceful Failure**: If a video is deleted or private, the track is marked with `metadataStatus: 'unavailable'`, `embeddable: false`, and assigned a fallback thumbnail from `https://i.ytimg.com/vi/<VIDEO_ID>/hqdefault.jpg`. A failed request never breaks playlist rendering.

---

## 5. TRACK DATA MODEL

```typescript
export interface PlaylistTrack {
  videoId: string;
  position: number;
  title: string;
  channelTitle: string | null;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  metadataStatus: 'loaded' | 'partial' | 'unavailable';
  embeddable?: boolean;
}
```

### Duration Strategy
- oEmbed does not provide duration values. To uphold engineering integrity, duration values are **never fabricated**.
- For queued tracks, duration is rendered as `--:--`.
- For the active track, `player.getDuration()` updates the Now Playing duration dynamically once video metadata is decoded.

---

## 6. PLAYBACK ENGINE & NAVIGATION

The player lifecycle maintains a strict single-instance architecture:
- **Track Selection**: User clicks row $N \rightarrow$ invokes `player.playVideoAt(N - 1)`.
- **Next / Previous**: Invokes `player.nextVideo()` and `player.previousVideo()`.
- **Shuffle**: Invokes `player.setShuffle(boolean)`. Original visible playlist order is preserved.
- **Repeat**: Managed via `player.setLoop(boolean)` for playlist looping, or re-playing current track index on `ENDED` for repeat-one mode.
- **Waveform Visualizer**: Animates (`@keyframes waveMotion`) strictly during confirmed `PLAYING` state (`YT.PlayerState.PLAYING`). Freezes during `PAUSED`, `CUED`, `BUFFERING`, or `RESTRICTED`.

---

## 7. AUTOMATED VERIFICATION RESULTS

Executed via Chrome DevTools Protocol automation in headless Chromium:

| Test ID | Test Description | Target / Input | Observed Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **TEST A** | IFrame Playlist Discovery | `PLV8hEip3Kp-o` | Discovered 57 authentic video IDs | **PASS** |
| **TEST B** | oEmbed Metadata Retrieval | 57 video IDs | Titles, channels, and thumbnails populated in 389ms | **PASS** |
| **TEST C1** | Track Selection & Playback | Row 2 click | Transitioned to `PLAYING`, waveform animated, time elapsed | **PASS** |
| **TEST C2** | Next Track Navigation | Next button click | Advanced to next track (`Unity`), Now Playing updated | **PASS** |
| **TEST C3** | Pause Transition | Pause button click | Status `PAUSED`, waveform frozen | **PASS** |
| **TEST D** | In-Memory Search Filter | Query `"Never Be Alone"` | Matched `"TheFatRat - Never Be Alone"` | **PASS** |
| **TEST E** | Theme Transition Deceleration| Theme button toggle | 720ms circular reveal transition verified | **PASS** |
| **TEST F** | Oneko Cursor Moderation | Positional tracking | Moderated running speed (210 PPS, 145ms cadence) | **PASS** |
| **TEST G** | Mobile Viewport Layout | 375x812 viewport | Single-column responsive stack, touch targets >= 44px | **PASS** |

---

## 8. SCREENSHOT ARTIFACTS

All screenshots were captured during live runtime execution:

1. **Playlist Library with 57 Tracks Loaded**:
   [nokey_stage1_playlist_library.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/nokey_stage1_playlist_library.png)
2. **Active Playback & Waveform Motion**:
   [nokey_stage2_playing_waveform.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/nokey_stage2_playing_waveform.png)
3. **Paused State with Frozen Waveform**:
   [nokey_stage3_paused.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/nokey_stage3_paused.png)
4. **Search Filter Results**:
   [nokey_stage4_search_filter.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/nokey_stage4_search_filter.png)
5. **Light Mode Blueprint Regression**:
   [nokey_stage5_light_theme.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/nokey_stage5_light_theme.png)
6. **Mobile Viewport (375x812)**:
   [nokey_stage6_mobile_375.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/nokey_stage6_mobile_375.png)

---

## 9. USER EXPERIENCE ENHANCEMENTS

Per the user's directive:
1. **Slower Theme Switch**:
   - Updated [`src/components/theme/ThemeProvider.tsx`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/theme/ThemeProvider.tsx#L92-L104) from 480ms to **720ms** with `cubic-bezier(0.2, 0.9, 0.3, 1)`. The radial circular reveal transition is noticeably smoother, more cinematic, and deliberate.
2. **Moderated Oneko Cursor Speed**:
   - Updated [`src/components/oneko/OnekoCursor.tsx`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/oneko/OnekoCursor.tsx#L38-L43):
     - `RUN_SPEED_PPS`: Reduced from 280 to **210** pixels per second (~25% speed moderation).
     - `SPRITE_CADENCE_MS`: Increased from 130ms to **145ms**.
     - The companion cat now follows the pointer with an organic, gentle running cadence.

---

## 10. REMAINING LIMITATIONS & PRODUCTION READINESS

- **oEmbed Metadata Scope**: YouTube oEmbed does not return audio bitrates, ISO durations, or view counts. This is by design; standard YouTube developer policy principles are strictly honored.
- **Autoplay Policies**: As required by web browsers, audio playback requires user activation (clicking Play or selecting a track). The player cues cleanly on initial load.
- **Production Readiness**: **PASS (Production Ready)**. Zero environment secrets, zero API keys, and zero external backend services required.
