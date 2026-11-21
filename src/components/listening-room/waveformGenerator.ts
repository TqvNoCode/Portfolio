/**
 * Deterministic Waveform Generator
 * Produces a stable, natural audio waveform silhouette for any given YouTube videoId.
 *
 * Requirements:
 * - Pure and deterministic: same videoId always produces identical bar heights.
 * - Distinct shapes: different videoIds produce visually unique envelopes.
 * - Natural acoustic contour: tapered attack/decay envelope with harmonic peaks.
 */

export interface WaveformBarData {
  baseHeight: number; // Percentage height (18% to 92%)
  delay: string;      // CSS animation-delay (e.g., "0.24s")
  duration: string;   // CSS animation-duration (e.g., "1.35s")
}

// 32-bit FNV-1a hash algorithm
function hashString(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// Seeded pseudo-random number generator (Mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates an array of deterministic waveform bar heights for a track.
 *
 * @param videoId - YouTube Video ID (used as seed)
 * @param barCount - Number of bars (default 42, matching the 35–45 bar requirement)
 */
export function generateTrackWaveform(
  videoId: string | null | undefined,
  barCount: number = 42
): WaveformBarData[] {
  const seedString = videoId && videoId.trim().length > 0 ? videoId.trim() : 'tqv-cadence-stream';
  const seed = hashString(seedString);
  const prng = mulberry32(seed);

  // Deterministic harmonic frequencies and phases
  const freqPrimary = 1.4 + prng() * 2.2;
  const freqSecondary = 3.6 + prng() * 3.8;
  const phasePrimary = prng() * Math.PI * 2;
  const phaseSecondary = prng() * Math.PI * 2;

  const bars: WaveformBarData[] = [];

  for (let i = 0; i < barCount; i++) {
    const t = i / (barCount - 1); // Normalized position [0.0, 1.0]

    // Audio mastering envelope: smooth taper at intro and outro, full body in the middle
    const envelope = Math.sin(t * Math.PI);
    const shapedEnvelope = Math.pow(Math.max(0, envelope), 0.42);

    // Harmonic wave blend
    const wave1 = Math.sin(t * Math.PI * freqPrimary + phasePrimary);
    const wave2 = Math.cos(t * Math.PI * freqSecondary + phaseSecondary);
    const noise = (prng() - 0.5) * 0.35;

    // Combined energy profile
    const rawEnergy = 0.5 + 0.3 * wave1 + 0.2 * wave2 + noise;
    const clampedEnergy = Math.max(0.08, Math.min(1.0, rawEnergy * shapedEnvelope));

    // Map to percentage height range: 18% to 92%
    const heightPercent = Math.round(18 + clampedEnergy * 74);

    // Staggered animation delay & duration for fluid, non-synchronous breathing
    const delay = `${((i * 0.048) % 1.5).toFixed(2)}s`;
    const dur = `${(1.15 + prng() * 0.65).toFixed(2)}s`;

    bars.push({
      baseHeight: heightPercent,
      delay,
      duration: dur,
    });
  }

  return bars;
}
