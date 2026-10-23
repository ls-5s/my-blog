<script setup lang="ts">
import NebulaScene from './NebulaScene.vue';
import SiteHeader from './SiteHeader.vue';
import { usePreferences } from '../composables/preferences';

const { locale } = usePreferences();
</script>

<template>
  <div class="blog-app">
    <NebulaScene />
    <div class="scroll-progress" aria-hidden="true"></div>
    <SiteHeader />
    <slot />
    <footer class="site-footer"><span>© 2026 LIN CHE / ORBIT NOTES</span><span>{{ locale === 'zh' ? '用代码与好奇心持续构建' : 'Built with code and curiosity' }}</span><a href="#main">↑ {{ locale === 'zh' ? '回到顶部' : 'Back to top' }}</a></footer>
  </div>
</template>
