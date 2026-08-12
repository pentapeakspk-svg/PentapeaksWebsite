# Deployment Guide: Penta Peaks on Vercel

This guide walks you through deploying the Penta Peaks International website to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free at https://vercel.com)
- PostgreSQL database (Supabase, Railway, or managed provider)
- SMTP credentials for email (Gmail, SendGrid, etc.)

## Step 1: Prepare Your Repository

1. Ensure all changes are committed:
   ```bash
   git add .
   git commit -m "Production deployment preparation"
   git push origin master
   ```

2. The build has been tested and passes all checks.

## Step 2: Set Up PostgreSQL Database

Choose one of these options:

### Option A: Supabase (Recommended)
1. Create account at https://supabase.com
2. Create a new project
3. Go to Settings → Database → Connection String
4. Copy the PostgreSQL URI

### Option B: Railway
1. Create account at https://railway.app
2. Create a new PostgreSQL database
3. Copy the database connection URL

### Option C: Self-hosted or Other Provider
Contact your database provider for the connection URL format.

## Step 3: Configure Environment Variables

Create a `.env.production.local` file with your production secrets (DO NOT commit):

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

## Step 4: Deploy to Vercel

### Option A: Import from GitHub (Recommended)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (default)
   - **Install Command**: `npm ci` (default)

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add each variable from your `.env.production.local`:
     - `DATABASE_URL`
     - `NEXTAUTH_URL` (set to your Vercel domain or custom domain)
     - `NEXTAUTH_SECRET`
     - `SMTP_HOST`
     - `SMTP_PORT`
     - `SMTP_USER`
     - `SMTP_PASS`

6. Click "Deploy"

### Option B: Deploy from CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to:
# 1. Link to your project
# 2. Configure settings
# 3. Add environment variables
```

## Step 5: Run Database Migrations

After successful deployment, migrate your database:

```bash
# Run migrations on Vercel
vercel env pull  # Download environment variables locally

# Run migration
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

Or connect to your database directly and run:
```bash
npx prisma migrate deploy
```

## Step 6: Configure Custom Domain (Optional)

1. In Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Update DNS records according to Vercel's instructions
4. Wait for DNS propagation (usually 5-30 minutes)
5. Update `NEXTAUTH_URL` to your custom domain

## Step 7: Verify Deployment

1. Visit your Vercel deployment URL
2. Test key features:
   - [ ] Home page loads
   - [ ] Product pages display correctly
   - [ ] Product categories work
   - [ ] Contact form works
   - [ ] Student login page loads
   - [ ] Image optimization is working

3. Check logs in Vercel Dashboard → Deployments → View Logs

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all environment variables are set
- Verify DATABASE_URL is correct
- Try `npm run build` locally to debug

### Database Connection Issues
- Verify DATABASE_URL format
- Check if database server is accessible from Vercel
- For Supabase: add Vercel IP to allowlist (if required)
- For Railway: ensure database is not in sleep mode

### NextAuth Errors
- Verify NEXTAUTH_SECRET is set
- Ensure NEXTAUTH_URL matches your deployment domain
- Check email configuration for password reset emails

### Email Not Sending
- Verify SMTP credentials are correct
- Check if Gmail/provider requires "Less secure app access" or app password
- Test locally first with same credentials
- Check spam folder

## Monitoring & Maintenance

### Log Monitoring
1. Vercel Dashboard → Functions/Logs
2. Check for errors and warnings

### Performance
1. Vercel Dashboard → Performance
2. Monitor Core Web Vitals
3. Check image optimization

### Updates
```bash
# Pull latest from repository
git pull

# Changes automatically deploy on push
```

## Security Checklist

- [ ] NEXTAUTH_SECRET is strong (32+ characters, random)
- [ ] Database is not publicly accessible
- [ ] SMTP credentials are app-specific passwords (not main password)
- [ ] Environment variables are not committed to Git
- [ ] `.env.example` is committed without secrets
- [ ] All dependencies are up to date

## Rollback to Previous Version

```bash
# In Vercel Dashboard:
# 1. Deployments tab
# 2. Find previous deployment
# 3. Click "..." → Promote to Production
```

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- NextAuth.js Docs: https://next-auth.js.org
- Prisma Docs: https://www.prisma.io/docs

## Need Help?

- Check Vercel logs for error messages
- Review the DEPLOYMENT_CHECKLIST.md
- Verify all environment variables match this guide
