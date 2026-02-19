import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Root directory for dev server (uses index.html)
  root: '.',

  // Dev server configuration
  server: {
    port: 5173,
    open: true,
    fs: {
      // Allow serving files from the monorepo root (for ?raw .md imports)
      allow: ['../..']
    }
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'KDSWebComponents',
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['lit'],
      output: {
        globals: {
          lit: 'Lit'
        }
      }
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2022'
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
