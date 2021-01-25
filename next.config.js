const withPWA = require('next-pwa')

module.exports = withPWA({
    pwa: {
        dest: 'public',
        scope: '/app',
        swSrc: 'src/service-worker.js'
    }
});