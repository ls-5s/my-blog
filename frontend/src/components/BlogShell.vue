<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  nextTick,
  onMounted,
  onUnmounted,
  provide,
  ref,
} from 'vue';
import BootSequence from './BootSequence.vue';
import SiteHeader from './SiteHeader.vue';
import { usePreferences } from '../composables/preferences';

const NebulaScene = defineAsyncComponent(() => import('./NebulaScene.vue'));

let bootPlayed = false;

const { locale, theme } = usePreferences();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const booting = ref(!bootPlayed);
const bootReady = computed(() => !booting.value);
const scene = ref<InstanceType<typeof NebulaScene> | null>(null);
const boot = ref<InstanceType<typeof BootSequence> | null>(null);
const progressBar = ref<HTMLSpanElement | null>(null);
const cursorAura = ref<HTMLDivElement | null>(null);
const toast = ref('');
const year = new Date().getFullYear();
const cleanups: Array<() => void> = [];
const observers: IntersectionObserver[] = [];
let updateScrollEffects: (() => void) | null = null;
let toastTimeout = 0;
let bootFinished = false;
let revealInitialized = false;

const showToast = (message: string) => {
  toast.value = message;
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.value = '';
  }, 2200);
};
provide('showToast', showToast);
provide('bootReady', bootReady);

const finishBoot = async () => {
  if (!booting.value || bootFinished) return;
  bootFinished = true;
  bootPlayed = true;
  await boot.value?.enter();
  boot.value?.complete();
  document.body.classList.remove('is-loading');
  document.body.classList.add('is-ready');
  setupReveal();
  window.setTimeout(() => {
    booting.value = false;
    window.requestAnimationFrame(() => updateScrollEffects?.());
  }, reduceMotion ? 80 : 520);
};

const setupReveal = () => {
  if (revealInitialized) return;
  revealInitialized = true;
  const elements = [...document.querySelectorAll<HTMLElement>('.reveal')];
  if (reduceMotion) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -7% 0px' },
  );
  elements.forEach((element) => observer.observe(element));
  observers.push(observer);
};

const setupNavigationObserver = () => {
  const navMap: Record<string, string> = {
    home: 'home',
    featured: 'home',
    work: 'home',
    articles: 'articles',
    categories: 'categories',
    about: 'about',
  };
  const sections = [...document.querySelectorAll<HTMLElement>('main > section[id]')];
  if (!sections.length) return;

  const visibleSections = new Map<string, number>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => visibleSections.set(entry.target.id, entry.intersectionRatio));
      const current = [...visibleSections.entries()]
        .filter(([, ratio]) => ratio > 0)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
      if (!current) return;
      const active = navMap[current] ?? 'home';
      document.querySelectorAll<HTMLElement>('.nav-link').forEach((link) => {
        link.classList.toggle('is-active', link.dataset.section === active);
      });
    },
    { threshold: [0.08, 0.2, 0.45, 0.7], rootMargin: '-18% 0px -48% 0px' },
  );
  sections.forEach((section) => observer.observe(section));
  observers.push(observer);
};

const setupScrollEffects = () => {
  let scheduled = false;
  const update = () => {
    const scrollTop = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? scrollTop / scrollable : 0;
    if (progressBar.value) progressBar.value.style.transform = `scaleX(${progress})`;
    document.querySelector('.site-header')?.classList.toggle('is-scrolled', scrollTop > 26);
    scene.value?.setScroll(progress);
    scheduled = false;
  };
  const onScroll = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener('scroll', onScroll));
  updateScrollEffects = update;
};

