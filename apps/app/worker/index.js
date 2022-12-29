'use strict'

self.addEventListener('message', async event => {
    // Filter by origin
    if (event.origin != 'https://app.signalco.dev' &&
        event.origin != 'https://app.signalco.io')
        return;
})
