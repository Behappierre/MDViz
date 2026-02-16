import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';
var __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: { '@': path.resolve(__dirname, './src') },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary', 'html'],
            include: ['src/core/**/*.ts'],
            exclude: ['src/core/**/*.test.ts', 'src/**/fixtures/**'],
        },
    },
});
