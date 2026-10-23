<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { Search, SlidersHorizontal, X } from 'lucide-vue-next';
import BlogShell from '../components/BlogShell.vue';
import ArticleCard from '../components/ArticleCard.vue';
import { usePreferences } from '../composables/preferences';
import { categories } from '../data/site';
import { publicApi } from '../services/api';
import type { Article } from '../types';
import { useRoute, useRouter } from 'vue-router';

const { locale, text } = usePreferences();
const route = useRoute();
const router = useRouter();
const articles = ref<Article[]>([]);
const search = ref('');
const category = ref(typeof route.query.category === 'string' ? route.query.category : 'all');
const loading = ref(true);
const error = ref('');
let filterTimer = 0;

const load = async () => {
  loading.value = true; error.value = '';
  try { articles.value = await publicApi.listArticles({ q: search.value, category: category.value }); } catch (e) { error.value = e instanceof Error ? e.message : '加载失败'; } finally { loading.value = false; }
};
const filteredCount = computed(() => articles.value.length);
watch([search, category], () => { window.clearTimeout(filterTimer); filterTimer = window.setTimeout(() => { void load(); }, 220); });
watch(() => route.query.category, (value) => {
  category.value = typeof value === 'string' ? value : 'all';
});
onMounted(() => { void load(); });
const pickCategory = (value: string) => { category.value = value; void router.replace({ query: value === 'all' ? {} : { category: value } }); };
const reset = () => { search.value = ''; pickCategory('all'); };
</script>

<template>
  <BlogShell>
    <main id="main" class="archive-page container">
      <section class="page-intro"><p class="eyebrow">02 / {{ locale === 'zh' ? '全部文章' : 'ALL ARTICLES' }}</p><h1>{{ locale === 'zh' ? '一些值得展开的想法。' : 'Ideas worth unfolding.' }}</h1><p>{{ locale === 'zh' ? '从实时图形到交互细节，记录每一次判断背后的原因。先选择方向，再打开一篇慢慢读。' : 'From realtime graphics to interaction detail, these notes uncover the reasoning behind each decision.' }}</p></section>
      <section class="archive-toolbar" aria-label="文章筛选"><label class="search-field"><Search :size="17" /><input v-model="search" type="search" :placeholder="locale === 'zh' ? '搜索标题、摘要或标签…' : 'Search title, summary or tag…'" :aria-label="locale === 'zh' ? '搜索文章' : 'Search articles'" /></label><div class="filter-label"><SlidersHorizontal :size="15" /> FILTER / {{ filteredCount.toString().padStart(2, '0') }}</div></section>
      <div class="filter-list" role="group" :aria-label="locale === 'zh' ? '文章分类' : 'Article categories'"><button v-for="item in categories" :key="item.id" type="button" :class="{ active: category === item.id }" @click="pickCategory(item.id)"><span>{{ item.code }}</span>{{ text(item.label) }}</button></div>
      <p class="results-status" aria-live="polite">{{ loading ? (locale === 'zh' ? '正在加载…' : 'Loading…') : error || (locale === 'zh' ? `显示 ${filteredCount} 条匹配结果。` : `Showing ${filteredCount} matching results.`) }}</p>
      <div v-if="loading" class="archive-skeleton"><span v-for="n in 4" :key="n"></span></div>
      <div v-else-if="error" class="empty-state"><strong>{{ error }}</strong><button class="button button-ghost" type="button" @click="load">{{ locale === 'zh' ? '重新加载' : 'Retry' }}</button></div>
      <div v-else-if="articles.length" class="archive-grid"><ArticleCard v-for="article in articles" :key="article._id" :article="article" /></div>
      <div v-else class="empty-state"><span class="empty-orbit"></span><h2>{{ locale === 'zh' ? '没有找到匹配文章' : 'No matching notes' }}</h2><p>{{ locale === 'zh' ? '尝试换一个关键词，或清除当前筛选。' : 'Try a different query or clear the filters.' }}</p><button class="button button-ghost" type="button" @click="reset"><X :size="15" />{{ locale === 'zh' ? '清除筛选' : 'Clear filters' }}</button></div>
    </main>
  </BlogShell>
</template>
