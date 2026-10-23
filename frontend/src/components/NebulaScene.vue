<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';

const host = ref<HTMLDivElement | null>(null);
let renderer: THREE.WebGLRenderer | undefined;
let frame = 0;
let observer: ResizeObserver | undefined;
let motion = true;

onMounted(() => {
  const target = host.value;
  if (!target) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { target.dataset.fallback = 'true'; return; }
  motion = true;
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    camera.position.set(0, 0, 12);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.4));
    target.appendChild(renderer.domElement);

    const starCount = window.innerWidth < 700 ? 500 : 1100;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 7.5;
      starPositions[i * 3] = Math.cos(angle) * radius;
      starPositions[i * 3 + 1] = Math.sin(angle) * radius * 0.55;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0x9aeaf3, size: 0.022, transparent: true, opacity: 0.76 }));
    scene.add(stars);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2, 2),
      new THREE.MeshBasicMaterial({ color: 0x55dce8, wireframe: true, transparent: true, opacity: 0.28 }),
    );
    core.position.set(3.7, 0.8, -1.8);
    scene.add(core);
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.82, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x573da3, transparent: true, opacity: 0.48 }),
    );
    glow.position.copy(core.position);
    scene.add(glow);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.006, 6, 180), new THREE.MeshBasicMaterial({ color: 0x63e7e6, transparent: true, opacity: 0.22 }));
    ring.position.copy(core.position);
    ring.rotation.set(1.06, 0.35, -0.4);
    scene.add(ring);

    const resize = () => {
      const { width, height } = target.getBoundingClientRect();
      if (!width || !height) return;
      renderer?.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    observer = new ResizeObserver(resize);
    observer.observe(target);
    resize();
    const draw = (time: number) => {
      if (!renderer || !motion) return;
      core.rotation.y = time * 0.00007;
      core.rotation.x = Math.sin(time * 0.0001) * 0.08;
      ring.rotation.z = -0.4 + time * 0.000025;
      stars.rotation.z = Math.sin(time * 0.00002) * 0.02;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
  } catch {
    target.dataset.fallback = 'true';
  }
});

onUnmounted(() => {
  motion = false;
  cancelAnimationFrame(frame);
  observer?.disconnect();
  renderer?.renderLists.dispose();
  renderer?.dispose();
});
</script>

<template>
  <div ref="host" class="nebula-scene" aria-hidden="true">
    <div class="nebula-fallback"><i></i><b></b></div>
    <div class="nebula-grade"></div>
    <div class="nebula-grid"></div>
  </div>
</template>
