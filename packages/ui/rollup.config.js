import path from 'path';
import fs from 'fs';
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import postcss from "rollup-plugin-postcss";
import postcssPresetEnv from 'postcss-preset-env';

const plugins = [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    esbuild({
        tsconfig: 'tsconfig.build.json',
        target: 'esnext',
        jsx: 'automatic'
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
        inject: false
    })
];

function getFolders(entry) {
    return fs.readdirSync(entry).filter(name => name !== 'index.ts' && name.indexOf('.') < 0).filter(name => name !== 'utils');
}

const folderBuilds = getFolders('./src').map(folder => {
    return {
        input: `src/${folder}/index.ts`,
        output: {
            // ensure file destination is same as where the typings are
            file: `dist/${folder}/index.js`,
            sourcemap: true,
            exports: 'named',
        },
        plugins,
    }
});


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
            ...plugins,
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
            })
        ],
    },
    ...folderBuilds
];
