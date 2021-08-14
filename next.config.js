// const withPWA = require('next-pwa')

module.exports = {
    // Prefer loading of ES Modules over CommonJS
    experimental: { esmExternals: true }
}

// module.exports = withPWA({
//     pwa: {
//         dest: 'public',
//         scope: '/app',
//         // swSrc: 'src/service-worker.js'
//     }
// });