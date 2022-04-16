'use strict'

var fs = require('fs-extra');

fs.copy('./node_modules/monaco-editor/min/vs', './public/vs', function (err) {
    if (err) {
        console.log('An error occured while copying the folder.');
        return console.error(err);
    }
    console.log('Copy completed!');
});
