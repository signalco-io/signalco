#! /usr/bin/env node

const apiUrl = 'http://127.0.0.1:7003/api';

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('Invalid format.\n\nCall with `mutex <COMMAND> <KEY>` where\n\t<COMMAND> is either "wait" or "release"\n\t<KEY> is the resource key');
    process.exit(1);
}

const [command, key] = args;

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitSync(key) {
    while(true) {
        try {
            const response = await fetch(`${apiUrl}/wait/${key}`, {
                method: 'POST',
            });
            if (response.status === 202) {
                console.info(key, "available");
                return true;
            } else if (response.status === 409) {
                process.stdout.write('.');
                await delay(1000);
            } else {
                console.error('Unknown response', response);
                return false;
            }
        } catch (err) {
            console.error('Failed to aquire lease', err);
            return false;
        }
    }
}

async function releaseSync(key) {
    try {
        const response = await fetch(`${apiUrl}/release/${key}`, {
            method: 'POST',
        });
        if (response.status === 202) {
            console.info(key, "released");
            return true;
        } else {
            console.error('Unknown response', response);
            return false;
        }
    } catch (err) {
        console.error('Failed to release', err);
        return false;
    }
}

if(command === 'wait') {
    if (!await waitSync(key))
        process.exit(1);
} else if(command === 'release') {
    if (!await releaseSync(key))
        process.exit(1);
} else {
    console.error('Unknown command', command);
    process.exit(1);
}

process.exit(0); 