import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import postcss from "rollup-plugin-postcss";
import postcssPresetEnv from 'postcss-preset-env';
import { visualizer } from "rollup-plugin-visualizer";

export default [
    {
        input: [
            './src/index.ts'
        ],
        output: {
            dir: 'dist',
            format: 'esm',
            sourcemap: true
        },
        plugins: [
            peerDepsExternal(),
            resolve({
                browser: true
            }),
            commonjs(),
            esbuild({
                tsconfig: 'tsconfig.build.json'
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
                ]
            }),
            visualizer()
        ],
    }
];
