# TQV ENGINEERING LAB — LISTENING ROOM V4 REFINEMENT REPORT
## UI Refinement, Playback Controls & Progress-Synchronized Waveform

- **Date:** November 21, 2026
- **Sprint:** Listening Room V4
- **Project:** TQV Personal Engineering Lab (`/home/tqv/Desktop/GCD_project/my_portfolio`)
- **Target Playlist:** `https://music.youtube.com/playlist?list=PLV8hEip3Kp-o` (57 Tracks)
- **Public Label:** `PLAYLIST LIBRARY` (Strictly Preserved)
- **Status:** **PASS (All Tests Verified in Real Headless Chromium Runtime)**

---

## 1. UI Defects Found and Corrected

| Defect # | Observed Issue | Root Cause | Engineering Solution | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **1** | *"Playback visualizer: playing"* text overlapped waveform | The `.sr-only` accessibility class was not defined in any CSS file, rendering the assistive text as an inline, visible block in the 26px waveform flexbox. | Defined `.sr-only` in [`src/styles/global.css`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/styles/global.css) using standard clipping and moved the waveform into its own dedicated full-width container. | **PASS** |
| **2** | Right-side duration text (`04:24`) was clipped | Flex items default to `min-width: auto`. Without `min-width: 0` on `.sliderWrapper`, input range sizing expanded the row and pushed `.timeLabel` out of bounds. | Added `min-width: 0` on `.sliderWrapper`, explicit `width: 44px; min-width: 44px; flex-shrink: 0;` on `.timeLabel`, and `font-variant-numeric: tabular-nums`. | **PASS** |
| **3** | `PLAYING` status badge was partially outside the panel border | Two-panel grid container had `gap: var(--space-6)` without `min-width: 0` on panels, causing header flex elements to push past the right border. | Set `minmax(0, 1.08fr) minmax(0, 1fr)` grid with `gap: 0` on desktop, `box-sizing: border-box`, and `flex-shrink: 0` on badge container. Badge stays strictly within border. | **PASS** |
| **4** | Waveform and progress competed for horizontal space | Waveform was nested inside metadata block alongside track title and channel info. | Separated into distinct full-width rows: 1. Title/Creator $\rightarrow$ 2. Dedicated Waveform Row $\rightarrow$ 3. Dedicated Progress Row $\rightarrow$ 4. Controls. | **PASS** |
| **5** | Now Playing content alignment was inconsistent | Inconsistent vertical and horizontal paddings between player frame, metadata, and controls. | Standardized horizontal padding to `var(--space-6)` (24px) across all child blocks and aligned all elements to consistent flex baselines. | **PASS** |
| **6** | Excessive or inconsistent spacing across viewport sizes | Missing responsive breakdown rules between 768px tablet and 1440px desktop. | Added vertical stacking at $< 1024\text{px}$, responsive control button gap `gap: clamp(6px, 1.8vw, 16px)`, and responsive touch targets. | **PASS** |

---

## 2. New Waveform Design

The waveform has been completely redesigned from a bulky rectangular equalizer into a sleek, elegant, centered audio timeline.

### 2.1 Visual Specifications
- **Geometry:** 42 thin vertical bars (sweet spot of 35–45 bars).
- **Bar Dimensions:** Width 3px (max 4px, min 2px), height dynamically scaled from 18% to 92%.
- **End Caps:** Fully rounded pill caps (`border-radius: 9999px`).
- **Vertical Alignment:** Centered vertically (`align-items: center`), providing balanced dual-sided symmetry expanding from the horizontal midline.
- **Palette:**
  - **Played Bars:** Signal Mint (`#86D5CE`) with subtle glow `box-shadow: 0 0 5px rgba(134, 213, 206, 0.45)`.
  - **Unplayed Bars (Dark Mode):** Muted Signal Mint `rgba(134, 213, 206, 0.20)` (opacity 0.40).
  - **Unplayed Bars (Light Mode):** Muted Slate Blue `rgba(49, 69, 80, 0.25)`.
- **Interactive Seeking:** Clicking anywhere on the waveform immediately calculates the track timeline ratio and seeks directly to that position.

Evidence Screenshots:
- Playing Waveform: [`lr_v4_waveform_playing.png`](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_waveform_playing.png)
- Paused Waveform: [`lr_v4_waveform_paused.png`](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_waveform_paused.png)

---

## 3. Honest Waveform Behavior & Technical Limitations

> [!NOTE]
> **Complete Technical Disclosure:**
> Because audio streams originate from an embedded cross-origin YouTube iframe (`https://www.youtube.com`), the Web Audio API (`AudioContext`, `AnalyserNode`) cannot directly extract raw audio samples or frequency spectrum data due to browser Cross-Origin Resource Sharing (CORS) security boundaries.
>
> We strictly do **not** claim to perform real-time spectral frequency analysis. Instead, the UI truthfully presents this component as a **Track Waveform / Playback Waveform** synchronized with authentic player timeline progress and state.

