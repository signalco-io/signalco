const withPWA = require('next-pwa')

module.exports = withPWA({
    experimental: { esmExternals: true },
    pwa: {
        dest: 'public',
        scope: '/app',
        disable: process.env.NODE_ENV === 'development',
        swSrc: 'src/service-worker.js'
    }
});