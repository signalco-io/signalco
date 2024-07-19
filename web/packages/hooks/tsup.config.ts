import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['./src/*.ts'],
    format: ['esm'],
    minify: true,
    experimentalDts: true
})
