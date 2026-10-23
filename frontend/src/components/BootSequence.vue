<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { createBootSequence } from '../services/boot';
import { usePreferences } from '../composables/preferences';

const { locale } = usePreferences();
const canvas = ref<HTMLCanvasElement | null>(null);
const detail = ref('');
const complete = ref(false);
const sequence = ref<ReturnType<typeof createBootSequence> | null>(null);

onMounted(() => {
  if (!canvas.value) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  sequence.value = createBootSequence({ canvas: canvas.value, reducedMotion });
  sequence.value.setProgress(0.08);
  sequence.value.start();
});

onUnmounted(() => {
  sequence.value?.destroy();
  sequence.value = null;
});

defineExpose({
  setProgress: (value: number) => sequence.value?.setProgress(value),
  enter: () => sequence.value?.enter() ?? Promise.resolve(),
  setDetail: (value: string) => {
    detail.value = value;
  },
  complete: () => {
    complete.value = true;
  },
});
</script>

<template>
  <div class="boot-screen" :class="{ 'is-complete': complete }" id="boot-screen" aria-hidden="true">
    <canvas ref="canvas" class="boot-screen__canvas" id="boot-canvas"></canvas>
    <div class="boot-screen__vignette"></div>
    <div class="boot-screen__hud">
      <span class="boot-screen__hud-status"><i></i>LY / FRONTEND PORTFOLIO</span>
      <span id="boot-status">PORTAL / ARMED</span>
    </div>

    <div class="boot-screen__brand">
      <span class="boot-screen__brand-line"></span>
      <span class="boot-screen__brand-copy">
        <strong>LY</strong>
        <small>{{ locale === 'zh' ? 'LY / 前端开发' : 'FRONTEND DEVELOPER / 2026' }}</small>
      </span>
      <span class="boot-screen__brand-line"></span>
    </div>

    <p class="boot-screen__detail" id="boot-detail">
      {{ detail || (locale === 'zh' ? '校准粒子 · 点亮轨道 · 加载文字' : 'Calibrating particles · Igniting orbits · Loading words') }}
    </p>
  </div>
</template>
