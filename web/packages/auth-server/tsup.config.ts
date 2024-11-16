import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['./src/index.ts', './src/components/index.ts'],
    format: ['esm'],
    minify: true,
    experimentalDts: true,
})
