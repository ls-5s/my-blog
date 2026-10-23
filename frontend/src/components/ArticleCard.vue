<script setup lang="ts">
import { computed } from 'vue';
import { usePreferences } from '../composables/preferences';
import { categories } from '../data/site';
import { localizeArticle } from '../services/articleLocale';
import type { Article } from '../types';

const props = withDefaults(defineProps<{
  article: Article;
  featured?: boolean;
  index?: number;
}>(), {
  featured: false,
  index: 0,
});
const { locale, text } = usePreferences();
const localizedArticle = computed(() => localizeArticle(props.article, locale.value));
const category = computed(() => categories.find((item) => item.id === props.article.category));
const dateLabel = (value?: string) => value
  ? new Intl.DateTimeFormat(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(value))
  : '';
</script>

<template>
  <RouterLink
    :to="`/articles/${article.slug}`"
    class="note-card"
    :class="{ 'note-card--compact': featured }"
  >
    <div class="note-card__top">
      <span class="note-card__index">{{ String(index + 1).padStart(2, '0') }} / ORBIT</span>
      <span>{{ dateLabel(article.publishedAt) }} · {{ article.readTime ?? Math.max(1, Math.ceil(localizedArticle.contentMarkdown.length / 500)) }} {{ locale === 'zh' ? '分钟' : 'min' }}</span>
    </div>
    <div class="note-card__body">
      <span class="note-card__category">{{ category ? text(category.label) : article.category }}</span>
      <h3>{{ localizedArticle.title }}</h3>
      <p class="note-card__excerpt">{{ localizedArticle.summary }}</p>
    </div>
    <div class="note-card__footer">
      <ul class="tag-list">
        <li v-for="tag in article.tags.slice(0, featured ? 3 : 2)" :key="tag">{{ tag }}</li>
      </ul>
      <span class="card-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
      </span>
    </div>
  </RouterLink>
</template>
