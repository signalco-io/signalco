/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: process.env.SITE_URL || 'https://uier.io',
    generateRobotsTxt: true,
    exclude: []
    // ...other options
}
