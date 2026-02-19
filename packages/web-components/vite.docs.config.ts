import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: '/kds-ai-preview/',

  server: {
    port: 5173,
    open: true,
    fs: {
      allow: ['../..']
    }
  },

  build: {
    outDir: 'docs-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
