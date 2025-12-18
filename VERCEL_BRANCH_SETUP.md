# How to Deploy SplashPage Branch on Vercel

## Change Production Branch to SplashPage

### Method 1: During Initial Setup (If you haven't deployed yet)

1. When importing your repository, look for **"Configure Project"** or **"Settings"** before deploying
2. Find **"Production Branch"** or **"Git"** settings
3. Change from `main` to `SplashPage`
4. Then click **Deploy**

### Method 2: Change After Deployment (If already deployed)

1. Go to your project on Vercel dashboard
2. Click on **Settings** (top navigation)
3. Go to **Git** section (left sidebar)
4. Find **"Production Branch"** setting
5. Change from `main` to `SplashPage`
6. Click **Save**
7. Go to **Deployments** tab
8. Click **Redeploy** on the latest deployment (or it will auto-redeploy)

### Method 3: Deploy Specific Branch Directly

1. Go to **Deployments** tab
2. Click **"Create Deployment"** button (top right)
3. Select **Branch**: `SplashPage`
4. Click **Deploy**

---

## Quick Steps Summary:

**If you see the deployment failed:**
1. Go to **Settings** → **Git**
2. Change **Production Branch** to `SplashPage`
3. Go to **Deployments**
4. Click **Redeploy** or create a new deployment from `SplashPage` branch

---

## Verify It's Using SplashPage:

After deploying, check:
- The deployment should show branch: `SplashPage` in the deployment details
- Your splash page should appear (not the full site)

---

## Note:

If you want to keep main as production but deploy SplashPage for now:
- You can create a separate deployment from the SplashPage branch
- Or temporarily change the production branch to SplashPage
- Later, you can switch it back to main when ready

