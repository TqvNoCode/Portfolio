import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './EngineeringCoreScene.module.css';

/**
 * EngineeringCoreScene — Optimized Three.js WebGL Core
 *
 * Sprint V3 Performance Optimizations:
 * 1. IntersectionObserver-based rendering: Pauses rAF loop when Hero leaves the viewport.
 * 2. Page Visibility API: Pauses animation loop when tab is hidden or inactive.
 * 3. Delta-time updates: Clamped delta-time based rotations ensuring 60/120/144Hz consistency without speed variance.
 * 4. Zero per-frame allocations: Pre-allocated numeric vectors and buffers.
 * 5. Adaptive DPR monitoring: Dynamically scales pixel ratio if frame drops occur, restoring when stable.
 * 6. Clean lifecycle disposal: Prevents WebGL context and VRAM leaks.
 */
export const EngineeringCoreScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    let width = container.clientWidth || 520;
    let height = container.clientHeight || 460;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    // Initial DPR: Cap at 2.0 for high-DPI crispness
    const targetDPR = Math.min(window.devicePixelRatio || 1, 2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(targetDPR);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Root Group for interactive rotation
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central multifaceted solid nucleus
    const solidGeom = new THREE.IcosahedronGeometry(1.5, 0);
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x15232c,
      roughness: 0.25,
      metalness: 0.85,
      flatShading: true,
    });
    const solidCore = new THREE.Mesh(solidGeom, solidMat);
    coreGroup.add(solidCore);

    // 2. Outer wireframe lattice
    const wireGeom = new THREE.IcosahedronGeometry(1.56, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x86d5ce,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const wireCore = new THREE.Mesh(wireGeom, wireMat);
    coreGroup.add(wireCore);

    // 3. Precessing Orbital Rings
    // Ring 1 (Mint)
    const ring1Geom = new THREE.TorusGeometry(2.35, 0.02, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x86d5ce,
      emissive: 0x167e78,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Satellite node 1 on Ring 1
    const sat1Geom = new THREE.SphereGeometry(0.08, 16, 16);
    const sat1Mat = new THREE.MeshBasicMaterial({ color: 0x86d5ce });
    const sat1 = new THREE.Mesh(sat1Geom, sat1Mat);
    coreGroup.add(sat1);

    // Ring 2 (Warm Amber)
    const ring2Geom = new THREE.TorusGeometry(2.85, 0.018, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xe8b987,
      emissive: 0xb56728,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.8,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 5;
    coreGroup.add(ring2);

    // Satellite node 2 on Ring 2
    const sat2Geom = new THREE.SphereGeometry(0.07, 16, 16);
    const sat2Mat = new THREE.MeshBasicMaterial({ color: 0xe8b987 });
    const sat2 = new THREE.Mesh(sat2Geom, sat2Mat);
    coreGroup.add(sat2);

    // 4. Particle Tensor Constellation
    const particleCount = 260;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.0 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x86d5ce,
      size: 0.038,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    coreGroup.add(particles);

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mintLight = new THREE.PointLight(0x86d5ce, 3.2, 18);
    mintLight.position.set(4, 4, 4);
    scene.add(mintLight);

    const warmLight = new THREE.PointLight(0xe8b987, 2.6, 18);
    warmLight.position.set(-4, -3, 3);
    scene.add(warmLight);

    // Animation & State
    let targetRotX = 0;
    let targetRotY = 0;
    let animFrameId: number = 0;
    let isRendering = false;
    let isInViewport = true;

    // Adaptive performance tracking
    let frameCount = 0;
    let frameTimeSum = 0;
    let currentDPR = targetDPR;

    const clock = new THREE.Clock();

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.45;
      targetRotX = -y * 0.45;
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Main delta-time animation loop
    let totalElapsedTime = 0;
    const animate = () => {
      if (!isRendering) return;
      animFrameId = requestAnimationFrame(animate);

      // Delta time clamped to 100ms
      const delta = Math.min(clock.getDelta(), 0.1);
      totalElapsedTime += delta;

      // Adaptive DPR check every 60 frames
      frameCount++;
      frameTimeSum += delta;
      if (frameCount >= 60) {
        const avgFrameTime = frameTimeSum / 60;
        if (avgFrameTime > 0.022 && currentDPR > 1.0) {
          // Frame rate dropped below ~45 FPS: scale DPR down to 1.0
          currentDPR = 1.0;
          renderer.setPixelRatio(1.0);
        } else if (avgFrameTime < 0.016 && currentDPR < targetDPR) {
          // Frame rate recovered to 60 FPS: restore target DPR
          currentDPR = targetDPR;
          renderer.setPixelRatio(targetDPR);
        }
        frameCount = 0;
        frameTimeSum = 0;
      }

      // Delta-time based continuous rotation (independent of display Hz)
      solidCore.rotation.y += 0.22 * delta;
      solidCore.rotation.x += 0.13 * delta;

      wireCore.rotation.y += 0.24 * delta;
      wireCore.rotation.x += 0.15 * delta;

      ring1.rotation.z += 0.38 * delta;
      ring2.rotation.z -= 0.31 * delta;

      // Position satellites along orbital rings
      const sat1Angle = totalElapsedTime * 0.95;
      sat1.position.set(
        Math.cos(sat1Angle) * 2.35,
        Math.sin(sat1Angle) * 2.35 * Math.sin(ring1.rotation.x),
        Math.sin(sat1Angle) * 2.35 * Math.cos(ring1.rotation.x)
      );

      const sat2Angle = -totalElapsedTime * 0.75;
      sat2.position.set(
        Math.cos(sat2Angle) * 2.85 * Math.cos(ring2.rotation.y),
        Math.sin(sat2Angle) * 2.85,
        Math.cos(sat2Angle) * 2.85 * Math.sin(ring2.rotation.y)
      );

      particles.rotation.y += 0.05 * delta;

      // Smooth mouse parallax lerp
      coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.06;
      coreGroup.rotation.x += (targetRotX - coreGroup.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };

    const startRendering = () => {
      if (!isRendering && isInViewport && !document.hidden) {
        isRendering = true;
        clock.start();
        animate();
      }
    };

    const stopRendering = () => {
      isRendering = false;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    };

    // IntersectionObserver: Pause rendering when scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewport = entry.isIntersecting;
          if (isInViewport) {
            startRendering();
          } else {
            stopRendering();
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    // Page Visibility API handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopRendering();
      } else if (isInViewport) {
        startRendering();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial start
    startRendering();

    // Cleanup on unmount
    return () => {
      stopRendering();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Cleanly dispose Three.js geometries and materials
      solidGeom.dispose();
      solidMat.dispose();
      wireGeom.dispose();
      wireMat.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      sat1Geom.dispose();
      sat1Mat.dispose();
      sat2Geom.dispose();
      sat2Mat.dispose();
      particleGeom.dispose();
      particleMat.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={styles.sceneContainer} aria-label="3D Interactive Engineering Core Visualization">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className={styles.canvasMount} />

      {/* Cybernetic Telemetry Overlay */}
      <div className={styles.telemetryOverlay} aria-hidden="true">
        <div className={styles.telemetryTop}>
          <div className={styles.telemetryBadge}>
            <span className={styles.statusDot}></span>
            <span>TQV / 3D RUNTIME</span>
          </div>
          <span className={styles.interactivePill}>[ INTERACTIVE 3D ]</span>
        </div>

        <div className={styles.telemetryBottom}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>CORE:</span>
            <span className={styles.metricVal}>ICOSAHEDRON // LATTICE</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>PRECESSION:</span>
            <span className={styles.metricVal}>DUAL ORBIT // TENSORS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineeringCoreScene;
