import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const serviceWorkerContent = fs.readFileSync('./public/service-worker.js', 'utf-8');
fs.writeFileSync('./service-worker.js', serviceWorkerContent);

export default defineConfig({
    build: {
        sourcemap: true,
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                'service-worker': resolve(__dirname, 'service-worker.js')
            }
        }
    },
    publicDir: 'public'
});