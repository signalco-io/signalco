const withPWA = require('next-pwa')

module.exports = withPWA({
    pwa: {
        dest: 'public',
        // swSrc: 'src/service-worker.js'
    }
});