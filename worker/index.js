  
'use strict'

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
//
// self.__WB_DISABLE_DEV_LOGS = true

// const util = require('./util')

// util();

// // listen to message event from window
// self.addEventListener('message', event => {
//   // HOW TO TEST THIS?
//   // Run this in your browser console: 
//   //     window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
//   // OR use next-pwa injected workbox object
//   //     window.workbox.messageSW({command: 'log', message: 'hello world'})
//   // console.log(event.data)
// });

self.addEventListener('message', async event => {
  if (event.data && event.data.action === 'CACHE_NEW_ROUTE') {
    caches.open('others').then(cache =>
      cache.match(event.source.url).then(res => {
        if (res === undefined) {
          return cache.add(event.source.url)
        }
      })
    )
  }
})