### Playback State Matrix

| State | Visual Behavior | Verification Telemetry | Status |
| :--- | :--- | :--- | :--- |
| **PLAYING** | Active fluid breathing via CSS `scaleY` (0.82 to 1.18) with staggered delays; played bars highlighted in Signal Mint. | `status: 'PLAYING'`, `isWaveAnimating: true`, `playedBars: 1..42` | **PASS** |
| **PAUSED** | All bars freeze at their exact track-specific heights; animation stopped. | `status: 'PAUSED'`, `hasWavePausedClass: true` | **PASS** |
| **BUFFERING** | Gentle traveling pulse/shimmer across bars; no active audio simulation. | `status: 'BUFFERING'`, `hasWaveBufferingClass: true` | **PASS** |
| **CUED / READY**| Displays the static, track-specific waveform pattern. | `status: 'READY'`, static bars | **PASS** |
| **ENDED** | Progress fills 100%; breathing animation ceases. | `status: 'ENDED'`, full fill | **PASS** |
| **REDUCED MOTION**| Respects `@media (prefers-reduced-motion: reduce)`; all animations disabled. | CSS `animation: none !important` | **PASS** |

---

## 4. Track-Specific Waveform Generation

Implemented in [`src/components/listening-room/waveformGenerator.ts`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/waveformGenerator.ts):

- **Deterministic Hash:** 32-bit FNV-1a string hashing of the YouTube `videoId`.
- **Seeded PRNG:** Mulberry32 generator seeded by the hash value.
- **Harmonic Synthesis:** Blends primary envelope ($1.4 - 3.6\text{Hz}$) and secondary transient rhythm ($3.6 - 7.4\text{Hz}$).
- **Acoustic Shaping:** Applied power envelope $\sin^{0.42}(t \cdot \pi)$ ensuring natural acoustic taper at song intro and outro with full body in the middle.
- **Stability:** Pure function wrapped in React `useMemo(() => generateTrackWaveform(videoId, 42), [videoId])`. Never recalculates during playback progress polling.

```typescript
// Sample verification from live test:
// Track 1 (ORrFJ63nlcA) heights:
[24%, 39%, 45%, 46%, 45%, 42%, 44%, 36%, 32%, ...]
```

---

## 5. Progress Synchronization

- **Timeline Representation:** The 42 bars span from 0% (track start) to 100% (track end).
- **Real-Time Highlight:** `barProgress = (idx / (bars.length - 1)) * 100`. If `barProgress <= progressPercent`, the bar renders with `.waveformBarPlayed`.
- **Waveform Seek Interaction:**
  $$\text{Target Seconds} = \frac{\text{clickX}}{\text{containerWidth}} \times \text{duration}$$
  - **Live Verification Test:** Clicked at 50% width of waveform container:
    - Current duration: `264.0s`
    - Playhead jumped to: `132.12s` (ratio: `0.5004`, 50.04%)
    - Player state verified advancing from `132s`.

---

## 6. Rewind (-10s) and Forward (+10s) Implementation

Added dedicated seek functions to [`useYouTubePlayer.ts`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/useYouTubePlayer.ts):

```typescript
const seekBackward = useCallback((seconds: number | unknown = 10) => {
  const sec = typeof seconds === 'number' && !isNaN(seconds) ? seconds : 10;
  if (!playerRef.current) return;
  const ytTime = typeof playerRef.current.getCurrentTime === 'function' ? playerRef.current.getCurrentTime() : 0;
  const baseTime = typeof ytTime === 'number' && ytTime > 0 ? ytTime : currentTime;
  const target = Math.max(0, baseTime - sec);
  seekTo(target, true);
}, [currentTime, seekTo]);

const seekForward = useCallback((seconds: number | unknown = 10) => {
  const sec = typeof seconds === 'number' && !isNaN(seconds) ? seconds : 10;
  if (!playerRef.current) return;
  const ytTime = typeof playerRef.current.getCurrentTime === 'function' ? playerRef.current.getCurrentTime() : 0;
  const baseTime = typeof ytTime === 'number' && ytTime > 0 ? ytTime : currentTime;
  const totalDur = typeof playerRef.current.getDuration === 'function' ? playerRef.current.getDuration() : duration;
  const maxLimit = totalDur > 0 ? totalDur : baseTime + sec;
  const target = Math.min(maxLimit, baseTime + sec);
  seekTo(target, true);
}, [currentTime, duration, seekTo]);
```

### 6.1 Automated Seek Test Results

