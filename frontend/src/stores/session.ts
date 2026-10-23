import { defineStore } from 'pinia';
import { authApi } from '../services/api';
import type { AdminUser } from '../types';

export const useSessionStore = defineStore('session', {
  state: () => ({ user: null as AdminUser | null, hydrated: false, busy: false }),
  getters: { isAdmin: (state) => Boolean(state.user?.role === 'admin') },
  actions: {
    async hydrate(): Promise<void> {
      if (this.hydrated) return;
      try { this.user = await authApi.me(); } catch { this.user = null; }
      this.hydrated = true;
    },
    async login(username: string, password: string): Promise<void> {
      this.busy = true;
      try { this.user = await authApi.login(username, password); } finally { this.busy = false; }
    },
    async logout(): Promise<void> {
      try { await authApi.logout(); } finally { this.user = null; }
    },
  },
});
