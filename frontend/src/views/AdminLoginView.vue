<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowRight, KeyRound, LockKeyhole } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from '../stores/session';

const username = ref('admin');
const password = ref('');
const error = ref('');
const showPassword = ref(false);
const session = useSessionStore();
const router = useRouter();
const route = useRoute();
const redirect = computed(() => typeof route.query.redirect === 'string' ? route.query.redirect : '/admin/articles');

const submit = async () => {
  if (!username.value.trim() || !password.value) { error.value = '请输入管理员账号和密码'; return; }
  error.value = '';
  try { await session.login(username.value.trim(), password.value); await router.replace(redirect.value); } catch (e) { error.value = e instanceof Error ? e.message : '登录失败，请检查网络或账号'; }
};
</script>

<template>
  <main class="login-page"><div class="login-ambient"><span></span><i></i></div><section class="login-panel"><RouterLink to="/" class="admin-brand"><span class="brand-mark">LC</span><span><strong>ORBIT NOTES</strong><small>CONTENT STUDIO</small></span></RouterLink><div class="login-copy"><p class="eyebrow">ADMIN / AUTHENTICATION</p><h1>进入文章控制台<span>.</span></h1><p>只有管理员会话可以编辑、发布或删除文章。公开访客仍可继续阅读博客。</p></div><form @submit.prevent="submit"><label>管理员账号<input v-model="username" autocomplete="username" required /></label><label>管理员密码<div class="password-input"><input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required /><button type="button" @click="showPassword = !showPassword">{{ showPassword ? '隐藏' : '显示' }}</button></div></label><p v-if="error" class="form-error" role="alert">{{ error }}</p><button class="button button-primary login-button" type="submit" :disabled="session.busy"><span>{{ session.busy ? '验证中…' : '登录管理后台' }}</span><ArrowRight :size="17" /></button></form><div class="login-foot"><span><LockKeyhole :size="14" /> HTTP-only session</span><span><KeyRound :size="14" /> Markdown workflow</span></div></section></main>
</template>
