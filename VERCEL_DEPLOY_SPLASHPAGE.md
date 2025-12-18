# How to Deploy SplashPage Branch on Vercel (When Settings Don't Show Production Branch)

## Method 1: Create New Deployment from SplashPage Branch

1. Go to your **Deployments** tab in Vercel
2. Click **"Create Deployment"** button (usually top right)
3. In the deployment dialog:
   - **Branch**: Select `SplashPage` from dropdown
   - **Framework Preset**: Should auto-detect Vite
   - **Root Directory**: Leave as `.` (or blank)
4. Click **"Deploy"**
5. This will create a deployment from SplashPage branch

## Method 2: Cancel Current Project and Re-import

If Method 1 doesn't work:

1. Go to **Settings** → **General**
2. Scroll to bottom and click **"Delete Project"** (or just create a new project)
3. Go back to Vercel dashboard
4. Click **"Add New"** → **"Project"**
5. Import your repository again
6. **Before clicking Deploy**, look for:
   - **"Configure Project"** button, OR
   - **"Settings"** or **"Advanced"** options
7. Find **"Production Branch"** or **"Git Branch"** setting
8. Change to `SplashPage`
9. Then click **Deploy**

## Method 3: Check Git Settings Location

The Production Branch might be in a different location:

1. **Settings** → **Git** → Look for "Production Branch" dropdown
2. **Settings** → **General** → Scroll down to "Git" section
3. **Settings** → **Deployments** → Look for branch settings
4. When creating deployment, look for branch selector before deploying

## Method 4: Use Vercel CLI (Advanced)

If the UI doesn't work, you can use command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Deploy from SplashPage branch
git checkout SplashPage
vercel --prod
```

## Quick Check: What Do You See?

In your Vercel project Settings, what sections do you see?
- General
- Git
- Environment Variables
- Domains
- Functions
- Analytics
- etc.

Let me know what you see and I can guide you to the exact location!

## Alternative: Deploy Specific Branch as Preview

Even if you can't change production branch, you can:

1. Go to **Deployments**
2. Click **"Create Deployment"**
3. Select branch: `SplashPage`
4. Deploy it (this creates a preview deployment)
5. Then you can **promote it to production** by clicking the three dots → "Promote to Production"

This effectively makes SplashPage your production branch!

