/**
 * Deterministic Waveform Generator for Listening Room V4.1
 * Produces a stable, unique, and natural audio equalizer profile for any YouTube videoId.
 *
 * Characteristics:
 * - Deterministic: same videoId always yields identical base heights, durations, delays, and animation styles.
 * - Varied: 4 distinct animation rhythms across 40 thin bars create an asynchronous, organic jumping visualizer.
 * - Natural contour: audio envelope tapering at intro/outro with dynamic peaks and valleys.
 */

export interface WaveformBarProfile {
  baseHeight: number;  // Base height percentage (18% to 88%)
  animVariant: number; // Animation variant (1 to 4)
  duration: string;    // CSS animation duration (e.g., "0.85s")
  delay: string;       // Staggered negative CSS animation delay (e.g., "-0.45s")
}

// 32-bit FNV-1a hash
function hashString(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// Mulberry32 PRNG
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates an array of deterministic waveform bar configurations for a song.
 *
 * @param videoId - YouTube Video ID (used as PRNG seed)
 * @param barCount - Number of bars (default 40, in the 35–45 range)
 */
export function generateTrackWaveform(
  videoId: string | null | undefined,
  barCount: number = 40
): WaveformBarProfile[] {
  const seedString = videoId && videoId.trim().length > 0 ? videoId.trim() : 'tqv-audio-lab';
  const seed = hashString(seedString);
  const prng = mulberry32(seed);

  // Deterministic harmonic frequencies for acoustic contour
  const freq1 = 1.3 + prng() * 2.0;
  const freq2 = 3.4 + prng() * 3.5;
  const phase1 = prng() * Math.PI * 2;
  const phase2 = prng() * Math.PI * 2;

  const bars: WaveformBarProfile[] = [];

  for (let i = 0; i < barCount; i++) {
    const t = i / (barCount - 1); // [0.0, 1.0]

    // Audio envelope: smooth taper at intro and outro with full body in the center
    const envelope = Math.sin(t * Math.PI);
    const shapedEnvelope = Math.pow(Math.max(0, envelope), 0.44);

    // Harmonic blend + pseudo-random transient spikes
    const wave1 = Math.sin(t * Math.PI * freq1 + phase1);
    const wave2 = Math.cos(t * Math.PI * freq2 + phase2);
    const spike = (prng() - 0.5) * 0.4;

    const rawEnergy = 0.52 + 0.28 * wave1 + 0.18 * wave2 + spike;
    const clampedEnergy = Math.max(0.1, Math.min(1.0, rawEnergy * shapedEnvelope));

    // Map to base height percentage range: 20% to 88%
    const baseHeight = Math.round(20 + clampedEnergy * 68);

    // Assign one of 4 animation variants
    const animVariant = 1 + (Math.floor(prng() * 4) % 4);

    // Dynamic duration between 0.70s and 1.35s for asynchronous jumping
    const durSec = (0.7 + prng() * 0.65).toFixed(2);
    const duration = `${durSec}s`;

    // Negative delay so bars are immediately dancing mid-cycle without synchronized start
    const delaySec = (-prng() * 2.0).toFixed(2);
    const delay = `${delaySec}s`;

    bars.push({
      baseHeight,
      animVariant,
      duration,
      delay,
    });
  }

  return bars;
}
