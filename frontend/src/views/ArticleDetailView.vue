<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ArrowLeft, ArrowRight, Clock3, Share2 } from 'lucide-vue-next';
import { RouterLink, useRoute } from 'vue-router';
import BlogShell from '../components/BlogShell.vue';
import { usePreferences } from '../composables/preferences';
import { publicApi } from '../services/api';
import { renderMarkdown } from '../services/markdown';
import type { Article } from '../types';

const route = useRoute();
const { locale } = usePreferences();
const article = ref<Article | null>(null);
const publishedArticles = ref<Article[]>([]);
const loading = ref(true);
const error = ref('');
const html = computed(() => article.value ? renderMarkdown(article.value.contentMarkdown) : '');
const dateLabel = computed(() => article.value?.publishedAt ? new Intl.DateTimeFormat(locale.value === 'zh' ? 'zh-CN' : 'en', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(article.value.publishedAt)) : '');
const adjacentArticles = computed(() => {
  if (!article.value) return { previous: undefined, next: undefined };
  const index = publishedArticles.value.findIndex((item) => item.slug === article.value?.slug);
  return {
    previous: index >= 0 ? publishedArticles.value[index + 1] : undefined,
    next: index > 0 ? publishedArticles.value[index - 1] : undefined,
  };
});

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const slug = String(route.params.slug);
    article.value = await publicApi.getArticle(slug);
    try { publishedArticles.value = await publicApi.listArticles(); } catch { publishedArticles.value = []; }
  } catch (e) { error.value = e instanceof Error ? e.message : '文章加载失败'; } finally { loading.value = false; }
};
watch(() => route.params.slug, () => { void load(); }, { immediate: true });
const share = async () => { try { await navigator.clipboard.writeText(window.location.href); } catch { /* clipboard is optional */ } };
</script>

<template>
  <BlogShell>
    <main id="main" class="reader-page container">
      <div v-if="loading" class="reader-loading">{{ locale === 'zh' ? '正在展开文章…' : 'Opening note…' }}</div>
      <div v-else-if="error" class="empty-state"><h1>{{ locale === 'zh' ? '文章无法打开' : 'Unable to open note' }}</h1><p>{{ error }}</p><RouterLink class="button button-ghost" to="/articles"><ArrowLeft :size="15" />{{ locale === 'zh' ? '返回文章列表' : 'Back to notes' }}</RouterLink></div>
      <template v-else-if="article">
        <RouterLink class="back-link" to="/articles"><ArrowLeft :size="15" /> {{ locale === 'zh' ? '返回全部文章' : 'Back to all notes' }}</RouterLink>
        <header class="reader-header"><div class="reader-index"><span>{{ article.category.toUpperCase() }}</span><span>{{ dateLabel }}</span></div><h1>{{ article.title }}</h1><p>{{ article.summary }}</p><div class="reader-meta"><span><Clock3 :size="14" /> {{ article.readTime ?? Math.ceil(article.contentMarkdown.length / 500) }} {{ locale === 'zh' ? '分钟阅读' : 'min read' }}</span><button type="button" class="share-button" @click="share"><Share2 :size="14" /> {{ locale === 'zh' ? '复制链接' : 'Copy link' }}</button></div><div class="note-tags"><span v-for="tag in article.tags" :key="tag">{{ tag }}</span></div></header>
        <div class="reader-layout"><aside class="reader-aside"><span class="eyebrow">READING / 01</span><div class="reader-line"></div><span>{{ locale === 'zh' ? '文章正文' : 'Long-form note' }}</span></aside><article class="reader-content" v-html="html"></article></div>
        <nav class="article-pagination" :aria-label="locale === 'zh' ? '文章导航' : 'Article navigation'">
          <RouterLink v-if="adjacentArticles.previous" class="article-pagination-link article-pagination-previous" :to="`/articles/${adjacentArticles.previous.slug}`">
            <span class="article-pagination-label"><ArrowLeft :size="14" />{{ locale === 'zh' ? '上一篇' : 'Previous note' }}</span>
            <strong>{{ adjacentArticles.previous.title }}</strong>
          </RouterLink>
          <span v-else class="article-pagination-link article-pagination-disabled"><span class="article-pagination-label"><ArrowLeft :size="14" />{{ locale === 'zh' ? '上一篇' : 'Previous note' }}</span><strong>{{ locale === 'zh' ? '已经是最早一篇' : 'Earliest note' }}</strong></span>
          <RouterLink v-if="adjacentArticles.next" class="article-pagination-link article-pagination-next" :to="`/articles/${adjacentArticles.next.slug}`">
            <span class="article-pagination-label">{{ locale === 'zh' ? '下一篇' : 'Next note' }}<ArrowRight :size="14" /></span>
            <strong>{{ adjacentArticles.next.title }}</strong>
          </RouterLink>
          <span v-else class="article-pagination-link article-pagination-disabled article-pagination-next"><span class="article-pagination-label">{{ locale === 'zh' ? '下一篇' : 'Next note' }}<ArrowRight :size="14" /></span><strong>{{ locale === 'zh' ? '已经是最新一篇' : 'Latest note' }}</strong></span>
        </nav>
      </template>
    </main>
  </BlogShell>
</template>
