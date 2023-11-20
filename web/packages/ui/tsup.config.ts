import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'tsup';
import { globSync } from 'glob';

export default defineConfig(() => ({
    entry: Object.fromEntries(
        [
            ...globSync('src/**/index.ts').map(file => [
                // This remove `src/` as well as the file extension from each
                // file, so e.g. src/nested/foo.js becomes nested/foo
                path.relative(
                    'src',
                    file.slice(0, file.length - path.extname(file).length)
                ),
                // This expands the relative paths to absolute paths, so e.g.
                // src/nested/foo becomes /project/src/nested/foo.js
                fileURLToPath(new URL(file, import.meta.url))
            ])
        ]
    ),
    format: 'esm',
    experimentalDts: true
}));
