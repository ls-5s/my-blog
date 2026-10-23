import { createRouter, createWebHistory } from 'vue-router';
import { useSessionStore } from './stores/session';
export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to, from, saved) => {
    if (saved) return saved;
    if (!from.matched.length) return;
    return to.hash ? { el: to.hash, behavior: 'smooth' } : { top: 0 };
  },
  routes: [
    { path: '/', name: 'home', component: () => import('./views/BlogHomeView.vue') },
    { path: '/articles', name: 'articles', component: () => import('./views/ArticleListView.vue') },
    { path: '/articles/:slug', name: 'article', component: () => import('./views/ArticleDetailView.vue') },
    { path: '/admin/login', name: 'admin-login', component: () => import('./views/AdminLoginView.vue'), meta: { guestOnly: true } },
    { path: '/admin/articles', name: 'admin-articles', component: () => import('./views/AdminArticlesView.vue'), meta: { requiresAdmin: true } },
    { path: '/admin/articles/new', name: 'admin-new', component: () => import('./views/AdminEditorView.vue'), meta: { requiresAdmin: true } },
    { path: '/admin/articles/:id/edit', name: 'admin-edit', component: () => import('./views/AdminEditorView.vue'), meta: { requiresAdmin: true } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./views/NotFoundView.vue') },
  ],
});

router.beforeEach(async (to) => {
  const session = useSessionStore();
  await session.hydrate();
  if (to.meta.requiresAdmin && !session.isAdmin) return { name: 'admin-login', query: { redirect: to.fullPath } };
  if (to.meta.guestOnly && session.isAdmin) return { name: 'admin-articles' };
  return true;
});
