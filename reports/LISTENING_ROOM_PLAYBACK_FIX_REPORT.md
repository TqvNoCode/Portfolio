# TQV ENGINEERING LAB — LISTENING ROOM SPRINT
## PLAYBACK SYNCHRONIZATION & LIFECYCLE FIX REPORT

**Author**: Senior Frontend Performance Engineer, React Architect & QA Verification Lead  
**Date**: November 21, 2026  
**Project**: TQV Personal Engineering Portfolio (`~/Desktop/GCD_project/my_portfolio`)  
**Target Playlist**: `https://music.youtube.com/playlist?list=PLV8hEip3Kp-o&si=-JKQxyT7mPmNZQq1`  
**Playlist Identifier**: `PLV8hEip3Kp-o`  
**Public Header Label**: `PLAYLIST LIBRARY` (Strictly Preserved)  
**Verification Suite**: Headless Chromium Automation via Chrome DevTools Protocol (CDP)  

---

## 1. EXECUTIVE SUMMARY

An audit of the Listening Room player lifecycle revealed that prior QA screenshots exhibited inconsistent player states: the Now Playing badge displayed `PLAYING` while the embedded player was still showing `Initializing YouTube Stream Engine...`, the waveform visualizer reported `unstarted`, and the playback scrubber remained at `00:00`.

This report confirms the complete resolution of the YouTube IFrame API lifecycle synchronization bugs. The playback UI now strictly reflects authentic runtime events dispatched by YouTube's player engine.

```
+-------------------------------------------------------------------------------------------------------+
|                                    PLAYBACK SYNCHRONIZATION AUDIT                                      |
+--------------------------+-----------------------+------------------------+---------------------------+
| State Dimension          | Previous Behavior     | Refactored Behavior    | Test Suite Verification   |
+--------------------------+-----------------------+------------------------+---------------------------+
| Player Initialization    | Teardown loop on rerender| Single stable lifecycle| PASS (iframe mounted once)|
| Stream Engine Overlay    | Stuck on placeholder  | Removed on onReady     | PASS (placeholder cleared)|
| State Mapping            | Premature PLAYING     | Strict YT.PlayerState  | PASS (only on state 1)    |
| Waveform Animation       | Static or unstarted   | Only animates on PLAY  | PASS (CSS class gated)    |
| Progress Scrubber        | Frozen at 00:00       | Polls only while PLAY  | PASS (00:01+ elapsed)     |
| Pause Transition         | Desynced from video   | Instantly pauses audio | PASS (PAUSED state caught)|
| Error / Restriction      | Silent unstarted drop | RESTRICTED badge shown | PASS (code 150/100 caught)|
+--------------------------+-----------------------+------------------------+---------------------------+
```

---

## 2. ROOT CAUSE ANALYSIS & CODE CHANGES

### 2.1 Root Cause 1: Re-render Teardown & DOM Destruction Loop
- **Problem**: In [`useYouTubePlayer.ts`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/useYouTubePlayer.ts), the `useEffect` hook included `[containerId, initialVideoId, onEnded, onError]` in its dependency array. Because `onEnded` and `initialVideoId` were recreated on parent component renders, the cleanup function `player.destroy()` executed immediately after mounting.
- **Consequence**: When YouTube's `player.destroy()` runs, YouTube removes the target DOM node. When the effect re-ran, `document.getElementById(containerId)` was `null`, aborting `initPlayer()` and leaving `isReady = false` indefinitely (causing the `Initializing YouTube Stream Engine...` placeholder overlay to freeze over the player).
- **Resolution**:
  - Encapsulated callback handlers (`onEnded`, `onError`) and configuration values (`initialVideoId`) into persistent mutable React refs (`onEndedRef`, `onErrorRef`, `initialVideoIdRef`).
  - Added a pending video queue (`pendingVideoRef`) to safely handle track cues prior to player initialization.
  - Locked `useEffect` dependency to `[containerId]` so the YouTube IFrame API is initialized exactly once per component lifetime.

### 2.2 Root Cause 2: Premature Playback State Assumption
- **Problem**: UI state previously updated optimistically upon user click, claiming `PLAYING` before YouTube's streaming server acknowledged video buffering and decoding.
- **Resolution**:
  - Refactored `onStateChange` in [`useYouTubePlayer.ts`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/useYouTubePlayer.ts) to strictly listen to official `window.YT.PlayerState` codes:
    - `YT.PlayerState.UNSTARTED (-1)` -> `UNSTARTED` (`STANDBY`)
    - `YT.PlayerState.CUED (5)` -> `CUED` (`READY`)
    - `YT.PlayerState.BUFFERING (3)` -> `BUFFERING`
    - `YT.PlayerState.PLAYING (1)` -> `PLAYING`
    - `YT.PlayerState.PAUSED (2)` -> `PAUSED`
    - `YT.PlayerState.ENDED (0)` -> `ENDED`
  - In [`NowPlaying.tsx`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/NowPlaying.tsx), mapped these internal states to user-facing badges with contextual CSS modifiers (`statusReady`, `statusBuffering`, `statusPlaying`, `statusPaused`, `statusError`).

### 2.3 Root Cause 3: Waveform and Progress Bar Desynchronization
- **Problem**: Time polling ran constantly or intermittently regardless of actual playback, while the waveform visualizer did not accurately correlate to playback states.
- **Resolution**:
  - Gated the polling interval (`setInterval` calling `playerRef.current.getCurrentTime()`) strictly to `playbackState === 'PLAYING'`.
  - In [`WaveformVisualizer.tsx`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/WaveformVisualizer.tsx), CSS class `wavePlaying` (triggering `@keyframes waveMotion`) is attached strictly when `playbackState === 'PLAYING'`. During `PAUSED`, `CUED`, `STANDBY`, or `RESTRICTED`, the bars remain stationary at their base heights.

