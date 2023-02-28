import glob from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import postcss from "rollup-plugin-postcss";
import postcssPresetEnv from 'postcss-preset-env';
import summary from "rollup-plugin-summary";

export default [
    {
        input: Object.fromEntries(
            [
                ['index', fileURLToPath(new URL('src/index.ts', import.meta.url))],
                ...glob.sync('src/**/index.ts').map(file => [
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
        output: {
            dir: 'dist',
            format: 'esm',
            sourcemap: true
        },
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            esbuild({
                tsconfig: 'tsconfig.build.json',
                target: 'esnext',
                jsx: 'automatic',
            }),
            postcss({
                modules: true,
                autoModules: true,
                use: [
                    ['sass', {
                        includePaths: ["src"]
                    }]
                ],
                extensions: ['.scss'],
                plugins: [
                    postcssPresetEnv()
                ],
                extract: path.resolve('dist/ui.css')
            }),
            summary({
                showGzippedSize: true
            })
        ]
    }
];
