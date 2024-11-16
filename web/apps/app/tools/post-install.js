'use strict'

import { copy } from 'fs-extra';

try {
    process.stdout.write('Copy monaco-editor resources...')
    await copy('./node_modules/monaco-editor/min/vs', './public/vs');
    process.stdout.write('Copy completed!');
} catch (err) {
    process.stdout.write('An error occured while copying the folder.');
    throw err;
}
