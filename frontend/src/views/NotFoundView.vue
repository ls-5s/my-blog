<script setup lang="ts">
import { RouterLink } from 'vue-router';
import BlogShell from '../components/BlogShell.vue';
import { usePreferences } from '../composables/preferences';

const { locale } = usePreferences();
</script>

<template>
  <BlogShell>
    <main id="main" class="not-found">
      <p class="eyebrow">404 / NO ORBIT</p>
      <h1>{{ locale === 'zh' ? '这条轨迹暂时不存在。' : 'This orbit does not exist.' }}</h1>
      <RouterLink class="button button--primary" to="/">
        <span>{{ locale === 'zh' ? '返回首页' : 'Back home' }}</span>
        <span aria-hidden="true">↗</span>
      </RouterLink>
    </main>
  </BlogShell>
</template>
