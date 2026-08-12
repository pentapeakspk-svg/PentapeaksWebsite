/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://pentapeaks.com',
  generateRobotsTxt: false,
  exclude: ['/admin/*', '/student/*', '/api/*'],
  changefreq: 'weekly',
  priority: 0.7,
}
