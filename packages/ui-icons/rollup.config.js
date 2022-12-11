import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import summary from "rollup-plugin-summary";
import typescript from "@rollup/plugin-typescript";
import { apiExtractor } from "rollup-plugin-api-extractor";

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
                tsconfig: 'tsconfig.build.json'
            }),
            summary({
                showGzippedSize: true
            })
        ],
    },
    {
        input: "./src/index.ts",
        output: {
            dir: "dist",
            format: 'esm',
            sourcemap: true
        },
        plugins: [peerDepsExternal(), resolve({
            browser: true
        }), typescript(), apiExtractor()]
    }
];
