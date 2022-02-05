// General imports
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Node helpers import
const { getFilesRecursively, logProcess } = require('./nodeHelpers');

// Directory paths
const APPROVED_DIR_NAME = '.stories-approved';
const PENDING_DIR_NAME = '.stories-pending';

const APPROVED_STORYCAPS = path.join(__dirname, `../${APPROVED_DIR_NAME}`);
const PENDING_STORYCAPS = path.join(__dirname, `../${PENDING_DIR_NAME}`);

/**
 * Scripts main function.
 *
 * @param {string} approvedStorycaps Path to the approved storycaps directory
 * @param {string} pendingStorycaps Path to the pending storycaps directory
 * @param {string} approvedDirName Name of the approved storycaps directory
 * @param {string} pendingDirName Name of the pending storycaps directory
 */
const run = (
    approvedStorycaps = APPROVED_STORYCAPS,
    pendingStorycaps = PENDING_STORYCAPS,
    approvedDirName = APPROVED_DIR_NAME,
    pendingDirName = PENDING_DIR_NAME
) => {
    try {
        // Get all the approved files.
        const approvedFiles = logProcess('Fetching approved files...', () => getFilesRecursively(approvedStorycaps));

        // Get all the pending files.
        const pendingFiles = logProcess('Fetching pending files...', () => getFilesRecursively(pendingStorycaps));

        // Iterate all the approved files.
        approvedFiles.forEach((approvedFile) => {
            const possiblePending = approvedFile.replace(approvedDirName, pendingDirName);

            // If the approved file is an old one (does not exist in the pending folder)
            // delete it from the approved folder.
            if (!pendingFiles.includes(possiblePending)) {
                logProcess(`\t[${chalk.red('-')}] ${approvedFile.substring(pendingFile.indexOf(APPROVED_DIR_NAME) + APPROVED_DIR_NAME.length + 1)}`, () => fs.unlinkSync(approvedFile));
            }
        });

        // Iterate all the files that are pending for approval.
        pendingFiles.forEach((pendingFile) => {
            const possibleNewShortPath = pendingFile.substring(pendingFile.indexOf(PENDING_DIR_NAME) + PENDING_DIR_NAME.length + 1);
            const possibleNew = pendingFile.replace(pendingDirName, approvedDirName);

            // If the pending file is a new one (does not exist in the approved folder)
            // move it to the approved folder.
            if (!approvedFiles.includes(possibleNew)) {
                logProcess(`\t[${chalk.green("+")}] ${possibleNewShortPath}`, () => fs.renameSync(pendingFile, possibleNew));
            } else {
                const pendingFileBytes = fs.readFileSync(pendingFile);
                const approvedFileBytes = fs.readFileSync(possibleNew);

                // If the files are not the same, overwrite it.
                if (!pendingFileBytes.equals(approvedFileBytes)) {
                    logProcess(`\t[${chalk.yellow('~')}] ${possibleNewShortPath}`, () => fs.renameSync(pendingFile, possibleNew));
                } else {
                    console.log(`\t[${chalk.white('=')}] ${possibleNewShortPath}`);
                }
            }
        });
    } catch (error) {
        console.error('Error occurred while running the script:');
        console.error(error);
    }
};

module.exports = { run };