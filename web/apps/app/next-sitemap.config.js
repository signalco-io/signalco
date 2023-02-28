/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: process.env.SITE_URL || 'https://app.signalco.io',
    generateRobotsTxt: true,
    exclude: ['/*', '/login-return']
    // ...other options
}
