// ============================================================
// src/components/ThreeBackground.jsx — THREE.JS BACKGROUND
// Warm, loving blog theme — soft sunrise sky with floating
// bokeh particles, gentle hearts, and rose-gold atmosphere.
// ============================================================

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // ── Scene Setup ──────────────────────────────────────────
    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: mountRef.current, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Helper: set bg color based on current dark/light mode
    const applyBgColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      renderer.setClearColor(isDark ? 0x0f0f14 : 0xfdf6ee, 1);
    };
    applyBgColor();
    camera.position.z = 3;

    // Watch for dark class changes on <html>
    const observer = new MutationObserver(applyBgColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // ── BOKEH DUST PARTICLES ─────────────────────────────────
    // 1800 soft, warm-colored floating particles like bokeh light
    const dustGeometry   = new THREE.BufferGeometry();
    const dustCount      = 1800;
    const dustPositions  = new Float32Array(dustCount * 3);
    const dustColors     = new Float32Array(dustCount * 3);
    const dustSizes      = new Float32Array(dustCount);

    // Warm palette: rose, gold, peach, blush, lavender
    const warmPalette = [
      [1.0,  0.71, 0.75],  // rose pink
      [1.0,  0.85, 0.55],  // warm gold
      [1.0,  0.76, 0.60],  // peach
      [0.98, 0.60, 0.72],  // blush
      [0.85, 0.70, 0.90],  // soft lavender
      [1.0,  0.92, 0.72],  // champagne
      [0.95, 0.70, 0.65],  // dusty rose
    ];

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      dustPositions[i3]     = (Math.random() - 0.5) * 90;
      dustPositions[i3 + 1] = (Math.random() - 0.5) * 50;
      dustPositions[i3 + 2] = (Math.random() - 0.5) * 40;

      const color = warmPalette[Math.floor(Math.random() * warmPalette.length)];
      dustColors[i3]     = color[0];
      dustColors[i3 + 1] = color[1];
      dustColors[i3 + 2] = color[2];

      dustSizes[i] = Math.random() * 0.18 + 0.04;
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color',    new THREE.BufferAttribute(dustColors, 3));
    dustGeometry.setAttribute('size',     new THREE.BufferAttribute(dustSizes, 1));

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });

    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // ── LARGE SOFT GLOW ORBS ─────────────────────────────────
    // A second layer of large, very transparent orbs for depth
    const orbGeometry  = new THREE.BufferGeometry();
    const orbCount     = 120;
    const orbPositions = new Float32Array(orbCount * 3);
    const orbColors    = new Float32Array(orbCount * 3);

    const orbPalette = [
      [1.0,  0.55, 0.65],  // deep rose
      [1.0,  0.78, 0.40],  // amber gold
      [0.90, 0.55, 0.80],  // mauve
      [1.0,  0.65, 0.50],  // coral
    ];

    for (let i = 0; i < orbCount; i++) {
      const i3 = i * 3;
      orbPositions[i3]     = (Math.random() - 0.5) * 60;
      orbPositions[i3 + 1] = (Math.random() - 0.5) * 30;
      orbPositions[i3 + 2] = (Math.random() - 0.5) * 20;

      const color = orbPalette[Math.floor(Math.random() * orbPalette.length)];
      orbColors[i3]     = color[0];
      orbColors[i3 + 1] = color[1];
      orbColors[i3 + 2] = color[2];
    }

    orbGeometry.setAttribute('position', new THREE.BufferAttribute(orbPositions, 3));
    orbGeometry.setAttribute('color',    new THREE.BufferAttribute(orbColors, 3));

    const orbMaterial = new THREE.PointsMaterial({
      size: 0.65,
      vertexColors: true,
      transparent: true,
      opacity: 0.12,
      sizeAttenuation: true,
    });

    const orbs = new THREE.Points(orbGeometry, orbMaterial);
    scene.add(orbs);

    // ── FLOATING PETAL / LEAF SHAPES ─────────────────────────
    // Flat ellipse meshes in warm pinks and creams
    const petals = [];
    const petalColors = [0xffb3c1, 0xffd6a5, 0xffafcc, 0xe8c8e8, 0xffc8a0, 0xf7c5cc];

    for (let i = 0; i < 18; i++) {
      // Use EllipseCurve to make a petal-like flat disc
      const rx = Math.random() * 0.08 + 0.04;
      const ry = Math.random() * 0.14 + 0.06;
      const geo = new THREE.EllipseCurve(0, 0, rx, ry, 0, Math.PI * 2, false, 0);
      const points = geo.getPoints(12);
      const shape  = new THREE.Shape(points);
      const shapeGeo = new THREE.ShapeGeometry(shape);

      const color = petalColors[Math.floor(Math.random() * petalColors.length)];
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: Math.random() * 0.22 + 0.08,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(shapeGeo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5
      );
      // Random initial tilt
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      // Store per-petal drift speed
      mesh.userData = {
        driftSpeed: Math.random() * 0.008 + 0.003,
        wobble:     Math.random() * 0.6 + 0.3,
        phase:      Math.random() * Math.PI * 2,
        floatAmp:   Math.random() * 0.4 + 0.2,
      };
      scene.add(mesh);
      petals.push(mesh);
    }

    // ── WIREFRAME HEARTS (soft geometric love shapes) ────────
    // Simple diamond/rhombus shapes as abstract hearts
    const hearts = [];
    const heartColors = [0xf4a0b0, 0xffccd5, 0xe8a0bf, 0xffc0cb];

    for (let i = 0; i < 6; i++) {
      // A diamond shape — simple stand-in for a love motif
      const heartShape = new THREE.Shape();
      const s = Math.random() * 0.12 + 0.06;
      heartShape.moveTo(0, s);
      heartShape.lineTo(s * 0.7, 0);
      heartShape.lineTo(0, -s * 0.8);
      heartShape.lineTo(-s * 0.7, 0);
      heartShape.closePath();

      const heartGeo = new THREE.ShapeGeometry(heartShape);
      const heartMat = new THREE.MeshBasicMaterial({
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        transparent: true,
        opacity: Math.random() * 0.18 + 0.06,
        side: THREE.DoubleSide,
      });

      const heart = new THREE.Mesh(heartGeo, heartMat);
      heart.position.set(
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4
      );
      heart.rotation.z = Math.random() * 0.4 - 0.2;
      heart.userData = {
        floatSpeed: Math.random() * 0.005 + 0.002,
        phase:      Math.random() * Math.PI * 2,
        rotSpeed:   (Math.random() - 0.5) * 0.004,
      };
      scene.add(heart);
      hearts.push(heart);
    }

    // ── MOUSE PARALLAX ───────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.25;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.25;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ── WINDOW RESIZE ────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── ANIMATION LOOP ───────────────────────────────────────
    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Dust particles — very slow gentle drift, like morning motes
      dust.rotation.y =  elapsed * 0.008;
      dust.rotation.x =  elapsed * 0.004;

      // Orbs drift the other way, slowly
      orbs.rotation.y = -elapsed * 0.005;
      orbs.rotation.z =  elapsed * 0.003;

      // Petals — each floats up/down and spins gently
      petals.forEach((petal) => {
        const { driftSpeed, wobble, phase, floatAmp } = petal.userData;
        petal.position.y += Math.sin(elapsed * wobble + phase) * 0.001;
        petal.rotation.z  += driftSpeed;
        petal.rotation.x  += driftSpeed * 0.5;
        // Gentle upward drift — reset if too high
        petal.position.y += 0.0008;
        if (petal.position.y > 4) petal.position.y = -4;
      });

      // Hearts — gentle floating pulse
      hearts.forEach((heart) => {
        const { floatSpeed, phase, rotSpeed } = heart.userData;
        heart.position.y += Math.sin(elapsed * 0.8 + phase) * floatSpeed;
        heart.rotation.z  += rotSpeed;
        heart.position.y  += 0.0005;
        if (heart.position.y > 3.5) heart.position.y = -3.5;
      });

      // Smooth camera parallax — very gentle
      camera.position.x += (mouseX - camera.position.x) * 0.04;
      camera.position.y += (-mouseY - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // ── CLEANUP ──────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={mountRef}
      id="three-canvas"
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

export default ThreeBackground;