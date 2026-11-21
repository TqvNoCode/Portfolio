import React, { useEffect, useRef } from 'react';

/**
 * OnekoCursor — Desktop pixel-art companion cat that follows the cursor
 *
 * Rules:
 * 1. Desktop only: Auto-disabled if pointer is coarse or device lacks hover
 * 2. Accessibility: Auto-disabled if prefers-reduced-motion is active
 * 3. Non-intrusive: pointer-events: none, aria-hidden="true"
 * 4. Single rAF / tick interval, cleans up on unmount
 */
export const OnekoCursor: React.FC = () => {
  const nekoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check for fine pointer (desktop mouse/trackpad vs touch device)
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return;

    const nekoEl = nekoRef.current;
    if (!nekoEl) return;

    let nekoPosX = 48;
    let nekoPosY = 48;
    let mousePosX = nekoPosX;
    let mousePosY = nekoPosY;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: string | null = null;
    let idleAnimationFrame = 0;

    const nekoSpeed = 11;

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

    const idle = () => {
      idleTime += 1;

      if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation === null) {
        const availableAnimations = ['sleeping', 'scratchSelf'];
        if (nekoPosX < 32) availableAnimations.push('scratchWallW');
        if (nekoPosY < 32) availableAnimations.push('scratchWallN');
        if (nekoPosX > window.innerWidth - 32) availableAnimations.push('scratchWallE');
        if (nekoPosY > window.innerHeight - 32) availableAnimations.push('scratchWallS');

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

    const updateFrame = () => {
      frameCount += 1;
      const diffX = nekoPosX - mousePosX;
      const diffY = nekoPosY - mousePosY;
      const distance = Math.hypot(diffX, diffY);

      if (distance < nekoSpeed || distance < 42) {
        idle();
        return;
      }

      idleAnimation = null;
      idleAnimationFrame = 0;

      if (idleTime > 1) {
        setSprite('alert', 0);
        idleTime = Math.min(idleTime, 7) - 1;
        return;
      }

      let direction = '';
      if (diffY / distance > 0.5) direction += 'N';
      if (diffY / distance < -0.5) direction += 'S';
      if (diffX / distance > 0.5) direction += 'W';
      if (diffX / distance < -0.5) direction += 'E';

      setSprite(direction || 'idle', frameCount);

      nekoPosX -= (diffX / distance) * nekoSpeed;
      nekoPosY -= (diffY / distance) * nekoSpeed;

      nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
      nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosX = e.clientX;
      mousePosY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    const intervalId = window.setInterval(updateFrame, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.clearInterval(intervalId);
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
        left: '32px',
        top: '32px',
        pointerEvents: 'none',
        userSelect: 'none',
        imageRendering: 'pixelated',
        backgroundImage: 'url("./oneko.gif")',
        backgroundRepeat: 'no-repeat',
        zIndex: 9990,
      }}
    />
  );
};
