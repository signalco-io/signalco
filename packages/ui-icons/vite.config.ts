import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
        }),
    ],
    build: {
        sourcemap: true,
        minify: false,
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: '@signalco/ui-icons',
            formats: ['es'],
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: [
                'react', 
                'react-dom', 
                'lucide-react'
            ]
        },
    },
});
