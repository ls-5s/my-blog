<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { onBeforeRouteLeave, RouterLink, useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Eye, Save, Send } from 'lucide-vue-next';
import AdminShell from '../components/AdminShell.vue';
import { renderMarkdown } from '../services/markdown';
import { adminApi } from '../services/api';
import type { Article, ArticlePayload, ArticleStatus } from '../types';

const route = useRoute();
const router = useRouter();
const id = computed(() => typeof route.params.id === 'string' ? route.params.id : '');
const isEdit = computed(() => Boolean(id.value));
const loading = ref(false);
const saving = ref(false);
const error = ref('');
const success = ref('');
const showPreview = ref(false);
const slugTouched = ref(false);
const initialSnapshot = ref('');
const form = reactive({
  title: '',
  slug: '',
  summary: '',
  category: '',
  tagsText: '',
  coverUrl: '',
  status: 'draft' as ArticleStatus,
  contentMarkdown: '',
});
const dirty = computed(() => JSON.stringify(form) !== initialSnapshot.value);
const preview = computed(() => renderMarkdown(form.contentMarkdown || '在左侧编写 Markdown 后，这里会显示安全预览。'));
const slugify = (value: string) => value.trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const tags = computed(() => form.tagsText.split(',').map((tag) => tag.trim()).filter(Boolean));

const setForm = (article?: Article) => {
  form.title = article?.title ?? '';
  form.slug = article?.slug ?? '';
  form.summary = article?.summary ?? '';
  form.category = article?.category ?? '';
  form.tagsText = article?.tags.join(', ') ?? '';
  form.coverUrl = article?.coverUrl ?? '';
  form.status = article?.status ?? 'draft';
  form.contentMarkdown = article?.contentMarkdown ?? '';
  slugTouched.value = Boolean(article?.slug);
  initialSnapshot.value = JSON.stringify(form);
};

const load = async () => {
  if (!isEdit.value) { setForm(); return; }
  loading.value = true; error.value = '';
  try { setForm(await adminApi.getArticle(id.value)); } catch (e) { error.value = e instanceof Error ? e.message : '文章加载失败'; } finally { loading.value = false; }
};
onMounted(() => { void load(); });
watch(id, () => { void load(); });
watch(() => form.title, (title) => { if (!slugTouched.value) form.slug = slugify(title); });

