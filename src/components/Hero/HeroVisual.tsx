import React, { Suspense, useState, useEffect } from 'react';
import { Hero3DFallback } from '../hero3d/Hero3DFallback';

const EngineeringCoreScene = React.lazy(
  () => import('../hero3d/EngineeringCoreScene')
);

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const HeroVisual: React.FC = () => {
  const [canRender3D, setCanRender3D] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasWebGL = checkWebGLSupport();

    if (hasWebGL && !prefersReducedMotion) {
      setCanRender3D(true);
    }
  }, []);

  if (!mounted || !canRender3D) {
    return <Hero3DFallback />;
  }

  return (
    <Suspense fallback={<Hero3DFallback />}>
      <EngineeringCoreScene />
    </Suspense>
  );
};
