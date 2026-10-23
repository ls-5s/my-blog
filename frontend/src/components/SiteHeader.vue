<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { Menu, Moon, Sun, X } from 'lucide-vue-next';
import { usePreferences } from '../composables/preferences';

const { isDark, locale, text, toggleTheme, toggleLocale } = usePreferences();
const route = useRoute();
const menuOpen = ref(false);
const links = [
  { label: { zh: '首页', en: 'Home' }, to: '/' },
  { label: { zh: '文章', en: 'Articles' }, to: '/articles' },
  { label: { zh: '分类', en: 'Categories' }, to: '/#categories' },
  { label: { zh: '我的', en: 'About' }, to: '/#about' },
];

const closeMenu = () => { menuOpen.value = false; };
</script>

<template>
  <a class="skip-link" href="#main">{{ locale === 'zh' ? '跳到主要内容' : 'Skip to main content' }}</a>
  <header class="site-header">
    <RouterLink class="brand" to="/" @click="closeMenu" aria-label="星轨手记 Orbit Notes">
      <span class="brand-mark">LC</span>
      <span class="brand-copy"><strong>{{ locale === 'zh' ? '星轨手记' : 'ORBIT NOTES' }}</strong><small>ORBIT NOTES / 2026</small></span>
    </RouterLink>
    <nav class="desktop-nav" aria-label="主导航">
      <RouterLink v-for="link in links" :key="link.to" :to="link.to" :class="{ active: route.path === link.to || (link.to === '/articles' && route.path.startsWith('/articles')) }">{{ text(link.label) }}</RouterLink>
    </nav>
    <div class="header-actions">
      <RouterLink class="admin-entry" to="/admin/login" :aria-label="locale === 'zh' ? '管理员登录' : 'Admin sign in'">{{ locale === 'zh' ? '管理' : 'Admin' }}</RouterLink>
      <button class="icon-button" type="button" @click="toggleLocale" :aria-label="locale === 'zh' ? 'Switch to English' : '切换为中文'">{{ locale === 'zh' ? 'EN' : '中' }}</button>
      <button class="icon-button" type="button" @click="toggleTheme" :aria-label="isDark ? '切换到浅色主题' : '切换到深色主题'"><Sun v-if="isDark" :size="17" /><Moon v-else :size="17" /></button>
      <button class="icon-button menu-toggle" type="button" @click="menuOpen = !menuOpen" :aria-expanded="menuOpen" aria-controls="mobile-menu" :aria-label="menuOpen ? '关闭导航菜单' : '打开导航菜单'"><X v-if="menuOpen" :size="19" /><Menu v-else :size="19" /></button>
    </div>
  </header>
  <div v-if="menuOpen" id="mobile-menu" class="mobile-menu" @click.self="closeMenu">
    <nav class="mobile-menu-panel" aria-label="移动端导航">
      <span class="eyebrow">NAV / 04</span>
      <RouterLink v-for="link in links" :key="link.to" :to="link.to" @click="closeMenu">{{ text(link.label) }}<span>↗</span></RouterLink>
      <div class="mobile-menu-meta">SHANGHAI · CN <span>31.2304° N</span></div>
    </nav>
  </div>
</template>