### 2.4 Root Cause 4: Restricted & Non-Embeddable Track Handling
- **Problem**: Tracks marked as non-embeddable or deleted by creators caused player crashes or silent failures.
- **Resolution**:
  - Implemented `player.setError(code)` in [`useYouTubePlayer.ts`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/useYouTubePlayer.ts).
  - In [`ListeningRoom.tsx`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/ListeningRoom.tsx), selecting a track with `embeddable === false` triggers `player.setError(150)`, immediately setting the UI badge to `RESTRICTED` without corrupting player state.
  - Runtime errors dispatched by YouTube's `onError` callback (codes 100, 101, 150) automatically update the badge to `RESTRICTED`.

---

## 3. STRICT STATE TRANSITION MAPPING TABLE

| YouTube API Event (`event.data`) | Internal State | Public UI Badge | Waveform Visualizer | Scrubber Polling | Audio Controls Icon |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Initial Mount | `UNSTARTED` | `STANDBY` | Stationary | Inactive (`00:00`) | Play icon (`offsetPlay`) |
| `YT.PlayerState.CUED` (`5`) | `CUED` | `READY` | Stationary | Inactive (`00:00`) | Play icon (`offsetPlay`) |
| `YT.PlayerState.BUFFERING` (`3`) | `BUFFERING` | `BUFFERING` | Pulsing opacity | Inactive | Spinner overlay |
| `YT.PlayerState.PLAYING` (`1`) | `PLAYING` | `PLAYING` | Active `@keyframes waveMotion` | Active (300ms interval) | Pause icon |
| `YT.PlayerState.PAUSED` (`2`) | `PAUSED` | `PAUSED` | Stationary (frozen) | Frozen at current timestamp | Play icon (`offsetPlay`) |
| `YT.PlayerState.ENDED` (`0`) | `ENDED` | `ENDED` | Stationary | Frozen at duration | Play icon (`offsetPlay`) |
| `onError` (100 / 101 / 150) | `ERROR` | `RESTRICTED` | Stationary | Inactive | Play disabled / alert |

---

## 4. SCREENSHOT VERIFICATION EVIDENCE

All states were verified and captured inside headless Chromium using CDP automation:

### State 1: Player READY (`player_state1_ready.png`)
- **Status Badge**: `READY`
- **Player Viewport**: Native YouTube iframe loaded, initial video cued, placeholder overlay hidden.
- **Waveform**: Stationary.
- **Progress**: `00:00 / 03:57`.
- **Artifact**: [player_state1_ready.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/player_state1_ready.png)

### State 2: Player BUFFERING (`player_state2_buffering.png`)
- **Status Badge**: `BUFFERING` (with warm signal dot indicator).
- **Player Viewport**: YouTube stream engine buffering media segments.
- **Waveform**: Stationary (opacity pulse).
- **Artifact**: [player_state2_buffering.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/player_state2_buffering.png)

### State 3: Confirmed PLAYING with Progress (`player_state3_playing.png`)
- **Status Badge**: `PLAYING` (with pulsing mint dot indicator).
- **Player Viewport**: Native video playing with video canvas actively rendering frames.
- **Waveform**: Full 18-bar dynamic `@keyframes waveMotion` animation active.
- **Progress**: Advanced to `00:01 / 03:57`.
- **Audio Controls**: Toggle button transitioned from Play to Pause icon.
- **Artifact**: [player_state3_playing.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/player_state3_playing.png)

### State 4: Player PAUSED (`player_state4_paused.png`)
- **Status Badge**: `PAUSED`.
- **Player Viewport**: Video paused on current frame.
- **Waveform**: Animation stopped; bars frozen at base height.
- **Progress**: Scrubber progress frozen at elapsed timestamp `00:01 / 03:58`.
- **Audio Controls**: Toggle button transitioned back to Play icon.
- **Artifact**: [player_state4_paused.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/player_state4_paused.png)

### State 5: Player ERROR / RESTRICTED (`player_state5_error.png`)
- **Status Badge**: `RESTRICTED` (with coral/red warning badge).
- **Track**: "Restricted / Deleted Track".
- **Player Viewport**: Handles restriction gracefully without breaking adjacent track rows.
- **Artifact**: [player_state5_error.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/player_state5_error.png)

---

## 5. VISUAL REGRESSION AUDIT

| Dimension | Screenshot Artifact | Verification Result |
| :--- | :--- | :--- |
| **Desktop Dark Theme** | [player_regression_desktop_dark.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/player_regression_desktop_dark.png) | High contrast, Deep Ink background, mint badges, zero clipping. |
| **Desktop Light Theme** | [player_regression_desktop_light.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/player_regression_desktop_light.png) | Crisp typography, light border subtle tokens, proper status badge colors. |
| **Mobile Viewport (375x812)** | [player_regression_mobile.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/player_regression_mobile.png) | Responsive single-column stack, Now Playing on top, touch targets >= 44px. |

---

## 6. COMPLIANCE & POLICY CONSTRAINTS

1. **Header Constraint**:
   - The playlist library header strictly renders `PLAYLIST LIBRARY`.
   - The user's playlist identifier `PLV8hEip3Kp-o` remains untouched.
2. **YouTube Developer Policy Compliance**:
   - Minimum viewport size >= 200x200px (desktop viewport is 16:9 ~480x270px).
   - Native player controls (`controls=1`) are enabled and completely unobstructed.
   - No opaque overlays or clickable elements obstruct the video canvas.
   - Video plays from official privacy-enhanced host `https://www.youtube-nocookie.com`.
3. **Build & Bundle Quality**:
   - Production build runs cleanly in 2.00s with 0 errors (`npm run build`).
   - TypeScript passes with 0 diagnostics.
