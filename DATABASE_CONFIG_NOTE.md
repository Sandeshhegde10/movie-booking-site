# 📝 Important: Database Configuration Note

## 🔄 Current Setup

### **Local Development (Your Computer):**
- **Database:** SQLite (`prisma/dev.db`)
- **Provider:** `sqlite` in `prisma/schema.prisma`
- **Movies:** ✅ All 30+ movies are stored in the local SQLite file
- **Status:** Working correctly!

### **Production Deployment (Vercel):**
- **Database:** PostgreSQL (required for Vercel)
- **Provider:** Must change to `postgresql` in `prisma/schema.prisma` before deploying
- **Setup Required:** See `DEPLOYMENT_GUIDE.md`

---

## ⚠️ IMPORTANT: Before Deploying to Vercel

You need to **manually change** the database provider in `prisma/schema.prisma`:

### Current (Local Development):
```prisma
datasource db {
  provider = "sqlite"  // ← Current setting
  url      = env("DATABASE_URL")
}
```

### Change to (For Vercel Deployment):
```prisma
datasource db {
  provider = "postgresql"  // ← Change this for deployment
  url      = env("DATABASE_URL")
}
```

**Then commit and push before deploying.**

---

## 🎯 Why Two Different Databases?

1. **SQLite (Local):**
   - ✅ File-based, no setup needed
   - ✅ Perfect for development
   - ✅ All your movies are already here
   - ❌ Doesn't work on Vercel's serverless platform

2. **PostgreSQL (Production):**
   - ✅ Works on Vercel
   - ✅ Scalable for production
   - ⚠️ Requires setup (see DEPLOYMENT_GUIDE.md)
   - ⚠️ Needs separate database with own movie data

---

## 🔧 Workflow

### When developing locally:
```bash
# Keep it as SQLite
npm run dev  # Movies already loaded!
```

### When ready to deploy:
1. Change `provider = "sqlite"` to `provider = "postgresql"` in schema.prisma
2. Commit and push to GitHub
3. Set up PostgreSQL on Vercel (see DEPLOYMENT_GUIDE.md)
4. Add `DATABASE_URL` environment variable in Vercel
5. Deploy
6. Run `npx prisma db push` and `npx prisma db seed` on production

---

## 💡 Pro Tip: Environment-Based Configuration

You can also use an environment variable to switch automatically:

In `.env` file:
```env
# Local development (current)
DATABASE_URL="file:./dev.db"

# For Vercel (add in Vercel dashboard)
DATABASE_URL="postgresql://user:password@host/database"
```

---

## ✅ Current Status

Your local movies are **NOT GONE** - they're all still in `prisma/dev.db`!

Run your dev server and check:
```bash
npm run dev
# Visit: http://localhost:3000/movies
```

You should see all 30+ movies working perfectly! 🎬

---

**Last Updated:** December 30, 2025
