<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { ArrowDownUp, Eye, FilePlus2, Search, Trash2 } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import AdminShell from '../components/AdminShell.vue';
import { adminApi } from '../services/api';
import type { Article, ArticleStatus } from '../types';

const articles = ref<Article[]>([]);
const loading = ref(true);
const error = ref('');
const query = ref('');
const status = ref('all');
const category = ref('all');
const order = ref<'desc' | 'asc'>('desc');
const notice = ref('');
let timer = 0;
const categories = computed(() => [...new Set(articles.value.map((article) => article.category))].sort());
const statusLabel: Record<ArticleStatus, string> = { draft: '草稿', published: '已发布', scheduled: '计划发布' };

const load = async () => {
  loading.value = true; error.value = '';
  try { articles.value = await adminApi.listArticles({ q: query.value || undefined, category: category.value === 'all' ? undefined : category.value, status: status.value === 'all' ? undefined : status.value as ArticleStatus, sort: 'updatedAt', order: order.value }); } catch (e) { error.value = e instanceof Error ? e.message : '文章加载失败'; } finally { loading.value = false; }
};
watch([query, status, category, order], () => { window.clearTimeout(timer); timer = window.setTimeout(() => { void load(); }, 220); });
onMounted(() => { void load(); });
const remove = async (article: Article) => {
  if (!window.confirm(`删除「${article.title}」？此操作无法撤销。`)) return;
  try { await adminApi.removeArticle(article._id); notice.value = '文章已删除'; await load(); } catch (e) { error.value = e instanceof Error ? e.message : '删除失败'; }
};
const dateLabel = (value: string) => new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value));
</script>

<template>
  <AdminShell>
    <section class="admin-page-head"><div><p class="eyebrow">CONTENT / LIBRARY</p><h1>文章管理</h1><p>管理公开文章与尚未发布的草稿。</p></div><RouterLink class="button button-primary" to="/admin/articles/new"><FilePlus2 :size="16" />新建文章</RouterLink></section>
    <p v-if="notice" class="notice-bar" role="status">{{ notice }}</p>
    <section class="admin-toolbar"><label class="admin-search"><Search :size="16" /><input v-model="query" type="search" placeholder="搜索标题、摘要或标签" aria-label="搜索文章" /></label><select v-model="status" aria-label="按状态筛选"><option value="all">全部状态</option><option value="published">已发布</option><option value="draft">草稿</option><option value="scheduled">计划发布</option></select><select v-model="category" aria-label="按分类筛选"><option value="all">全部分类</option><option v-for="item in categories" :key="item" :value="item">{{ item }}</option></select><button class="sort-button" type="button" @click="order = order === 'desc' ? 'asc' : 'desc'"><ArrowDownUp :size="15" />{{ order === 'desc' ? '最近更新' : '最早更新' }}</button><span class="record-count">{{ loading ? '…' : `${articles.length} 篇` }}</span></section>
    <div v-if="loading" class="admin-loading">正在读取文章…</div>
    <div v-else-if="error" class="admin-error"><strong>无法加载文章</strong><p>{{ error }}</p><button class="button button-ghost" type="button" @click="load">重试</button></div>
    <div v-else-if="articles.length" class="article-table-wrap"><table class="article-table"><thead><tr><th>文章</th><th>分类 / 标签</th><th>状态</th><th>更新时间</th><th><span class="sr-only">操作</span></th></tr></thead><tbody><tr v-for="article in articles" :key="article._id"><td><RouterLink :to="`/admin/articles/${article._id}/edit`" class="table-title">{{ article.title }}</RouterLink><span class="table-slug">/{{ article.slug }}</span></td><td><span>{{ article.category }}</span><small>{{ article.tags.slice(0, 3).join(' · ') || '无标签' }}</small></td><td><span class="status-pill" :class="`status-${article.status}`"><i></i>{{ statusLabel[article.status] }}</span></td><td class="date-cell">{{ dateLabel(article.updatedAt) }}</td><td class="row-actions"><RouterLink v-if="article.status === 'published'" :to="`/articles/${article.slug}`" target="_blank" title="查看公开文章" aria-label="查看公开文章"><Eye :size="16" /></RouterLink><RouterLink :to="`/admin/articles/${article._id}/edit`" title="编辑文章" :aria-label="`编辑 ${article.title}`"><span class="edit-mark">↗</span></RouterLink><button type="button" title="删除文章" :aria-label="`删除 ${article.title}`" @click="remove(article)"><Trash2 :size="15" /></button></td></tr></tbody></table></div>
    <div v-else class="admin-empty"><span class="empty-orbit"></span><h2>{{ query || status !== 'all' ? '没有匹配文章' : '还没有文章' }}</h2><p>{{ query || status !== 'all' ? '调整搜索条件或状态筛选。' : '创建第一篇文章，保存为草稿或直接发布。' }}</p><RouterLink v-if="!query && status === 'all'" class="button button-primary" to="/admin/articles/new"><FilePlus2 :size="15" />新建文章</RouterLink></div>
    <div class="admin-list-foot"><span>文章数据来自 MongoDB API</span><span>分类：{{ categories.length || 0 }}</span></div>
  </AdminShell>
</template>
