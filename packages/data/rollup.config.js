import json from '@rollup/plugin-json';
import esbuild from 'rollup-plugin-esbuild';
import summary from "rollup-plugin-summary";

export default [
    {
        input: [
            './src/index.ts'
        ],
        output: {
            dir: 'dist',
            format: 'esm'
        },
        plugins: [
            json(),
            esbuild({
                tsconfig: 'tsconfig.build.json',
                target: 'esnext'
            }),
            summary({
                showGzippedSize: true
            })
        ],
    }
];
