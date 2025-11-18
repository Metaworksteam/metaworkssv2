# MetaWorks Deployment Guide - Vercel

## Prerequisites
- GitHub account
- Vercel account (free) - https://vercel.com
- Your code pushed to GitHub

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Step 2: Set Up Vercel Deployment

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure your project:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Option B: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

## Step 3: Configure Environment Variables

In Vercel Dashboard, go to **Settings → Environment Variables** and add:

### Required Environment Variables:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `PGHOST` - PostgreSQL host
- `PGDATABASE` - Database name
- `PGUSER` - Database user
- `PGPASSWORD` - Database password
- `PGPORT` - Database port (usually 5432)

### Optional (if using):
- `CLERK_PUBLISHABLE_KEY` - For Clerk authentication
- `CLERK_SECRET_KEY` - For Clerk authentication
- `OPENAI_API_KEY` - For AI features
- `DID_API_KEY` - For D-ID virtual agent

**Important**: Add these variables for:
- Production
- Preview
- Development

## Step 4: Database Setup for Vercel

Your app uses **Neon PostgreSQL** which is perfect for serverless deployments!

### Option 1: Use Your Existing Neon Database
Copy your current `DATABASE_URL` to Vercel environment variables

### Option 2: Create a New Neon Database for Production
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string
4. Add it to Vercel environment variables as `DATABASE_URL`

### Run Database Migrations
After first deployment, you may need to run:
```bash
npm run db:push
```

## Step 5: Deploy

Once configured, Vercel will automatically:
1. Build your project when you push to GitHub
2. Deploy the frontend (React + Vite)
3. Deploy the backend as serverless functions
4. Assign you a URL: `https://your-project.vercel.app`

## Important Notes

### Serverless Considerations
- Express runs as **serverless functions** on Vercel
- Functions have a 10-second timeout (Hobby plan)
- Database connections use connection pooling (already configured with Neon)

### CORS Configuration
Your app is configured to serve both frontend and backend from the same domain, so no CORS issues!

### Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Monitoring Your Deployment

### Real-time Logs
- Go to Vercel Dashboard → Your Project → Deployments
- Click on any deployment to see logs

### Analytics
- Enable Vercel Analytics in your project settings

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript types compile correctly

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Ensure Neon database allows connections from Vercel IPs
- Check that connection pooling is enabled

### API Routes Don't Work
- Verify routes start with `/api/`
- Check serverless function logs in Vercel Dashboard

## Automatic Deployments

Once connected to GitHub:
- **Push to main** → Deploys to production
- **Push to other branches** → Creates preview deployments
- **Pull requests** → Automatic preview URLs

## Your App URL
After deployment: `https://metaworks.vercel.app` (or your custom domain)

## Support
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
