<script setup lang="ts">
import { ArrowUpRight, Clock3 } from 'lucide-vue-next';
import { usePreferences } from '../composables/preferences';
import type { Article } from '../types';

defineProps<{ article: Article; featured?: boolean }>();
const { locale } = usePreferences();
const dateLabel = (value?: string) => value ? new Intl.DateTimeFormat(locale.value === 'zh' ? 'zh-CN' : 'en', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(value)) : '';
</script>

<template>
  <RouterLink :to="`/articles/${article.slug}`" class="note-card" :class="{ 'note-card-featured': featured }">
    <div class="note-card-top"><span class="note-index">{{ article.category.toUpperCase() }} / {{ dateLabel(article.publishedAt) }}</span><ArrowUpRight :size="17" class="card-arrow" /></div>
    <h3>{{ article.title }}</h3>
    <p>{{ article.summary }}</p>
    <div class="note-tags"><span v-for="tag in article.tags.slice(0, 3)" :key="tag">{{ tag }}</span></div>
    <div class="note-card-foot"><span><Clock3 :size="13" /> {{ article.readTime ?? Math.max(1, Math.ceil(article.contentMarkdown.length / 500)) }} {{ locale === 'zh' ? '分钟' : 'min' }}</span><span>{{ locale === 'zh' ? '打开文章' : 'Read note' }} <b>↗</b></span></div>
  </RouterLink>
</template>
