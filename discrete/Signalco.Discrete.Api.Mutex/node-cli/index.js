#! /usr/bin/env node

const apiUrl = 'https://mutex.api.signalco.io/api';

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('Invalid format.\n\nCall with `mutex <COMMAND> <KEY>` where\n\t<COMMAND> is either "wait" or "release"\n\t<KEY> is the resource key');
    process.exit(1);
}

const [command, key] = args;

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, retryCount = 10) {
    let response;
    let error;
    for (let i = 0; i <= retryCount; i++) {
        try {
            response = await fetch(url, options);
            if(response.status >= 500)
                throw new Error(`Server error ${response.status}`);
            return response;
        } catch (err) {
            error = err;

            // Exponantial backoff with max 60s
            const delayMs = Math.min(1000 * Math.pow(2, i), 60000);
            console.warn(`Failed to fetch (retry ${i}/${retryCount}). Url: ${url}`, `Retrying in ${delayMs}ms`);
            await delay(delayMs);
        }
    }
    
    console.warn('Failed to fetch', url, error);
    throw error;
}

async function waitSync(key) {
    while(true) {
        try {
            const response = await fetchWithRetry(`${apiUrl}/wait/${key}`, {
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
        const response = await fetchWithRetry(`${apiUrl}/release/${key}`, {
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