const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { getFilesRecursively, logProcess } = require('./nodeHelpers');

// Directory paths
const APPROVED_DIR_NAME = '.stories-approved';
const PENDING_DIR_NAME = '.stories-pending';
const APPROVED_STORYCAPS = path.join(__dirname, `../${APPROVED_DIR_NAME}`);
const PENDING_STORYCAPS = path.join(__dirname, `../${PENDING_DIR_NAME}`);

let numberOfChanges = false;
try {
    // Get all the approved files.
    const approvedFiles = logProcess('Fetching approved files...', () => getFilesRecursively(APPROVED_STORYCAPS));

    // Get all the pending files.
    const pendingFiles = logProcess('Fetching pending files...', () => getFilesRecursively(PENDING_STORYCAPS));

    // Iterate all the approved files.
    approvedFiles.forEach((approvedFile) => {
        const possiblePending = approvedFile.replace(APPROVED_DIR_NAME, PENDING_DIR_NAME);

        // If the approved file is an old one (does not exist in the pending folder)
        // delete it from the approved folder.
        if (!pendingFiles.includes(possiblePending)) {
            logProcess(`\t[${chalk.red('-')}] ${approvedFile.substring(possiblePending.indexOf(APPROVED_DIR_NAME) + APPROVED_DIR_NAME.length + 1)}`, () => fs.unlinkSync(approvedFile));
            numberOfChanges++;
        }
    });

    // Iterate all the files that are pending for approval.
    pendingFiles.forEach((pendingFile) => {
        const possibleNewShortPath = pendingFile.substring(pendingFile.indexOf(PENDING_DIR_NAME) + PENDING_DIR_NAME.length + 1);
        const possibleNew = pendingFile.replace(PENDING_DIR_NAME, APPROVED_DIR_NAME);

        // If the pending file is a new one (does not exist in the approved folder)
        // move it to the approved folder.
        if (!approvedFiles.includes(possibleNew)) {
            logProcess(`\t[${chalk.green("+")}] ${possibleNewShortPath}`, () => fs.renameSync(pendingFile, possibleNew));
            numberOfChanges++;
        } else {
            const pendingFileBytes = fs.readFileSync(pendingFile);
            const approvedFileBytes = fs.readFileSync(possibleNew);

            // If the files are not the same, overwrite it.
            if (!pendingFileBytes.equals(approvedFileBytes)) {
                logProcess(`\t[${chalk.yellow('~')}] ${possibleNewShortPath}`, () => fs.renameSync(pendingFile, possibleNew));
                numberOfChanges++;
            } else {
                console.log(`\t[${chalk.white('=')}] ${possibleNewShortPath}`);
            }
        }
    });
} catch (error) {
    console.log();
    console.error(chalk.red('(error 2) Error occurred while running the script:'));
    console.error(chalk.red(error));
    process.exit(2);
}

if (numberOfChanges) {
    console.log();
    console.error(chalk.red(`(error 1) Detected ${numberOfChanges} changes`));
    process.exit(1);
}