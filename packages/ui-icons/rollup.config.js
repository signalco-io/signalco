import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
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
            peerDepsExternal(),
            resolve(),
            commonjs(),
            esbuild({
                tsconfig: 'tsconfig.build.json',
                target: 'esnext',
                minify: false,
                jsx: 'automatic'
            }),
            summary({
                showGzippedSize: true
            })
        ],
    }
];