const payload = (status: ArticleStatus): ArticlePayload => ({
  title: form.title.trim(),
  slug: form.slug.trim(),
  summary: form.summary.trim(),
  category: form.category.trim(),
  tags: tags.value,
  coverUrl: form.coverUrl.trim() || undefined,
  status,
  contentMarkdown: form.contentMarkdown,
});
const validate = () => {
  if (!form.title.trim()) return '请填写文章标题';
  if (!form.slug.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) return 'slug 需使用小写字母、数字和连字符';
  if (!form.summary.trim()) return '请填写文章摘要';
  if (!form.category.trim()) return '请填写文章分类';
  if (!form.contentMarkdown.trim()) return '请填写 Markdown 正文';
  if (form.coverUrl && !/^https?:\/\//i.test(form.coverUrl)) return '封面地址需使用 http 或 https';
  return '';
};
const save = async (status: ArticleStatus) => {
  error.value = ''; success.value = '';
  const validation = validate();
  if (validation) { error.value = validation; return; }
  saving.value = true;
  try {
    const data = payload(status);
    let saved: Article;
    if (isEdit.value) saved = await adminApi.updateArticle(id.value, data);
    else saved = await adminApi.createArticle(data);
    setForm(saved);
    success.value = status === 'published' ? '文章已发布，博客页面现在可以公开阅读。' : status === 'scheduled' ? '计划状态已保存。' : '草稿已保存。';
    if (!isEdit.value) await router.replace(`/admin/articles/${saved._id}/edit`);
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存失败';
  } finally { saving.value = false; }
};
const cancel = () => { if (dirty.value && !window.confirm('放弃尚未保存的修改？')) return; void router.push('/admin/articles'); };
const confirmLeave = () => !dirty.value || window.confirm('文章有尚未保存的修改，仍要离开吗？');
onBeforeRouteLeave(() => confirmLeave());
const beforeUnload = (event: BeforeUnloadEvent) => { if (dirty.value) { event.preventDefault(); event.returnValue = ''; } };
onMounted(() => window.addEventListener('beforeunload', beforeUnload));
onUnmounted(() => window.removeEventListener('beforeunload', beforeUnload));
</script>

<template>
  <AdminShell>
    <section class="editor-page">
      <div class="editor-heading"><div><RouterLink class="back-link" to="/admin/articles"><ArrowLeft :size="15" /> 返回文章列表</RouterLink><p class="eyebrow">EDITOR / {{ isEdit ? 'EDIT NOTE' : 'NEW NOTE' }}</p><h1>{{ isEdit ? '编辑文章' : '新建文章' }}</h1></div><div class="editor-actions"><button class="button button--ghost" type="button" @click="cancel">取消</button><button class="button button--ghost" type="button" :disabled="saving || loading" @click="save('draft')"><Save :size="15" />保存草稿</button><button class="button button--primary" type="button" :disabled="saving || loading" @click="save('published')"><Send :size="15" />{{ saving ? '保存中…' : '发布文章' }}</button></div></div>
      <div v-if="loading" class="admin-loading">正在读取文章…</div>
      <div v-else class="editor-content">
        <p v-if="error" class="form-error editor-alert" role="alert">{{ error }}</p><p v-if="success" class="form-success editor-alert" role="status">{{ success }}</p>
        <div class="editor-meta-grid">
          <label>文章标题<input v-model="form.title" maxlength="180" placeholder="写下一个清晰的标题" required /></label>
          <label>URL Slug<div class="slug-input"><span>/articles/</span><input v-model="form.slug" maxlength="200" placeholder="article-slug" required @input="slugTouched = true" /></div><small>仅使用小写字母、数字和连字符</small></label>
          <label>分类<input v-model="form.category" maxlength="80" placeholder="vue / engineering / ai" required /></label>
          <label>标签<input v-model="form.tagsText" placeholder="Vue 3, TypeScript, Performance" /><small>使用英文逗号分隔标签</small></label>
          <label>封面图片地址<input v-model="form.coverUrl" type="url" placeholder="https://example.com/cover.jpg" /></label>
          <label class="status-field">发布状态<select v-model="form.status"><option value="draft">草稿</option><option value="published">已发布</option><option value="scheduled">计划发布</option></select></label>
          <label class="wide-field">文章摘要<textarea v-model="form.summary" maxlength="500" rows="2" placeholder="用一两句话介绍文章内容" required></textarea></label>
        </div>
        <section class="markdown-editor">
          <header class="markdown-toolbar">
            <div><strong>中文正文 / Markdown</strong><span>{{ form.contentMarkdown.length.toLocaleString() }} chars</span></div>
            <button type="button" class="preview-toggle" @click="showPreview = !showPreview"><Eye :size="15" />{{ showPreview ? '隐藏预览' : '显示预览' }}</button>
          </header>
          <div class="markdown-columns" :class="{ 'preview-only': showPreview }">
            <label class="markdown-input">
              <span class="sr-only">中文 Markdown 正文</span>
              <textarea v-model="form.contentMarkdown" placeholder="# 文章标题&#10;&#10;从这里开始写作。支持标题、列表、链接、引用和代码块。&#10;&#10;## 一个小节&#10;&#10;Markdown 原文会安全渲染为博客阅读内容。" spellcheck="false"></textarea>
            </label>
            <div v-if="!showPreview" class="markdown-preview"><span class="eyebrow">LIVE PREVIEW</span><article class="markdown-body" v-html="preview"></article></div>
          </div>
        </section>
        <div class="editor-bottom-actions"><span>{{ dirty ? '未保存的修改' : '所有修改已保存' }}</span><button class="button button--primary" type="button" :disabled="saving" @click="save('published')"><Send :size="15" />{{ saving ? '正在保存…' : '发布文章' }}</button></div>
      </div>
    </section>
  </AdminShell>
</template>
