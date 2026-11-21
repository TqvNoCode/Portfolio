import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './EngineeringCoreScene.module.css';

export const EngineeringCoreScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 520;
    const height = container.clientHeight || 460;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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

    // Interaction & Animation State
    let targetRotX = 0;
    let targetRotY = 0;
    let animFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.45;
      targetRotX = -y * 0.45;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous autonomous rotation
      solidCore.rotation.y = elapsedTime * 0.2;
      solidCore.rotation.x = elapsedTime * 0.12;

      wireCore.rotation.y = elapsedTime * 0.22;
      wireCore.rotation.x = elapsedTime * 0.14;

      ring1.rotation.z = elapsedTime * 0.35;
      ring2.rotation.z = -elapsedTime * 0.28;

      // Position satellites along orbits
      const sat1Angle = elapsedTime * 0.9;
      sat1.position.set(
        Math.cos(sat1Angle) * 2.35,
        Math.sin(sat1Angle) * 2.35 * Math.sin(ring1.rotation.x),
        Math.sin(sat1Angle) * 2.35 * Math.cos(ring1.rotation.x)
      );

      const sat2Angle = -elapsedTime * 0.7;
      sat2.position.set(
        Math.cos(sat2Angle) * 2.85 * Math.cos(ring2.rotation.y),
        Math.sin(sat2Angle) * 2.85,
        Math.cos(sat2Angle) * 2.85 * Math.sin(ring2.rotation.y)
      );

      particles.rotation.y = elapsedTime * 0.05;

      // Smooth mouse parallax lerp
      coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (targetRotX - coreGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
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
