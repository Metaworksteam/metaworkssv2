# ✅ Vercel Deployment Checklist for MetaWorks

## Quick Deployment Steps

### 1️⃣ Push to GitHub (5 minutes)
```bash
# If you haven't already
git init
git add .
git commit -m "Ready for Vercel deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/metaworks.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy on Vercel (10 minutes)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Click**: "Add New Project" → "Import Project"
4. **Select** your GitHub repository
5. **Configure Project**:
   - Framework Preset: **Other**
   - Root Directory: **Leave as `.`**
   - Build Command: **`npm run build`**
   - Output Directory: **Leave as default**
   - Install Command: **`npm install`**

6. **Click "Deploy"** (don't add environment variables yet)

### 3️⃣ Set Up Environment Variables (5 minutes)

After initial deployment, go to **Project Settings → Environment Variables**:

#### 🔴 REQUIRED Variables:

**Database (PostgreSQL)**:
```
DATABASE_URL=your-neon-postgres-connection-string
PGHOST=your-pg-host
PGDATABASE=your-database-name
PGUSER=your-database-user
PGPASSWORD=your-database-password
PGPORT=5432
```

#### 🟡 OPTIONAL Variables (for full features):

**Authentication (if using Clerk)**:
```
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**AI Features (if using)**:
```
OPENAI_API_KEY=sk-...
DID_API_KEY=your-did-api-key
```

**Important**: Add ALL variables to:
- ✅ Production
- ✅ Preview  
- ✅ Development

### 4️⃣ Database Setup (2 minutes)

#### Option A: Use Existing Neon Database
Copy your current `DATABASE_URL` from Replit to Vercel

#### Option B: Create New Production Database
1. Go to https://neon.tech
2. Create new project
3. Copy connection string
4. Add to Vercel environment variables

### 5️⃣ Redeploy (1 minute)

After adding environment variables:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait 1-2 minutes
4. Your app is live! 🎉

### 6️⃣ Push Database Schema (2 minutes)

After successful deployment, run locally:
```bash
npm run db:push
```

This creates all necessary database tables in your production database.

---

## 🎯 Your Live URLs

- **Production**: `https://your-project.vercel.app`
- **Custom Domain** (optional): Set up in Vercel → Settings → Domains

---

## 🚨 Troubleshooting

### Build Fails?
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify TypeScript compiles: run `npm run check` locally

### Can't Connect to Database?
- Verify DATABASE_URL is correct
- Check Neon database allows connections
- Ensure all PG variables are set

### API Routes Don't Work?
- Verify routes start with `/api/`
- Check function logs in Vercel dashboard
- Ensure environment variables are set for Production

### 404 on Routes?
- The vercel.json is configured for SPA routing
- All frontend routes should work automatically
- If not, check vercel.json routing configuration

---

## 🔄 Automatic Deployments

Once connected to GitHub:
- **Push to main branch** → Auto-deploys to production
- **Push to other branches** → Creates preview deployments
- **Pull requests** → Automatic preview URLs

---

## 📊 Monitoring

- **Logs**: Vercel Dashboard → Project → Deployments → View Function Logs
- **Analytics**: Enable in Project Settings
- **Performance**: Check Web Vitals in Vercel dashboard

---

## 🎉 Done!

Your MetaWorks platform is now live on Vercel with:
- ✅ Automatic deployments on Git push
- ✅ Serverless backend with Express
- ✅ Fast global CDN for frontend
- ✅ PostgreSQL database (Neon)
- ✅ HTTPS by default
- ✅ Preview deployments for testing

**Next Steps**:
1. Test all features on production URL
2. Set up custom domain (optional)
3. Enable Vercel Analytics
4. Share your live app! 🚀
git add .
git commit -m "Ready for deployment"
