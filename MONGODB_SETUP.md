# 🍃 MongoDB Setup Guide for LUMIÈRE Cinema

## 🎯 Quick Setup (5 Minutes)

Your app is now configured to use **MongoDB** instead of PostgreSQL/SQLite. This is much simpler for deployment!

---

## 📋 Step 1: Create Free MongoDB Atlas Account

1. **Go to MongoDB Atlas:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for a **FREE account** (no credit card required)

2. **Create a Cluster:**
   - After sign-up, click **"Create a Deployment"**
   - Choose **M0 FREE tier** (512 MB storage - perfect for this app)
   - Select a region close to you (e.g., Mumbai, Singapore)
   - Click **"Create Deployment"**

---

## 🔐 Step 2: Set Up Database Access

1. **Create Database User:**
   - You'll see a popup "Security Quickstart"
   - **Username:** Choose a username (e.g., `cinema_admin`)
   - **Password:** Choose a strong password (or use auto-generate)
   - **IMPORTANT:** Copy this password somewhere safe!
   - Click **"Create Database User"**

2. **Add Network Access:**
   - Click **"Add entries to your IP Access List"**
   - Click **"Allow Access from Anywhere"** 
   - This adds `0.0.0.0/0` (allows Vercel to connect)
   - Click **"Finish and Close"**

---

## 🔗 Step 3: Get Your Connection String

1. **Click "Connect":**
   - On your cluster dashboard, click **"Connect"** button
   - Choose **"Drivers"**
   - Select **Node.js** and version **5.5 or later**

2. **Copy Connection String:**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

3. **Replace Placeholders:**
   - Replace `<username>` with your database username
   - Replace `<password>` with your password (the one you copied)
   - Add database name: `&appName=cinema-app`
   
   **Final format:**
   ```
   mongodb+srv://cinema_admin:YourPassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=cinema-app
   ```

---

## 💻 Step 4: Local Setup

1. **Update your `.env` file:**
   ```env
   DATABASE_URL="mongodb+srv://cinema_admin:YourPassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=cinema-app"
   ```

2. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

3. **Push Schema to MongoDB:**
   ```bash
   npx prisma db push
   ```

4. **Seed the Database (Optional - movies load from static data now):**
   ```bash
   npm run seed
   ```

5. **Test Locally:**
   ```bash
   npm run dev
   ```
   Visit: http://localhost:3000

---

## 🚀 Step 5: Deploy to Vercel

1. **Add Environment Variable in Vercel:**
   - Go to: https://vercel.com/dashboard
   - Select your project
   - Go to **Settings** → **Environment Variables**
   - Add:
     - **Key:** `DATABASE_URL`
     - **Value:** Your MongoDB connection string (from Step 3)
     - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

2. **Redeploy:**
   - Option A: Push to GitHub (auto-deploys)
     ```bash
     git add .
     git commit -m "Switched to MongoDB"
     git push origin main
     ```
   
   - Option B: Manual redeploy in Vercel dashboard
     - Go to **Deployments**
     - Click **"Redeploy"** on the latest deployment

3. **Done!** 🎉
   - Your movies will now show on the deployed site
   - Database is ready for bookings and user data

---

## ✅ Current Status

Your app is now using:
- ✅ **MongoDB** for database (simpler than PostgreSQL)
- ✅ **Static movie data** loaded directly (movies show without database)
- ✅ **Database ready** for user bookings and authentication

**Movies will show immediately** because they load from static data, but you can optionally seed the database to have movies stored there too.

---

## 🔧 Commands Reference

| Command | Purpose |
|---------|---------|
| `npx prisma generate` | Generate Prisma Client after schema changes |
| `npx prisma db push` | Push schema to MongoDB (creates collections) |
| `npx prisma studio` | Open database GUI to view data |
| `npm run seed` | Seed database with movie data (optional) |

---

## 🐛 Troubleshooting

### ❌ Error: "MongoServerError: bad auth"
**Cause:** Wrong username or password in connection string

**Fix:** 
- Double-check username and password in `.env`
- Make sure password has no special characters (or URL-encode them)
- Make sure you created a database user in Atlas

### ❌ Error: "MongooseServerSelectionError: Could not connect"
**Cause:** IP not whitelisted or wrong connection string

**Fix:**
- In MongoDB Atlas: Network Access → Add IP Address → Allow from Anywhere (`0.0.0.0/0`)
- Check connection string format is correct

### ❌ Error: "PrismaClientInitializationError"
**Cause:** Prisma Client not generated after schema change

**Fix:**
```bash
npx prisma generate
npm run dev
```

---

## 📊 MongoDB Atlas Dashboard

Access your data:
1. Go to: https://cloud.mongodb.com
2. Click **"Browse Collections"**
3. See your movies, users, bookings

---

## 💡 Why MongoDB?

✅ **Pros:**
- Free tier with 512MB storage
- Works perfectly with Vercel
- No complex setup like PostgreSQL
- Built-in for JSON data
- Easy to scale

❌ **Cons:**
- None for this use case! Perfect choice.

---

## 🎬 What's Next?

1. ✅ Movies are showing (from static data)
2. ✅ MongoDB is configured
3. 🔄 Deploy to Vercel
4. 🎉 Users can book movies!

---

**Last Updated:** December 30, 2025  
**Database:** MongoDB Atlas (Free Tier)  
**ORM:** Prisma  
**Deployment:** Vercel
