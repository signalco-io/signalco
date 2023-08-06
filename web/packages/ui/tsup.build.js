import { Worker, isMainThread, workerData } from 'worker_threads';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { build } from 'tsup';
import _ from 'lodash';
import { globSync } from 'glob';

async function buildStage({ entry, watch, clean }) {
    console.log('\u{1F680} ~ building entry:', entry);
    try {
        await build({
            dts: true,
            minify: !watch,
            clean: clean,
            watch,
            entry: Object.fromEntries(entry),
            format: ['esm']
        });
    } catch (error) {
        console.log('\u{1F680} ~ error while building entries :', entry);
        console.log(error);
        throw error;
    }
}

async function buildAllStages(watch) {
    const entries = [
        ...globSync('src/**/index.ts').map((file) => [
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
    ];
    const chunkSize = 3;
    const chunks = _.chunk(entries, chunkSize);
    const workers = [];
    for await (const [chunkIndex, chunk] of chunks.entries()) {
        console.log('\u{1F680} ~ chunk: ', chunk);

        const worker = new Worker(fileURLToPath(new URL('./tsup.build.js', import.meta.url)), {
            workerData: {
                entry: chunk,
                watch: watch,
                clean: !watch && chunkIndex === 0
            }
        });
        workers.push(new Promise((resolve, reject) => {
            worker.on('exit', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });
        }));
    }

    try {
        await Promise.all(workers);
    } catch (error) {
        console.log('\u{1F680} ~ error while building entries :', entries);
        console.log(error);
        throw error;
    }
}

async function invokeBuild(watch2) {
    try {
        await buildAllStages(watch2);
        console.log('\u{1F680} ~ build all success');
    } catch (error) {
        console.log('\u{1F680} ~ build all error === ', error);
    }
}

if (isMainThread) {
    const watch = Boolean(process.argv.find((arg) => arg === '--watch'));
    const start = Date.now();
    await invokeBuild(watch);
    const end = Date.now();
    console.log('\u{1F680} ~ build time:', end - start, 'ms');
} else {
    await buildStage(workerData);
}

