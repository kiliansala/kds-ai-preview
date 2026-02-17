import { defineConfig } from 'vite';
import { resolve } from 'path';
export default defineConfig({
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
//# sourceMappingURL=vite.config.js.map