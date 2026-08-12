# Supabase Setup Guide for Pentapeaks

Complete guide to set up PostgreSQL database with Supabase and deploy on Vercel.

---

## 📑 Table of Contents

1. [What is Supabase?](#what-is-supabase)
2. [Free Tier Limits](#free-tier-limits)
3. [Create Supabase Account](#create-supabase-account)
4. [Create New Project](#create-new-project)
5. [Get Connection String](#get-connection-string)
6. [Local Development Setup](#local-development-setup)
7. [Deploy to Vercel](#deploy-to-vercel)
8. [Run Database Migrations](#run-database-migrations)
9. [Database Management](#database-management)
10. [Troubleshooting](#troubleshooting)
11. [Backup & Recovery](#backup--recovery)

---

## What is Supabase?

**Supabase** is an open-source Firebase alternative that provides:
- ✅ PostgreSQL database (hosted)
- ✅ Real-time data synchronization
- ✅ Authentication system
- ✅ REST API automatically generated  
- ✅ Web-based database editor
- ✅ Automated backups
- ✅ Free tier for development

For the Pentapeaks project, we use Supabase for PostgreSQL database management with Prisma ORM.

---

## Free Tier Limits

### Supabase Free Plan Includes:

| Feature | Limit |
|---------|-------|
| **Database Storage** | 500 MB |
| **Bandwidth** | 2 GB/month |
| **Projects** | Up to 2 |
| **Connections** | Unlimited |
| **Backups** | Daily (7-day retention) |
| **Support** | Community |
| **Uptime SLA** | Best effort |

### Is Free Tier Enough?

✅ **Yes for**: Development, testing, side projects, small traffic sites

❌ **No for**: High traffic (millions of requests), large databases (>500MB data)

### When to Upgrade

Upgrade when you need:
- More than 500 MB storage
- More than 2 projects
- Guaranteed uptime SLA
- Priority support

**Pricing**: Pay-as-you-go starting from storage overage (around $0.25/GB)

---

## Create Supabase Account

### Step 1: Visit Supabase Website

1. Go to https://supabase.com
2. Click **"Start your project"** button (top right)

### Step 2: Sign Up

**Option A: Sign up with GitHub (Recommended)**
1. Click **"Continue with GitHub"**
2. Authorize Supabase in GitHub
3. GitHub account will be linked automatically

**Option B: Sign up with Email**
1. Click **"Sign up with email"**
2. Enter:
   - **Email**: your@email.com
   - **Password**: Strong password (min 8 chars)
3. Click **"Sign up"**
4. Check email for verification link
5. Click verification link

### Step 3: Complete Profile

1. Verify email if needed
2. Accept Terms of Service
3. Complete any onboarding steps
4. Your account is ready!

---

## Create New Project

### Step 1: Access Projects Dashboard

After signing up, you'll see the Supabase dashboard.

If not, go to: https://app.supabase.com/

### Step 2: Create Project

1. Click **"New Project"** (or **"Create new project"**)
2. Fill in the project details:

#### Project Details

| Field | Value | Example |
|-------|-------|---------|
| **Project Name** | Your project name | `pentapeaks` |
| **Database Password** | Strong password (save this!) | `Sup3r$ecure!Pass` |
| **Region** | Closest region | `us-east-1` (USA) or `eu-west-1` (Europe) |
| **Organization** | Default organization | (auto-filled) |

### Step 3: Set Database Password

⚠️ **Important**: This password is for PostgreSQL admin user (`postgres`). Save it in a secure place!

Generate a strong password:
```
- At least 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Example: Penta#2024Secure!
```

### Step 4: Choose Region

Select the region closest to your users:
- **US East** (`us-east-1`) - For North America
- **EU West** (`eu-west-1`) - For Europe
- **Asia Pacific** (`ap-southeast-1`) - For Asia

Closer region = Lower latency

### Step 5: Create Project

1. Click **"Create new project"** button
2. Wait 2-3 minutes for database initialization

You'll see a loading indicator:
```
Creating project...
Setting up PostgreSQL instance...
Configuring authentication...
```

✅ Project is ready when you see the dashboard

---

## Get Connection String

### Step 1: Navigate to Database Settings

After project is created:

1. Click **"Settings"** (left sidebar, bottom)
2. Click **"Database"**

### Step 2: Find Connection String

In the Database page, find the **"Connection String"** section:

```
Section: Database
├── Tab: Connection string
├── Tab: Connection pooler
└── ...
```

### Step 3: Select URI Format

Make sure you're viewing **"URI"** (not "Params"):

1. Find the toggle or dropdown showing connection format
2. Select **"URI"** if available
3. You should see a URL starting with `postgresql://`

### Step 4: Copy Connection String

The connection string looks like:

```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?schema=public
```

Components:
- `postgres` = Username
- `[PASSWORD]` = Database password you created
- `db.xxxxx.supabase.co` = Database host (unique to your project)
- `5432` = PostgreSQL port (default)
- `postgres` = Database name
- `?schema=public` = Schema (important for Prisma!)

### Step 5: Save Connection String

Copy and save this URL. You'll need it for:
- `.env.local` file (local development)
- Vercel environment variables (production)

⚠️ **Security Warning**: This URL contains your database password. Keep it secret!

---

## Local Development Setup

### Step 1: Update .env.local

1. Open `.env.local` in your project root
2. Find or create this line:

```env
DATABASE_URL="your-supabase-connection-string"
```

3. Replace with your actual Supabase connection string

**Example**:
```env
DATABASE_URL="postgresql://postgres:Penta#2024Secure!@db.abc123def.supabase.co:5432/postgres?schema=public"
```

### Step 2: Add Authentication Variables

Also add these to `.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key"

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Generate NEXTAUTH_SECRET

**Option 1: Online Generator (Easy)**
1. Visit: https://generate-secret.vercel.app/32
2. Copy the generated key
3. Paste into `NEXTAUTH_SECRET=...`

**Option 2: Windows PowerShell**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Option 3: Mac/Linux Terminal**
```bash
openssl rand -base64 32
```

Example output:
```
Z7fG3kL9mN2pQ4rS8tU1vW5xY6zA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9z
```

### Step 3: Complete .env.local File

Your complete `.env.local` should look like:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-from-above"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Step 4: Test Connection Locally

1. Open terminal in project directory
2. Run development server:

```bash
npm run dev
```

3. Check terminal output for errors:
   - ✅ No "DATABASE_URL is undefined" errors
   - ✅ No connection refused errors
   - ✅ Server running on http://localhost:3000

4. Visit http://localhost:3000 in browser
5. Page should load without database errors

✅ If you see no errors = Database connection works!

---

## Deploy to Vercel

### Step 1: Commit Changes

Before deploying, commit your changes:

```bash
# Check what changed
git status

# Stage changes
git add .env.local

# Note: .env.local should already be in .gitignore
# So it won't be committed - which is correct for security!
```

If you haven't pushed yet:

```bash
git add .
git commit -m "Add database configuration"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repository (where Pentapeaks project is)
4. Click **"Import"**

### Step 3: Add Environment Variables

⚠️ **IMPORTANT**: Add these BEFORE clicking Deploy!

On the import page, find **"Environment Variables"** section.

#### Add DATABASE_URL

1. Click **"Add"** button
2. Enter:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public`
3. Click **"Save"**

#### Add NEXTAUTH_URL

1. Click **"Add"** button
2. Enter:
   - **Key**: `NEXTAUTH_URL`
   - **Value**: `https://*.vercel.app` (Vercel will replace `*` with your project name)
3. Click **"Save"**

#### Add NEXTAUTH_SECRET

1. Click **"Add"** button
2. Enter:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: `your-secret-from-.env.local`
3. Click **"Save"**

#### Add NEXT_PUBLIC_SITE_URL

1. Click **"Add"** button
2. Enter:
   - **Key**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://*.vercel.app`
3. Click **"Save"**

### Step 4: Deploy

1. Click **"Deploy"** button
2. Wait 3-5 minutes for deployment to complete
3. You'll see:
   - ✅ Build succeeded
   - ✅ Deployment complete
   - Your Vercel URL (e.g., `https://pentapeaks-xxx.vercel.app`)

### Step 5: Verify Environment Variables in Vercel

After deployment:

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Verify all variables are listed:
   - ✅ `DATABASE_URL`
   - ✅ `NEXTAUTH_URL`
   - ✅ `NEXTAUTH_SECRET`
   - ✅ `NEXT_PUBLIC_SITE_URL`

---

## Run Database Migrations

After deployment, create database tables:

### Method 1: Using Local Machine (Recommended)

```bash
# Download Vercel environment variables
vercel env pull

# Apply database schema to Supabase
npx prisma db push

# Optional: Seed sample data
npx prisma db seed
```

### Method 2: Using Vercel CLI

```bash
# Open shell in Vercel environment
vercel shell

# Inside the shell, run:
npx prisma db push
```

### Method 3: Check Manually

1. Go to https://app.supabase.com
2. Click your project
3. Click **"Table Editor"** (left sidebar)
4. Verify tables exist:
   - ✅ User
   - ✅ Student
   - ✅ Batch
   - ✅ Attendance
   - ✅ ClassLink
   - ✅ Supplier
   - ✅ BuyerInquiry
   - ✅ ContactInquiry
   - ✅ BlogPost

If tables are missing, run: `npx prisma db push` locally

---

## Database Management

### Using Supabase Studio (Web UI)

1. Go to https://app.supabase.com
2. Click your project
3. Click **"Table Editor"** (left sidebar)
4. You can:
   - ✅ View all tables
   - ✅ Browse records
   - ✅ Add new records (click **"Insert row"**)
   - ✅ Edit records (click on row)
   - ✅ Delete records
   - ✅ Run SQL queries

### Using Prisma Studio (Visual Editor)

```bash
npx prisma studio
```

Opens at http://localhost:5555

Allows:
- ✅ Browse all tables
- ✅ Add/edit/delete records
- ✅ Filter and search
- ✅ Export data

### Using SQL Editor

1. Go to Supabase → Your Project
2. Click **"SQL Editor"** (left sidebar)
3. Click **"New query"**
4. Write SQL:

```sql
-- View all users
SELECT * FROM "User";

-- View all students
SELECT * FROM "Student";

-- Count students
SELECT COUNT(*) FROM "Student";

-- Find student by email
SELECT * FROM "Student" WHERE email = 'student@example.com';
```

5. Click **"Run"**

---

## Troubleshooting

### Issue: "DATABASE_URL is not defined"

**Problem**: Environment variable not set in Vercel

**Solution**:
1. Go to Vercel project dashboard
2. Click **"Settings"**
3. Click **"Environment Variables"**
4. Verify `DATABASE_URL` is listed
5. If missing, add it again
6. Redeploy: Go to **"Deployments"** → Latest → Click menu → **"Redeploy"**

---

### Issue: "Connection refused" (ECONNREFUSED)

**Problem**: Cannot reach Supabase database

**Possible causes**:
1. Connection string has typo
2. Password is wrong
3. Supabase project is paused/inactive
4. Wrong region selected

**Solution**:

1. Check connection string format:
   ```
   postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public
   ```

2. Verify in Supabase:
   - Go to https://app.supabase.com
   - Click your project
   - Project should show "Active" status
   - Check if project is not paused

3. If paused, resume project:
   - Click **"Settings"**
   - Click **"Infrastructure"**
   - Click **"Resume project"**

4. Copy connection string again and update in Vercel

---

### Issue: "password authentication failed"

**Problem**: Database password is incorrect

**Solution**:
1. Go to Supabase → Your Project
2. Click **"Settings"** → **"Database"**
3. Scroll to **"Connection String"**
4. Copy URL again (ensure password is correct)
5. Update in `.env.local` and Vercel
6. Redeploy on Vercel

---

### Issue: "Database does not exist" or Schema Error

**Problem**: Migrations not run or schema missing

**Solution**:
```bash
# Run from local machine
npx prisma db push

# This will create all tables from prisma/schema.prisma
```

---

### Issue: Build Fails on Vercel

**Problem**: Deployment error

**Solution**:
1. Go to Vercel dashboard
2. Click project
3. Click **"Deployments"** tab
4. Click latest deployment
5. Click **"Logs"** tab
6. Read error message
7. Fix locally and push to GitHub
8. Redeploy

Common fixes:
- Missing environment variables
- Prisma schema syntax error
- Dependencies not installed
- Port already in use

---

### Issue: Cannot Connect Locally After Long Time

**Problem**: Connection timeout after project idle

**Solution**:
1. Supabase may pause free tier projects after inactivity
2. Go to https://app.supabase.com
3. Click your project
4. Click **"Resume project"** (if paused)
5. Wait 1-2 minutes
6. Try connecting again

---

## Backup & Recovery

### Automatic Backups

✅ Supabase automatically backs up your database:
- **Frequency**: Daily
- **Retention**: 7 days (free tier)
- **Recovery**: Instant restore from any backup

### View Backups

1. Go to Supabase → Your Project
2. Click **"Settings"**
3. Click **"Backups"** or **"Infrastructure"** → **"Backups"**
4. See list of available backups

### Restore from Backup

1. In Backups section
2. Find the backup you want
3. Click **"Restore"**
4. Choose to restore to:
   - Same project (overwrite current data)
   - New project (create copy)
5. Click **"Confirm"**

### Manual Backup (Export Data)

```bash
# Export entire database as SQL
pg_dump "postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public" > backup.sql

# Export specific table
pg_dump "postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres" -t "User" > user_backup.sql
```

### Restore Manual Backup

```bash
# Restore entire database
psql "postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public" < backup.sql

# This will recreate all tables and data
```

---

## Performance Tips

### 1. Add Indexes to Frequently Queried Columns

In `prisma/schema.prisma`:

```prisma
model User {
  id     String @id @default(cuid())
  email  String @unique
  name   String
  
  @@index([email])  // Speed up email searches
}

model Student {
  id     String @id @default(cuid())
  rollNo String
  
  @@index([rollNo])  // Speed up roll number searches
}
```

Then run:
```bash
npx prisma migrate dev
```

### 2. Monitor Database Performance

In Supabase dashboard:
1. Click your project
2. Click **"Monitor"** (left sidebar)
3. View:
   - Query performance
   - Connection count
   - Network traffic
   - Storage usage

### 3. Optimize Queries

✅ Good:
```javascript
// Only fetch needed fields
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true }
});
```

❌ Avoid:
```javascript
// Fetching everything (slower)
const users = await prisma.user.findMany();
```

### 4. Use Connection Pooling

Supabase includes connection pooling by default. No additional setup needed!

---

## Common Database Operations

### Create a User

```javascript
const user = await prisma.user.create({
  data: {
    name: "John Doe",
    email: "john@example.com",
    password: "hashed_password",
    role: "STUDENT",
  },
});
```

### Enroll Student in Batch

```javascript
const student = await prisma.student.update({
  where: { id: studentId },
  data: {
    batchId: batchId,
    enrollmentType: "BATCH",
  },
});
```

### Record Attendance

```javascript
const attendance = await prisma.attendance.create({
  data: {
    studentId,
    batchId,
    date: new Date(),
    status: "PRESENT",
    lectureNo: 1,
  },
});
```

### Get Student with Batch

```javascript
const student = await prisma.student.findUnique({
  where: { id: studentId },
  include: {
    batch: true,
    user: true,
  },
});
```

---

## Useful Commands

```bash
# Validate database connection
npx prisma db validate

# Open visual database editor
npx prisma studio

# Generate Prisma client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name your_migration_name

# Apply existing migrations
npx prisma migrate deploy

# Seed sample data
npx prisma db seed

# Pull Vercel environment variables
vercel env pull

# Check database URL
echo $DATABASE_URL

# View Vercel logs
vercel logs
```

---

## Security Best Practices

### 1. Never Commit .env Files

✅ Correct - .gitignore excludes .env:
```
.env
.env.local
.env.*.local
```

❌ Wrong - committing secrets:
```bash
git add .env.local
git commit -m "add credentials"  # DO NOT DO THIS!
```

### 2. Keep Password Secure

- Never share DATABASE_URL
- Don't paste in chat/email
- Use Vercel's environment variable management
- Rotate password every 90 days if exposed

### 3. Enable SSL/TLS

Connection string already includes SSL. Ensure URL ends with:
```
?schema=public
```

### 4. Monitor Access Logs

Supabase logs all connections:
1. Go to Supabase → Project
2. Click **"Logs"** (left sidebar)
3. Review recent queries
4. Check for unusual patterns

### 5. Use Least Privilege

When creating additional database users (advanced):
- Grant only SELECT, INSERT, UPDATE, DELETE permissions
- Don't grant DROP, ALTER, or GRANT permissions
- Create separate users for different applications

---

## Next Steps

1. ✅ Create Supabase account
2. ✅ Create project in Supabase
3. ✅ Get connection string
4. ✅ Set up local environment variables
5. ✅ Test database connection locally
6. ✅ Deploy to Vercel with environment variables
7. ✅ Run database migrations
8. → **Next**: Configure additional features (email, storage, etc.)
9. → **Next**: Set up custom domain in Vercel
10. → **Next**: Monitor production database

---

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Dashboard**: https://app.supabase.com
- **Prisma Docs**: https://www.prisma.io/docs
- **Vercel Docs**: https://vercel.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

**✅ Your database is ready for production!** 🚀
