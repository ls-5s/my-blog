import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number.parseInt(env.VITE_PORT ?? '5173', 10);
  const apiBase = env.VITE_API_BASE || '/api';
  const apiTarget = new URL(apiBase, 'http://localhost:4000').origin;

  return {
    plugins: [vue()],
    optimizeDeps: { noDiscovery: true, include: [] },
    server: {
      port: Number.isFinite(port) ? port : 5173,
      host: env.VITE_HOST ?? 'localhost',
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/three/')) return 'three';
            if (id.includes('/node_modules/vue/') || id.includes('/node_modules/@vue/')) return 'vue';
            if (id.includes('/node_modules/marked/') || id.includes('/node_modules/dompurify/')) return 'markdown';
          },
        },
      },
    },
  };
});
