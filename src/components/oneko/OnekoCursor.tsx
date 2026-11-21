import React, { useEffect, useRef } from 'react';

/**
 * OnekoCursor — High-Performance Desktop Companion Cat
 *
 * Sprint V3 Performance Optimizations:
 * 1. Decoupled pointer tracking: Mousemove passively updates a mutable coordinate ref (0 React state updates).
 * 2. 60 FPS requestAnimationFrame with delta-time: smooth position interpolation independent of refresh rate.
 * 3. Decoupled sprite animation clock: physical movement updates at 60 FPS while sprite frame ticks on retro cadence.
 * 4. 100% GPU compositing: Uses transform: translate3d(x, y, 0) instead of layout-triggering top/left.
 * 5. Page Visibility API: Pauses rendering loop when document is hidden to conserve CPU/GPU.
 * 6. Accessibility & Desktop safeguards: Automatically disabled on touch screens and prefers-reduced-motion.
 */
export const OnekoCursor: React.FC = () => {
  const nekoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check for touch-only mobile devices (disabled on smartphones/tablets, enabled on desktop with fine/hybrid pointer)
    const isTouchOnly = window.matchMedia('(pointer: coarse) and (hover: none)').matches;
    if (isTouchOnly) return;

    const nekoEl = nekoRef.current;
    if (!nekoEl) return;

    // Position state (in refs to avoid React re-renders)
    const pos = { x: 48, y: 48 };
    const target = { x: 48, y: 48 };

    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: string | null = null;
    let idleAnimationFrame = 0;

    // Timing
    let lastTime = performance.now();
    let spriteTimer = 0;
    const SPRITE_CADENCE_MS = 130; // Pixel-art sprite step interval
    const RUN_SPEED_PPS = 280; // Pixels per second

    let animFrameId: number;

    const spriteSets: Record<string, [number, number][]> = {
      idle: [[-3, -3]],
      alert: [[-7, -3]],
      scratchSelf: [
        [-5, 0],
        [-6, 0],
        [-7, 0],
      ],
      scratchWallN: [
        [0, 0],
        [0, -1],
      ],
      scratchWallS: [
        [-7, -1],
        [-6, -2],
      ],
      scratchWallE: [
        [-2, -2],
        [-2, -3],
      ],
      scratchWallW: [
        [-4, 0],
        [-4, -1],
      ],
      tired: [[-3, -2]],
      sleeping: [
        [-2, 0],
        [-2, -1],
      ],
      N: [
        [-1, -2],
        [-1, -3],
      ],
      NE: [
        [0, -2],
        [0, -3],
      ],
      E: [
        [-3, 0],
        [-3, -1],
      ],
      SE: [
        [-5, -1],
        [-5, -2],
      ],
      S: [
        [-6, -3],
        [-7, -2],
      ],
      SW: [
        [-5, -3],
        [-6, -1],
      ],
      W: [
        [-4, -2],
        [-4, -3],
      ],
      NW: [
        [-1, 0],
        [-1, -1],
      ],
    };

    const setSprite = (name: string, frame: number) => {
      const set = spriteSets[name] || spriteSets.idle;
      const sprite = set[frame % set.length];
      if (nekoEl) {
        nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
      }
    };

    const resetIdleAnimation = () => {
      idleAnimation = null;
      idleAnimationFrame = 0;
    };

    const runIdleCycle = () => {
      idleTime += 1;

      if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation === null) {
        const availableAnimations = ['sleeping', 'scratchSelf'];
        if (pos.x < 32) availableAnimations.push('scratchWallW');
        if (pos.y < 32) availableAnimations.push('scratchWallN');
        if (pos.x > window.innerWidth - 32) availableAnimations.push('scratchWallE');
        if (pos.y > window.innerHeight - 32) availableAnimations.push('scratchWallS');

        idleAnimation = availableAnimations[Math.floor(Math.random() * availableAnimations.length)];
      }

      switch (idleAnimation) {
        case 'sleeping':
          if (idleAnimationFrame < 8) {
            setSprite('tired', 0);
            break;
          }
          setSprite('sleeping', Math.floor(idleAnimationFrame / 4));
          if (idleAnimationFrame > 192) {
            resetIdleAnimation();
          }
          break;
        case 'scratchWallN':
        case 'scratchWallS':
        case 'scratchWallE':
        case 'scratchWallW':
        case 'scratchSelf':
          setSprite(idleAnimation, idleAnimationFrame);
          if (idleAnimationFrame > 9) {
            resetIdleAnimation();
          }
          break;
        default:
          setSprite('idle', 0);
          return;
      }
      idleAnimationFrame += 1;
    };

    // Main 60 FPS Animation Loop
    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const diffX = pos.x - target.x;
      const diffY = pos.y - target.y;
      const distance = Math.hypot(diffX, diffY);

      if (distance < 44) {
        // Close enough to cursor: idle cycle
        spriteTimer += dt * 1000;
        if (spriteTimer >= SPRITE_CADENCE_MS) {
          spriteTimer = 0;
          runIdleCycle();
        }
      } else {
        // Running towards cursor
        idleAnimation = null;
        idleAnimationFrame = 0;

        if (idleTime > 1) {
          setSprite('alert', 0);
          idleTime = Math.min(idleTime, 7) - 1;
        } else {
          // Smooth physical movement at 60 FPS
          const step = Math.min(distance, RUN_SPEED_PPS * dt);
          pos.x -= (diffX / distance) * step;
          pos.y -= (diffY / distance) * step;

          // Keep within viewport boundaries
          pos.x = Math.min(Math.max(16, pos.x), window.innerWidth - 16);
          pos.y = Math.min(Math.max(16, pos.y), window.innerHeight - 16);

          // Update directional sprite on retro clock
          spriteTimer += dt * 1000;
          if (spriteTimer >= SPRITE_CADENCE_MS) {
            spriteTimer = 0;
            frameCount += 1;

            let direction = '';
            if (diffY / distance > 0.5) direction += 'N';
            if (diffY / distance < -0.5) direction += 'S';
            if (diffX / distance > 0.5) direction += 'W';
            if (diffX / distance < -0.5) direction += 'E';

            setSprite(direction || 'idle', frameCount);
          }
        }
      }

      // GPU-accelerated translate3d (avoids layout recalculation)
      nekoEl.style.transform = `translate3d(${Math.round(pos.x - 16)}px, ${Math.round(pos.y - 16)}px, 0)`;

      animFrameId = requestAnimationFrame(loop);
    };

    // Passive mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    // Page Visibility API handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId);
      } else {
        lastTime = performance.now();
        animFrameId = requestAnimationFrame(loop);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial render and loop start
    nekoEl.style.transform = `translate3d(${pos.x - 16}px, ${pos.y - 16}px, 0)`;
    animFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      ref={nekoRef}
      id="oneko"
      aria-hidden="true"
      style={{
        width: '32px',
        height: '32px',
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        userSelect: 'none',
        imageRendering: 'pixelated',
        backgroundImage: 'url("./oneko.gif")',
        backgroundRepeat: 'no-repeat',
        willChange: 'transform',
        zIndex: 990,
      }}
    />
  );
};

export default OnekoCursor;
