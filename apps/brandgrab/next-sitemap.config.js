/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.brandgrab.io',
    generateRobotsTxt: true,
    exclude: []
    // ...other options
}
