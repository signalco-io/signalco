/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: process.env.SITE_URL || 'https://doprocess.app',
    generateRobotsTxt: true,
    exclude: []
    // ...other options
}
