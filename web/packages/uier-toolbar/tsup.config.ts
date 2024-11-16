import { readFileSync, writeFileSync } from 'fs';
import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['./src/index.tsx'],
    format: ['esm'],
    onSuccess: async () => {
        // Read dist/index.css and inject content into dist/index.js where templated __uier_toolbar_css__ is
        // Make sure we can inject css into js as string
        const css = readFileSync('./dist/index.css', 'utf8').replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\r?\n|\r/g, '\\n');
        const js = readFileSync('./dist/index.js').toString();
        const injected = js.replace(/__uier_toolbar_css__/g, css);
        writeFileSync('./dist/index.js', injected);
    }
})
