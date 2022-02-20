const chalk = require('chalk');
const { unlinkSync, renameSync, readFileSync, readdirSync, lstatSync } = require('fs');
const { join } = require('path');
const { stdout } = require('process');

// Directory paths
const APPROVED_DIR_NAME = '.stories-approved';
const PENDING_DIR_NAME = '.stories-pending';
const APPROVED_STORYCAPS = join(__dirname, `../${APPROVED_DIR_NAME}`);
const PENDING_STORYCAPS = join(__dirname, `../${PENDING_DIR_NAME}`);

/**
 * Gets all the file paths from the selected directory recursively.
 *
 * @param {string} directory Path to the directory from which to read the files.
 * @returns Array of file paths in the selected directory
 */
function getFilesRecursively(directory) {
    const files = [];

    const filesInDirectory = readdirSync(directory);

    filesInDirectory.forEach((file) => {
        const absolute = join(directory, file);

        if (lstatSync(absolute).isDirectory()) {
            files.push(...getFilesRecursively(absolute));
        } else {
            files.push(absolute);
        }
    });

    return files;
}

/**
 * Prints the information about starting the task and its completion to the console.
 *
 * @param {string} message Message to output before starting the process.
 * @param {Function} taskToRun Function to invoke.
 * @returns Value that the function returns
 */
function logProcess(message, taskToRun) {
    try {
        stdout.write(message);
        const valueToReturn = taskToRun();
        stdout.write(chalk.green(' DONE ✔') + '\n');

        return valueToReturn;
    } catch (error) {
        stdout.write(chalk.red(' ERROR X') + '\n');

        throw error;
    }
}

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
            logProcess(`\t[${chalk.red('-')}] ${approvedFile.substring(possiblePending.indexOf(APPROVED_DIR_NAME) + APPROVED_DIR_NAME.length + 1)}`, () => unlinkSync(approvedFile));
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
            logProcess(`\t[${chalk.green("+")}] ${possibleNewShortPath}`, () => renameSync(pendingFile, possibleNew));
            numberOfChanges++;
        } else {
            const pendingFileBytes = readFileSync(pendingFile);
            const approvedFileBytes = readFileSync(possibleNew);

            // If the files are not the same, overwrite it.
            if (!pendingFileBytes.equals(approvedFileBytes)) {
                logProcess(`\t[${chalk.yellow('~')}] ${possibleNewShortPath}`, () => renameSync(pendingFile, possibleNew));
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