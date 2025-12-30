# 🚀 LUMIÈRE Cinema - Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Environment Variables](#environment-variables)
4. [Deploying to Vercel](#deploying-to-vercel)
5. [Post-Deployment Steps](#post-deployment-steps)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before deploying, ensure you have:
- ✓ GitHub account with repository: https://github.com/Sandeshhegde10/movie-booking-site
- ✓ Vercel account (free tier works)
- ✓ PostgreSQL database (Vercel Postgres recommended)
- ✓ Stripe account for payments
- ✓ OpenAI API key for AI features

---

## 🗄️ Database Setup

### Option 1: Vercel Postgres (Recommended - Easiest)

1. **Go to Vercel Dashboard**
   - Navigate to: https://vercel.com/dashboard

2. **Create Postgres Database**
   - Click "Storage" → "Create Database"
   - Select "Postgres"
   - Choose your database name: `lumiere-cinema-db`
   - Select region closest to your users
   - Click "Create"

3. **Connect to Your Project**
   - Vercel will automatically add these environment variables:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL` ← **Use this one for DATABASE_URL**
     - `POSTGRES_URL_NON_POOLING`

4. **Copy the Connection String**
   - Copy `POSTGRES_PRISMA_URL` value
   - You'll use this as your `DATABASE_URL`

### Option 2: External PostgreSQL (Neon, Supabase, Railway)

**Neon (Free Tier):**
1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string (format: `postgresql://user:password@host/database?sslmode=require`)

**Supabase (Free Tier):**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database → Connection String (Pooling)
4. Copy the connection string

**Railway:**
1. Go to https://railway.app
2. Create new PostgreSQL database
3. Copy the connection string from settings

---

## 🔐 Environment Variables

### Required Environment Variables

You need to set these in Vercel:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# OpenAI (for quiz feature)
OPENAI_API_KEY="sk-proj-your-api-key-here"

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_secret_key"

# Optional: Next.js URL
NEXTAUTH_URL="https://your-app-url.vercel.app"
```

### How to Set Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - **Key:** `DATABASE_URL`
   - **Value:** Your PostgreSQL connection string
   - **Environment:** Select all (Production, Preview, Development)
4. Click "Save"
5. Repeat for all variables above

---

## 🚀 Deploying to Vercel

### Step 1: Connect GitHub Repository

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new

2. **Import GitHub Repository**
   - Click "Import Git Repository"
   - Search for: `Sandeshhegde10/movie-booking-site`
   - Click "Import"

3. **Configure Project**
   - **Project Name:** `lumiere-cinema` (or your preferred name)
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

### Step 2: Add Environment Variables

In the deployment settings:
1. Expand "Environment Variables" section
2. Add all variables from the section above
3. Make sure to add them for all environments

### Step 3: Deploy

1. Click "Deploy"
2. Wait for the build to complete (2-5 minutes)
3. Vercel will provide a URL like: `https://lumiere-cinema.vercel.app`

---

## 📦 Post-Deployment Steps

### 1. Initialize Database Schema

After successful deployment, you need to set up your database:

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Generate Prisma Client
npx prisma generate

# Push database schema to production
npx prisma db push

# Seed the database with movie data
npx prisma db seed
```

**Option B: Using Vercel Dashboard**

1. Go to your project on Vercel
2. Click "Deployments" → Latest Deployment → "Functions" tab
3. Find and run: `prisma/seed.ts` function
4. This will populate your database with 30+ movies

### 2. Verify Deployment

1. Visit your deployed URL
2. Check these pages:
   - ✓ Home page loads
   - ✓ Movies page shows movies (requires database)
   - ✓ Quiz page works (requires OpenAI API)
   - ✓ Login/Signup works (requires database)

### 3. Test Payment Flow

1. Use Stripe test cards:
   - **Success:** `4242 4242 4242 4242`
   - **Requires Auth:** `4000 0025 0000 3155`
   - **Declined:** `4000 0000 0000 9995`

---

## 🐛 Troubleshooting

### Common Deployment Errors

#### ❌ Error: "Cannot find module '@prisma/client'"

**Solution:**
```bash
# Regenerate Prisma Client
npx prisma generate

# Rebuild and redeploy
git add .
git commit -m "Regenerate Prisma Client"
git push origin main
```

#### ❌ Error: "PrismaClient is unable to connect to the database"

**Causes:**
1. Wrong `DATABASE_URL` in environment variables
2. Database not accessible from Vercel
3. Connection string missing `?schema=public`

**Solutions:**
- Verify `DATABASE_URL` is correct in Vercel settings
- Ensure PostgreSQL database allows external connections
- Add `?schema=public&sslmode=require` to connection string
- For Vercel Postgres, use `POSTGRES_PRISMA_URL` value

#### ❌ Error: "Build failed - Type errors"

**Solution:**
```bash
# Check for TypeScript errors locally
npm run build

# Fix any type errors shown
# Then commit and push
```

#### ❌ Error: "OpenAI API Error" or Quiz not working

**Causes:**
- Missing or invalid `OPENAI_API_KEY`
- API quota exceeded

**Solutions:**
- Verify OpenAI API key in Vercel environment variables
- Check your OpenAI account has available credits
- Visit: https://platform.openai.com/api-keys

#### ❌ Error: "Stripe is not defined"

**Causes:**
- Missing `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Environment variable not set for all environments

**Solutions:**
- Add Stripe keys to Vercel environment variables
- Ensure keys have `NEXT_PUBLIC_` prefix for client-side keys
- Redeploy after adding variables

#### ❌ Error: "Database schema not found" or Empty movies list

**Cause:** Database tables not created

**Solution:**
```bash
# Push schema to database
npx prisma db push

# Seed database with movie data
npx prisma db seed
```

### Force Rebuild

If deployment keeps failing:

1. **Clear Build Cache:**
   - Vercel Dashboard → Project Settings → "Clear Cache & Redeploy"

2. **Delete `.next` folder and rebuild:**
   ```bash
   rm -rf .next
   npm run build
   git add .
   git commit -m "Force rebuild"
   git push origin main
   ```

3. **Check Vercel Build Logs:**
   - Go to Deployments → Click on failed deployment
   - View "Build Logs" for detailed error messages

---

## 📊 Environment Variable Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key for quiz | `sk-proj-xxx` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ Yes | Stripe publishable key | `pk_test_xxx` |
| `STRIPE_SECRET_KEY` | ✅ Yes | Stripe secret key | `sk_test_xxx` |
| `NEXTAUTH_URL` | ⚠️ Optional | Your app URL | `https://your-app.vercel.app` |

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to `main`:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Runs npm install
# 3. Runs npm run build
# 4. Deploys if successful
```

**Branch Previews:**
- Push to any other branch for preview deployments
- Each PR gets a unique preview URL

---

## 📈 Performance Optimization

### Enable Edge Functions (Optional)

Add to `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
```

### Database Connection Pooling

For production PostgreSQL:
- Use connection pooling URL (most providers offer this)
- Set `connection_limit=10` in DATABASE_URL
- Example: `postgresql://user:pass@host/db?connection_limit=10`

---

## 🎯 Production Checklist

Before going live:

- [x] PostgreSQL database configured
- [x] All environment variables set
- [x] Database schema pushed (`npx prisma db push`)
- [x] Database seeded with movies (`npx prisma db seed`)
- [x] Stripe configured with production keys
- [x] OpenAI API key added
- [x] Test registration and login
- [x] Test movie booking flow
- [x] Test payment with Stripe test cards
- [x] Test quiz feature
- [x] Custom domain configured (optional)
- [x] Analytics enabled (Vercel Analytics already integrated)

---

## 🌐 Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Vercel
5. SSL certificate is auto-generated

---

## 📞 Support Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Prisma Documentation:** https://www.prisma.io/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Project Repository:** https://github.com/Sandeshhegde10/movie-booking-site

---

## ✨ Success!

Once deployed successfully, your LUMIÈRE Cinema app will be live at:
- **Production URL:** `https://your-app-name.vercel.app`
- **Preview URLs:** Auto-generated for each branch/PR

**Next Steps:**
1. Share your app with users
2. Monitor analytics in Vercel Dashboard
3. Collect feedback and iterate
4. Add more movies to the database
5. Customize branding and features

---

**Generated:** December 30, 2025  
**Project:** LUMIÈRE Cinema Movie Booking Site  
**Deployment Platform:** Vercel