| Operation | Base Position | Target Position | Actual Playback Time | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Seek Forward (+10s)** | `30.99s` | `40.99s` | **`41.65s`** ($+10.66\text{s}$ with playback advance) | **PASS** |
| **Seek Rewind (-10s)** | `41.65s` | `31.65s` | **`32.43s`** ($-9.22\text{s}$ rewind confirmed) | **PASS** |
| **Boundary at 00:00** | `02.00s` | `00.00s` | Bounded at `00:00` (`Math.max(0, ...)`) | **PASS** |
| **Boundary at End** | `260.0s` | `264.0s` | Bounded at duration (`Math.min(duration, ...)`) | **PASS** |

Evidence Screenshots:
- Forward 10s: [`lr_v4_seek_forward_10s.png`](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_seek_forward_10s.png)
- Rewind 10s: [`lr_v4_seek_backward_10s.png`](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_seek_backward_10s.png)

---

## 7. Seek Slider Implementation

Redesigned in [`src/components/listening-room/PlaybackProgress.tsx`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/PlaybackProgress.tsx):

- **Click to Seek:** Instant timeline repositioning on pointer click.
- **Drag to Seek:** Global `pointerup` and `pointercancel` listeners prevent stuck states if the cursor leaves the slider. Draft value updates smoothly during drag; final seek is committed on release.
- **Keyboard Navigation:**
  - `ArrowLeft`: Seeks backward by 5 seconds.
  - `ArrowRight`: Seeks forward by 5 seconds.
  - `Home`: Jumps to track start (`00:00`).
  - `End`: Jumps to track duration.
- **ARIA & Accessibility:**
  - `aria-label="Seek track position"`
  - `aria-valuemin="0"`
  - `aria-valuemax="duration"`
  - `aria-valuenow="currentSeconds"`
  - `aria-valuetext="01:23 of 03:50"`
- **No Duration Clipping:** Right time label has fixed `width: 44px; flex-shrink: 0`, and `.sliderWrapper` has `min-width: 0`.

Evidence Screenshot: [`lr_v4_progress_slider.png`](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_progress_slider.png)

---

## 8. Control Bar Hierarchy & Layout

