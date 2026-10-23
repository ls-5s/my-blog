<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { ArrowLeft, ArrowRight, Clock3, Share2 } from 'lucide-vue-next';
import { RouterLink, useRoute } from 'vue-router';
import BlogShell from '../components/BlogShell.vue';
import { usePreferences } from '../composables/preferences';
import { publicApi } from '../services/api';
import { localizeArticle } from '../services/articleLocale';
import { renderMarkdown } from '../services/markdown';
import type { Article } from '../types';

const route = useRoute();
const { locale } = usePreferences();
const showToast = inject<(message: string) => void>('showToast', () => undefined);
const article = ref<Article | null>(null);
const publishedArticles = ref<Article[]>([]);
const loading = ref(true);
const error = ref('');
const displayArticle = computed(() => article.value ? localizeArticle(article.value, locale.value) : null);
const html = computed(() => displayArticle.value ? renderMarkdown(displayArticle.value.contentMarkdown) : '');
const dateLabel = computed(() => displayArticle.value?.publishedAt
  ? new Intl.DateTimeFormat(locale.value === 'zh' ? 'zh-CN' : 'en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(displayArticle.value.publishedAt))
  : '');
const readTime = computed(() => displayArticle.value?.readTime ?? Math.max(1, Math.ceil((displayArticle.value?.contentMarkdown.length ?? 0) / 500)));
const adjacentArticles = computed(() => {
  if (!article.value) return { previous: undefined, next: undefined };
  const index = publishedArticles.value.findIndex((item) => item.slug === article.value?.slug);
  const previous = index >= 0 ? publishedArticles.value[index + 1] : undefined;
  const next = index > 0 ? publishedArticles.value[index - 1] : undefined;
  return {
    previous: previous ? localizeArticle(previous, locale.value) : undefined,
    next: next ? localizeArticle(next, locale.value) : undefined,
  };
});

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    article.value = await publicApi.getArticle(String(route.params.slug));
    try {
      publishedArticles.value = await publicApi.listArticles();
    } catch {
      publishedArticles.value = [];
    }
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : '文章加载失败';
  } finally {
    loading.value = false;
  }
};
watch(() => route.params.slug, () => {
  void load();
}, { immediate: true });

const share = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast(locale.value === 'zh' ? '文章链接已复制' : 'Article link copied');
  } catch {
    showToast(locale.value === 'zh' ? '复制失败，请手动复制地址' : 'Copy failed. Please copy the address manually.');
  }
};
</script>

<template>
  <BlogShell>
    <main id="main" class="reader-page">
      <div v-if="loading" class="reader-loading">{{ locale === 'zh' ? '正在展开文章…' : 'Opening note…' }}</div>
      <section v-else-if="error" class="section">
        <div class="empty-state">
          <span class="empty-state__orbit" aria-hidden="true"></span>
          <h1>{{ locale === 'zh' ? '文章无法打开' : 'Unable to open note' }}</h1>
          <p>{{ error }}</p>
          <RouterLink class="button button--ghost" to="/articles">
            <span>{{ locale === 'zh' ? '返回文章列表' : 'Back to notes' }}</span>
          </RouterLink>
        </div>
      </section>

      <template v-else-if="displayArticle">
        <div class="reader-route reveal">
          <RouterLink class="reader-back" to="/articles">
            <ArrowLeft :size="15" />
            <span>{{ locale === 'zh' ? '返回全部文章' : 'Back to all notes' }}</span>
          </RouterLink>

          <header class="dialog-hero">
            <div class="dialog-hero__meta">
              <span>{{ displayArticle.category.toUpperCase() }}</span>
              <span>{{ dateLabel }}</span>
              <span>{{ readTime }} {{ locale === 'zh' ? '分钟阅读' : 'min read' }}</span>
            </div>
            <h1>{{ displayArticle.title }}</h1>
            <p class="dialog-hero__excerpt">{{ displayArticle.summary }}</p>
          </header>

          <div class="dialog-body reader-route__body">
            <aside class="dialog-aside">
              <span class="dialog-aside__label">{{ locale === 'zh' ? '文章坐标' : 'Reading coordinates' }}</span>
              <ul>
                <li>{{ locale === 'zh' ? '分类' : 'Category' }} / {{ displayArticle.category }}</li>
                <li>{{ locale === 'zh' ? '阅读时长' : 'Read time' }} / {{ readTime }} min</li>
                <li v-for="tag in displayArticle.tags" :key="tag">{{ tag }}</li>
              </ul>
              <button class="reader-share" type="button" @click="share">
                <Share2 :size="14" />
                <span>{{ locale === 'zh' ? '复制链接' : 'Copy link' }}</span>
              </button>
            </aside>

            <div class="dialog-story">
              <div class="reader-content" v-html="html"></div>
              <ul class="tag-list reader-tags">
                <li v-for="tag in displayArticle.tags" :key="tag">{{ tag }}</li>
              </ul>
            </div>
          </div>

          <nav class="article-pagination" :aria-label="locale === 'zh' ? '文章导航' : 'Article navigation'">
            <RouterLink
              v-if="adjacentArticles.previous"
              class="article-pagination-link"
              :to="`/articles/${adjacentArticles.previous.slug}`"
            >
              <span class="article-pagination-label"><ArrowLeft :size="14" />{{ locale === 'zh' ? '上一篇' : 'Previous note' }}</span>
              <strong>{{ adjacentArticles.previous.title }}</strong>
            </RouterLink>
            <span v-else class="article-pagination-link article-pagination-disabled">
              <span class="article-pagination-label"><ArrowLeft :size="14" />{{ locale === 'zh' ? '上一篇' : 'Previous note' }}</span>
              <strong>{{ locale === 'zh' ? '已经是最早一篇' : 'Earliest note' }}</strong>
            </span>
            <RouterLink
              v-if="adjacentArticles.next"
              class="article-pagination-link article-pagination-next"
              :to="`/articles/${adjacentArticles.next.slug}`"
            >
              <span class="article-pagination-label">{{ locale === 'zh' ? '下一篇' : 'Next note' }}<ArrowRight :size="14" /></span>
              <strong>{{ adjacentArticles.next.title }}</strong>
            </RouterLink>
            <span v-else class="article-pagination-link article-pagination-disabled article-pagination-next">
              <span class="article-pagination-label">{{ locale === 'zh' ? '下一篇' : 'Next note' }}<ArrowRight :size="14" /></span>
              <strong>{{ locale === 'zh' ? '已经是最新一篇' : 'Latest note' }}</strong>
            </span>
          </nav>
        </div>
      </template>
    </main>
  </BlogShell>
</template>
