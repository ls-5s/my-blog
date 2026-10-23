<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { FileText, LogOut, Plus, Radio } from 'lucide-vue-next';
import { useSessionStore } from '../stores/session';

const session = useSessionStore();
const router = useRouter();
const logout = async () => {
  await session.logout();
  await router.replace('/admin/login');
};
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <RouterLink to="/" class="admin-brand"><span class="brand-mark">LC</span><span><strong>ORBIT NOTES</strong><small>CONTENT STUDIO</small></span></RouterLink>
      <div class="admin-nav-group"><small class="eyebrow">WORKSPACE</small><RouterLink to="/admin/articles" class="admin-nav-link"><FileText :size="17" />文章管理</RouterLink><RouterLink to="/admin/articles/new" class="admin-nav-link"><Plus :size="17" />新建文章</RouterLink></div>
      <div class="sidebar-bottom"><span class="connection-status"><i></i> API 已连接</span><button class="admin-logout" type="button" @click="logout"><LogOut :size="16" />退出登录</button></div>
    </aside>
    <main class="admin-main">
      <header class="admin-topbar"><div><span class="eyebrow">ORBIT NOTES / ADMIN</span><span class="admin-user"><Radio :size="14" /> {{ session.user?.username }}</span></div><RouterLink to="/" class="text-link">查看博客 <span>↗</span></RouterLink></header>
      <slot />
    </main>
  </div>
</template>
