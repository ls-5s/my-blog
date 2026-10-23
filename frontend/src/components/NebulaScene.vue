<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { createNebulaScene } from '../services/nebula';

const props = withDefaults(defineProps<{ theme?: 'dark' | 'light' }>(), {
  theme: 'dark',
});
const emit = defineEmits<{
  ready: [];
  fallback: [];
}>();

const host = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
let scene: ReturnType<typeof createNebulaScene> | null = null;

onMounted(async () => {
  await nextTick();
  if (!canvas.value) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  try {
    scene = createNebulaScene({
      canvas: canvas.value,
      initialTheme: props.theme,
      reducedMotion,
    });
    emit('ready');
  } catch (error) {
    console.warn('Three.js scene unavailable; continuing with the CSS scene fallback.', error);
    if (host.value) host.value.dataset.fallback = 'true';
    document.body.classList.remove('has-webgl');
    emit('fallback');
  }
});

watch(
  () => props.theme,
  (theme) => scene?.setTheme(theme),
);

onUnmounted(() => {
  scene?.destroy();
  scene = null;
  document.body.classList.remove('has-webgl');
});

defineExpose({
  setPointer: (x: number, y: number) => scene?.setPointer(x, y),
  setScroll: (progress: number) => scene?.setScroll(progress),
  setEnergy: (value: number) => scene?.setEnergy(value),
});
</script>

<template>
  <div ref="host" class="scene-shell" aria-hidden="true">
    <canvas ref="canvas" id="nebula-canvas"></canvas>
    <div class="scene-fallback">
      <span class="scene-fallback__core"></span>
      <span class="scene-fallback__ring scene-fallback__ring--one"></span>
      <span class="scene-fallback__ring scene-fallback__ring--two"></span>
    </div>
    <div class="scene-grade"></div>
    <div class="scene-grid"></div>
    <div class="scene-noise"></div>
  </div>
</template>
