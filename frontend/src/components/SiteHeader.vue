<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { usePreferences } from '../composables/preferences';

const { isDark, locale, text, theme, toggleLocale, toggleTheme } = usePreferences();
const route = useRoute();
const menuOpen = ref(false);
const menuButton = ref<HTMLButtonElement | null>(null);
const mobileMenu = ref<HTMLDivElement | null>(null);
const links = [
  { label: { zh: '首页', en: 'Home' }, to: '/#home', section: 'home' },
  { label: { zh: '文章', en: 'Articles' }, to: '/#articles', section: 'articles' },
  { label: { zh: '分类', en: 'Categories' }, to: '/#categories', section: 'categories' },
  { label: { zh: '我的', en: 'Me' }, to: '/#about', section: 'about' },
];

const closeMenu = (restoreFocus = false) => {
  menuOpen.value = false;
  if (restoreFocus) nextTick(() => menuButton.value?.focus({ preventScroll: true }));
};

const isLinkActive = (section: string) => {
  if (route.path.startsWith('/articles')) return section === 'articles' && route.path !== '/';
  if (route.path !== '/') return false;
  return route.hash === `#${section}` || (!route.hash && section === 'home');
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const changeTheme = () => {
  const next = isDark.value ? 'light' : 'dark';
  toggleTheme();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#05070d' : '#edf4f7');
  menuButton.value?.animate(
    [
      { opacity: 1 },
      { opacity: 0.45 },
      { opacity: 1 },
    ],
    { duration: 360, easing: 'cubic-bezier(.2,.9,.2,1.1)' },
  );
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && menuOpen.value) {
    closeMenu(true);
    return;
  }
  if (event.key !== 'Tab' || !menuOpen.value) return;

  const focusable = [
    ...document.querySelectorAll<HTMLElement>(
      '.site-header a, .site-header button, .mobile-menu.is-open a',
    ),
  ].filter((element) => element.offsetParent !== null);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

const handleDesktop = (event: MediaQueryListEvent) => {
  if (event.matches) closeMenu();
};

let desktopQuery: MediaQueryList | undefined;
watch(menuOpen, async (open) => {
  document.body.classList.toggle('menu-open', open);
  if (open) {
    await nextTick();
    mobileMenu.value?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  }
});
watch(() => route.fullPath, () => closeMenu());

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  desktopQuery = window.matchMedia('(min-width: 881px)');
  desktopQuery.addEventListener('change', handleDesktop);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.value === 'dark' ? '#05070d' : '#edf4f7');
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  desktopQuery?.removeEventListener('change', handleDesktop);
  document.body.classList.remove('menu-open');
});
</script>

<template>
  <a class="skip-link" href="#main">{{ locale === 'zh' ? '跳到主要内容' : 'Skip to main content' }}</a>

  <header class="site-header" id="site-header">
    <RouterLink class="brand" to="/#home" aria-label="LY" @click="closeMenu()">
      <span class="brand__mark" aria-hidden="true"><span>LY</span></span>
      <span class="brand__text">
        <strong>LY</strong>
        <small>FRONTEND PORTFOLIO / 2026</small>
      </span>
    </RouterLink>

    <nav class="desktop-nav" aria-label="主导航">
      <RouterLink
        v-for="link in links"
        :key="link.section"
        class="nav-link"
        :class="{ 'is-active': isLinkActive(link.section) }"
        :data-section="link.section"
        :to="link.to"
      >{{ text(link.label) }}</RouterLink>
    </nav>

    <div class="header-actions">
      <RouterLink class="admin-entry" to="/admin/login" :aria-label="locale === 'zh' ? '管理员登录' : 'Admin sign in'">
        {{ locale === 'zh' ? '管理' : 'Admin' }}
      </RouterLink>
      <button class="icon-button language-button" type="button" :aria-label="locale === 'zh' ? 'Switch to English' : '切换为中文'" @click="toggleLocale">
        <span>{{ locale === 'zh' ? 'EN' : '中' }}</span>
      </button>
      <button class="icon-button theme-button" type="button" :aria-label="isDark ? '切换到浅色主题' : '切换到深色主题'" @click="changeTheme">
        <svg class="theme-icon theme-icon--moon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.2 15.1A8.4 8.4 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
        </svg>
        <svg class="theme-icon theme-icon--sun" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3.4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </button>
      <button
        ref="menuButton"
        class="icon-button menu-button"
        id="menu-button"
        type="button"
        aria-controls="mobile-menu"
        :aria-expanded="menuOpen"
        :aria-label="menuOpen ? '关闭导航菜单' : '打开导航菜单'"
        @click="toggleMenu"
      >
        <span></span><span></span>
      </button>
    </div>
  </header>

  <div
    ref="mobileMenu"
    class="mobile-menu"
    :class="{ 'is-open': menuOpen }"
    id="mobile-menu"
    :aria-hidden="!menuOpen"
  >
    <div class="mobile-menu__backdrop" @click="closeMenu(true)"></div>
    <nav class="mobile-menu__inner" aria-label="移动端导航">
      <span class="mobile-menu__index">NAV / 04</span>
      <RouterLink
        v-for="link in links"
        :key="link.section"
        :to="link.to"
        @click="closeMenu()"
      >{{ text(link.label) }}</RouterLink>
      <div class="mobile-menu__footer">
        <span>CHENGDU · CN</span>
        <span>30.5728° N</span>
      </div>
    </nav>
  </div>
</template>
