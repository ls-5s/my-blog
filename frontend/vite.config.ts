import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: { noDiscovery: true, include: [] },
  server: {
    port: 5173,
    host: 'localhost',
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
});
