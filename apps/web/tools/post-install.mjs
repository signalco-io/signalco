'use strict'

import { copy } from 'fs-extra';
process.stdout.write('Copy monaco-editor resources...')
copy('./node_modules/monaco-editor/min/vs', './public/vs', function (err) {
    if (err) {
        process.stdout.write('An error occured while copying the folder.');
        return process.stdout.write(err);
    }
    process.stdout.write('Copy completed!');
});