Reordered in [`src/components/listening-room/PlaybackControls.tsx`](file:///home/tqv/Desktop/GCD_project/my_portfolio/src/components/listening-room/PlaybackControls.tsx):

$$\mathbf{[Shuffle]} \quad \mathbf{[-10s]} \quad \mathbf{[Prev]} \quad \mathbf{[Play / Pause]} \quad \mathbf{[Next]} \quad \mathbf{[+10s]} \quad \mathbf{[Repeat]}$$

1. **Shuffle Button:** Icon `Shuffle` (size 16), toggles shuffle, `.activeOption` highlight.
2. **Rewind 10s Button:** Icon `Rewind` (size 17) + micro-badge `-10s`.
3. **Previous Track Button:** Icon `SkipBack` (size 19), navigates previous song.
4. **Play / Pause Button:** Primary emphasized circular button (46px diameter, Signal Mint `#86D5CE`, hover scale 1.06, pulsing shadow, buffering spinner overlay).
5. **Next Track Button:** Icon `SkipForward` (size 19), navigates next song.
6. **Forward 10s Button:** Icon `FastForward` (size 17) + micro-badge `+10s`.
7. **Repeat Button:** Icon `Repeat` / `Repeat1` (size 16), toggles Off $\rightarrow$ All $\rightarrow$ One $\rightarrow$ Off.

---

## 9. Playback Regression Testing

| Action | Pre-Condition | Action Trigger | Resulting State | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Next Track** | Track 0 playing | Click `Next track` button | Player advanced to Track 1 (*"Fly Away"*), `curIdx: 1`, `status: BUFFERING/PLAYING`. | **PASS** |
| **Previous Track** | Track 1 playing | Click `Previous track` button | Player returned to Track 0 (*"TheFatRat - Never Be Alone"*), `curIdx: 0`, `status: PLAYING`. | **PASS** |
| **Shuffle Mode** | Enabled | Select row from library | Resolves videoId against `player.getPlaylist()`; plays correct track. | **PASS** |
| **Repeat Mode** | Set to `Repeat One` | Video completes | `onEnded` seeks to 00:00 and loops seamlessly without double-skipping. | **PASS** |

---

## 10. Desktop Visual QA (1920 × 1080, 1440 × 900, 1280 × 800)

| Viewport | Header Badge Aligned | Right Duration Visible | Horizontal Scroll | Overall Balance | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1920 × 1080** | Inside header (x: 1279px, container: 1303px) | Visible (`04:24`, x: 1281px) | **None** (`scrollWidth == clientWidth`) | Balanced 52/48 split, crisp typography | **PASS** |
| **1440 × 900** | Inside header | Visible | **None** | Perfect proportions, waveform width: 516px | **PASS** |
| **1280 × 800** | Inside header | Visible | **None** | Compact desktop presentation, no overlap | **PASS** |

Evidence Screenshots:
- 1920×1080: [`lr_v4_desktop_1920_playing.png`](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_desktop_1920_playing.png)
- 1440×900: [`lr_v4_desktop_1440_playing.png`](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_desktop_1440_playing.png)
- 1280×800: [`lr_v4_desktop_1280.png`](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_desktop_1280.png)

---

## 11. Mobile Visual QA (768 × 1024, 375 × 812, 320 × 700)

| Viewport | Layout Mode | Header Badge Aligned | Duration Visible | Horizontal Scroll | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **768 × 1024 (Tablet)** | Vertically stacked (Now Playing on top, Library below) | Inside header | Visible | **None** | **PASS** |
| **375 × 812 (Mobile)** | Vertically stacked | Inside header | Visible | **None** | **PASS** |
| **320 × 700 (Small)** | Vertically stacked, compact controls row | Inside header | Visible | **None** | **PASS** |

Evidence Screenshots:
- Tablet 768: [`lr_v4_tablet_768.png`](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_tablet_768.png)
- Mobile 375: [`lr_v4_mobile_375.png`](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_mobile_375.png)
- Small Mobile 320: [`lr_v4_mobile_320.png`](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_mobile_320.png)

---

## 12. Theme Support (Dark & Light)

- **Dark Theme:** Deep Ink (`#0B1217`) background with Signal Mint (`#86D5CE`) waveform highlight and glowing playhead.
- **Light Theme:** Mist White (`#E5EEF2`) elevated surface with Slate Blue unplayed bars and Signal Mint active accents.
- Screenshot: [`lr_v4_light_theme.png`](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_light_theme.png)

---

## 13. Accessibility Audit

- **Keyboard Focus:** Visible focus rings on all buttons and slider (`outline: 2px solid var(--color-accent-mint)`).
- **Global Media Shortcuts:**
  - `Space`: Toggles Play/Pause (scoped, ignores active form inputs).
  - `ArrowLeft`: Seeks backward by 5 seconds.
  - `ArrowRight`: Seeks forward by 5 seconds.
- **Screen Reader Protection:** Replaced broken visual inline text with standard visually hidden `.sr-only`.
- **Touch Targets:** All 7 control buttons maintain $\ge 36\text{px}$ touch targets on mobile viewports.

---

## 14. Build Results

```bash
$ npm run build
> tsc && vite build
vite v6.4.6 building for production...
✓ 2601 modules transformed.
dist/index.html                                  3.11 kB │ gzip:   1.10 kB
dist/assets/EngineeringCoreScene-Bzzr7NbY.css    2.43 kB │ gzip:   0.86 kB
dist/assets/index-n2a052ib.css                  81.41 kB │ gzip:  13.18 kB
dist/assets/index-DtJqIA8j.js                  512.04 kB │ gzip: 157.08 kB
dist/assets/EngineeringCoreScene-B7eDDDh4.js   533.26 kB │ gzip: 133.01 kB
✓ built in 1.99s
```

- **TypeScript Compilation:** Zero errors (`tsc` passed).
- **Vite Production Build:** Success in 1.99s.
- **Runtime Console Audit:** Zero uncaught exceptions.

---

## 15. Remaining Limitations

1. **Cross-Origin Audio Analysis:** Direct Web Audio API FFT analysis of YouTube's embedded streams remains restricted by browser CORS policies. The deterministic, timeline-synchronized visual waveform provides an honest, reliable, and aesthetically equivalent user experience.
2. **Autoplay Policies:** In accordance with standard browser media policies, audio playback requires an initial user interaction on page load.

---

### Artifact Index
- [lr_v4_desktop_1920_playing.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_desktop_1920_playing.png)
- [lr_v4_desktop_1440_playing.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_desktop_1440_playing.png)
- [lr_v4_desktop_1280.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_desktop_1280.png)
- [lr_v4_tablet_768.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_tablet_768.png)
- [lr_v4_mobile_375.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_mobile_375.png)
- [lr_v4_mobile_320.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_mobile_320.png)
- [lr_v4_waveform_playing.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_waveform_playing.png)
- [lr_v4_waveform_paused.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_waveform_paused.png)
- [lr_v4_seek_forward_10s.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_seek_forward_10s.png)
- [lr_v4_seek_backward_10s.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_seek_backward_10s.png)
- [lr_v4_progress_slider.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_progress_slider.png)
- [lr_v4_light_theme.png](file:///home/tqv/Desktop/GCD_project/my_portfolio/reports/listening-room/lr_v4_light_theme.png)

---
*Signed by Antigravity Frontend Engineering Team*