const setupPointerEffects = () => {
  if (!finePointer) return;
  let scheduled = false;
  let targetX = 0;
  let targetY = 0;

  const onPointerMove = (event: PointerEvent) => {
    targetX = event.clientX;
    targetY = event.clientY;
    document.body.classList.add('pointer-active');
    scene.value?.setPointer(
      (event.clientX / window.innerWidth) * 2 - 1,
      (event.clientY / window.innerHeight) * 2 - 1,
    );
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      if (cursorAura.value) {
        cursorAura.value.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`;
      }
      scheduled = false;
    });
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  cleanups.push(() => window.removeEventListener('pointermove', onPointerMove));
};

const setupCardInteractions = () => {
  const onPointerMove = (event: PointerEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const card = target.closest<HTMLElement>('.note-card, .project-card, .category-card');
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);

    if (!finePointer || !card.classList.contains('project-card')) return;
    const offsetX = x / bounds.width - 0.5;
    const offsetY = y / bounds.height - 0.5;
    card.style.transform = `perspective(1000px) rotateX(${(-offsetY * 4.5).toFixed(2)}deg) rotateY(${(offsetX * 5).toFixed(2)}deg) translateY(-4px)`;
    scene.value?.setEnergy(0.32 + Math.max(Math.abs(offsetX), Math.abs(offsetY)));
  };
  const onPointerOut = (event: PointerEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const card = target.closest<HTMLElement>('.project-card');
    if (!card || card.contains(event.relatedTarget as Node | null)) return;
    card.style.transform = '';
    scene.value?.setEnergy(0);
  };
  document.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerout', onPointerOut, { passive: true });
  cleanups.push(() => document.removeEventListener('pointermove', onPointerMove));
  cleanups.push(() => document.removeEventListener('pointerout', onPointerOut));
};

const setupMagneticButtons = () => {
  if (!finePointer) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((button) => {
    const onMove = (event: PointerEvent) => {
      const bounds = button.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      button.style.transform = `translate(${(x * 7).toFixed(1)}px, ${(y * 5).toFixed(1)}px)`;
    };
    const onLeave = () => {
      button.style.transform = '';
    };
    button.addEventListener('pointermove', onMove);
    button.addEventListener('pointerleave', onLeave);
    cleanups.push(() => {
      button.removeEventListener('pointermove', onMove);
      button.removeEventListener('pointerleave', onLeave);
    });
  });
};

const backToTop = () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
};

onMounted(async () => {
  document.body.classList.toggle('is-loading', booting.value);
  if (!booting.value) document.body.classList.add('is-ready');
  await nextTick();

  setupScrollEffects();
  setupPointerEffects();
  setupCardInteractions();
  setupMagneticButtons();
  setupNavigationObserver();
  if (!booting.value) {
    setupReveal();
    window.requestAnimationFrame(() => updateScrollEffects?.());
  }

  if (booting.value) {
    boot.value?.setProgress(0.24);
    void finishBoot();
  }
});

onUnmounted(() => {
  window.clearTimeout(toastTimeout);
  observers.forEach((observer) => observer.disconnect());
  cleanups.forEach((cleanup) => cleanup());
  document.body.classList.remove('is-loading', 'pointer-active', 'menu-open', 'dialog-open', 'motion-ready');
});
</script>

<template>
  <div class="blog-app">
    <BootSequence v-if="booting" ref="boot" />
    <NebulaScene v-if="!booting" ref="scene" :theme="theme" />
    <div ref="cursorAura" class="cursor-aura" aria-hidden="true"></div>
    <div class="scroll-progress" aria-hidden="true"><span ref="progressBar"></span></div>
    <SiteHeader />
    <slot />

    <footer class="site-footer">
      <div>
        <strong>LY</strong>
        <span>{{ locale === 'zh' ? '前端开发与工程实践' : 'Frontend development & craft' }}</span>
      </div>
      <button class="text-button back-to-top" type="button" @click="backToTop">
        <span>{{ locale === 'zh' ? '回到顶部' : 'Back to top' }}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6" /></svg>
      </button>
      <span>© {{ year }} LY</span>
    </footer>

    <div class="toast" :class="{ 'is-visible': toast }" role="status" aria-live="polite">{{ toast }}</div>
  </div>
</template>
