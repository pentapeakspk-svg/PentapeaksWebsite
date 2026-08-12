# Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] Build passes without errors: `npm run build`
- [ ] No console warnings in build output
- [ ] All imports are correct and components exist
- [ ] No debugging code left in codebase
- [ ] All API endpoints have error handling

### Testing
- [ ] Home page renders correctly
- [ ] Product pages load and display data
- [ ] Product categories work properly
- [ ] Product sub-categories and individual products work
- [ ] Contact form is functional
- [ ] Student login page accessible
- [ ] Navigation works across all pages
- [ ] Images load optimally
- [ ] Mobile responsiveness checked

### Security
- [ ] No hardcoded API keys or credentials
- [ ] All sensitive data in environment variables
- [ ] `.env` files are in `.gitignore`
- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] Database credentials are not exposed
- [ ] CORS headers configured if needed
- [ ] Security headers set in next.config.ts

### Performance
- [ ] Images are optimized
- [ ] Code splitting is working
- [ ] No unused dependencies
- [ ] Large files are minified
- [ ] CSS is optimized
- [ ] JavaScript bundle size is reasonable

### Git & Repository
- [ ] All changes committed
- [ ] Repository is clean (no untracked files)
- [ ] Branch is up to date with main
- [ ] .gitignore excludes sensitive files
- [ ] README.md is up to date
- [ ] DEPLOYMENT.md is in repository

## Vercel Setup

### Environment Variables
- [ ] DATABASE_URL configured
- [ ] NEXTAUTH_URL configured
- [ ] NEXTAUTH_SECRET configured
- [ ] SMTP_HOST configured
- [ ] SMTP_PORT configured
- [ ] SMTP_USER configured
- [ ] SMTP_PASS configured
- [ ] All variables are production-ready

### Build Configuration
- [ ] vercel.json is present
- [ ] Build command: `npm run build`
- [ ] Install command: `npm ci`
- [ ] Output directory: `.next`
- [ ] Framework detection: Next.js

### Domain Configuration
- [ ] Custom domain added (if using)
- [ ] DNS records updated (if using custom domain)
- [ ] SSL certificate enabled (automatic with Vercel)
- [ ] Redirect from www to non-www configured (or vice versa)

## Database Setup

### PostgreSQL Database
- [ ] Database created
- [ ] Connection string verified
- [ ] Database accessible from Vercel
- [ ] Firewall/security groups allow Vercel IP range

### Migrations
- [ ] Prisma schema is up to date
- [ ] All migrations are created
- [ ] Migrations run successfully: `npx prisma db push`
- [ ] Database has correct schema
- [ ] Seed data loaded (if applicable)

## Post-Deployment

### First Deploy
- [ ] Deployment completed successfully
- [ ] No build errors in Vercel logs
- [ ] No runtime errors in Vercel logs
- [ ] Home page is accessible
- [ ] Can navigate through pages

### Testing in Production
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Styling matches development
- [ ] Forms work correctly
- [ ] Email sending works (test contact form)
- [ ] Authentication works (if available)
- [ ] Database queries work
- [ ] No console errors (check browser dev tools)

### Performance Verification
- [ ] Page load times acceptable
- [ ] Lighthouse score is good
- [ ] Core Web Vitals are healthy
- [ ] No performance regressions

### Analytics & Monitoring
- [ ] Vercel Analytics enabled
- [ ] Error logs being captured
- [ ] Performance metrics visible
- [ ] Can access deployment logs

## Ongoing Maintenance

### Weekly
- [ ] Monitor Vercel logs for errors
- [ ] Check performance metrics
- [ ] Verify database is responsive

### Monthly
- [ ] Review and update dependencies
- [ ] Check security advisories
- [ ] Backup database (if applicable)
- [ ] Review analytics and traffic

### As Needed
- [ ] Update content/data
- [ ] Deploy new features
- [ ] Fix bugs and issues
- [ ] Optimize performance

## Rollback Plan

If deployment has issues:
1. [ ] Check Vercel deployment logs
2. [ ] Verify environment variables are correct
3. [ ] Check database connection
4. [ ] Rollback to previous deployment if needed
5. [ ] Fix issue locally
6. [ ] Test fixes
7. [ ] Redeploy

## Success Criteria

Production deployment is considered successful when:
- ✓ Application builds without errors
- ✓ All pages load and function correctly
- ✓ No console errors or warnings
- ✓ Database queries work properly
- ✓ Email sending works (if configured)
- ✓ Performance metrics are acceptable
- ✓ Security measures are in place
- ✓ Monitoring and logging are active

---

**Date Deployed**: ___________
**Deployed By**: ___________
**Notes**: 
```
[Add any relevant deployment notes here]
```
