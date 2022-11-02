/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.signalco.io',
    generateRobotsTxt: true,
    exclude: ['/app/*', '/login-return']
    // ...other options
}