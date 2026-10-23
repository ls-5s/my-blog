<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BlogShell from '../components/BlogShell.vue';
import ArticleCard from '../components/ArticleCard.vue';
import { usePreferences } from '../composables/preferences';
import { categories } from '../data/site';
import { publicApi } from '../services/api';
import type { Article } from '../types';

const { locale, text } = usePreferences();
const route = useRoute();
const router = useRouter();
const articles = ref<Article[]>([]);
const search = ref('');
const category = ref(typeof route.query.category === 'string' ? route.query.category : 'all');
const loading = ref(true);
const error = ref('');
let filterTimer = 0;

const count = computed(() => articles.value.length);
const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    articles.value = await publicApi.listArticles({
      q: search.value,
      category: category.value,
    });
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : '加载失败';
  } finally {
    loading.value = false;
  }
};

watch([search, category], () => {
  window.clearTimeout(filterTimer);
  filterTimer = window.setTimeout(() => {
    void load();
  }, 220);
});
watch(() => route.query.category, (value) => {
  category.value = typeof value === 'string' ? value : 'all';
});

onMounted(() => {
  void load();
});

const pickCategory = (value: string) => {
  category.value = value;
  void router.replace({ query: value === 'all' ? {} : { category: value } });
};
const reset = () => {
  search.value = '';
  pickCategory('all');
};
</script>

<template>
  <BlogShell>
    <main id="main" class="archive-page">
      <section class="section section--articles" aria-labelledby="archive-title">
        <div class="page-intro reveal">
          <p class="eyebrow">{{ locale === 'zh' ? '02 / 全部文章' : '02 / All articles' }}</p>
          <h1 id="archive-title">{{ locale === 'zh' ? '一些值得展开的想法。' : 'Ideas worth unfolding.' }}</h1>
          <p>{{ locale === 'zh' ? '从实时图形到交互细节，记录每一次判断背后的原因。先选择方向，再打开一篇慢慢读。' : 'From realtime graphics to interaction detail, these notes uncover the reasoning behind each decision. Pick a direction, then open one and take your time.' }}</p>
        </div>

        <div class="archive-toolbar reveal">
          <label class="search-field" for="archive-search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5"></circle>
              <path d="m16 16 4.5 4.5"></path>
            </svg>
            <input
              id="archive-search"
              v-model="search"
              type="search"
              autocomplete="off"
              enterkeyhint="search"
              :placeholder="locale === 'zh' ? '搜索标题、标签…' : 'Search titles, tags…'"
              :aria-label="locale === 'zh' ? '搜索文章' : 'Search articles'"
            />
          </label>
          <p class="archive-count"><span>{{ String(count).padStart(2, '0') }}</span> {{ locale === 'zh' ? '篇文章' : 'notes' }}</p>
        </div>

        <div class="archive-bar reveal">
          <div class="filter-list" role="group" :aria-label="locale === 'zh' ? '文章分类' : 'Article categories'">
            <button
              v-for="item in categories"
              :key="item.id"
              class="filter-button"
              :class="{ 'is-active': category === item.id }"
              type="button"
              :aria-pressed="category === item.id"
              @click="pickCategory(item.id)"
            >{{ text(item.label) }}</button>
          </div>
        </div>

        <p class="sr-only" role="status" aria-live="polite">
          {{ loading ? (locale === 'zh' ? '正在加载文章。' : 'Loading notes.') : (locale === 'zh' ? `显示 ${count} 条匹配结果。` : `Showing ${count} matching results.`) }}
        </p>

        <div v-if="loading" class="article-grid archive-skeleton" aria-busy="true">
          <div v-for="n in 4" :key="n" class="note-card"></div>
        </div>
        <div v-else-if="error" class="empty-state">
          <span class="empty-state__orbit" aria-hidden="true"></span>
          <p>{{ error }}</p>
          <button class="text-button" type="button" @click="load">{{ locale === 'zh' ? '重新加载' : 'Retry' }}</button>
        </div>
        <div v-else-if="articles.length" class="article-grid">
          <ArticleCard v-for="(article, index) in articles" :key="article._id" :article="article" :index="index" />
        </div>
        <div v-else class="empty-state">
          <span class="empty-state__orbit" aria-hidden="true"></span>
          <p>{{ locale === 'zh' ? '没有找到匹配文章。' : 'No matching notes found.' }}</p>
          <button class="text-button" type="button" @click="reset">{{ locale === 'zh' ? '清除筛选' : 'Clear filters' }}</button>
        </div>
      </section>
    </main>
  </BlogShell>
</template>
