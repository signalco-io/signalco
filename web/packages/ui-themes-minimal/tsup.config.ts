import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['./src/config.ts'],
    format: ['esm', "cjs"],
    minify: true,
    experimentalDts: true,
})
