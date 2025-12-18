# Netlify Setup Guide for SplashPage Branch

## Step 1: Sign Up / Login to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up or log in (you can use GitHub to sign in)

## Step 2: Import Your Repository

1. Click **"Add new site"** → **"Import an existing project"**
2. Click **"Deploy with GitHub"**
3. Authorize Netlify to access your GitHub
4. Select your repository: **ISOInstitute** (or whatever it's named)
5. Click **"Next"**

## Step 3: Configure Build Settings

**IMPORTANT:** Before clicking "Deploy", click **"Show advanced"** or **"Change settings"**

Configure these settings:

- **Branch to deploy**: `SplashPage` (change from `main`)
- **Build command**: `npm run build`
- **Publish directory**: `dist` (Vite's default output)

Then click **"Deploy site"**

## Step 4: Add Environment Variables

After deployment (even if it fails initially):

1. Go to **Site configuration** → **Environment variables**
2. Click **"Add variable"**
3. Add these two:

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://xjpgdknztanempzygjfa.supabase.co`
   - Scopes: ✅ Production, ✅ Deploy previews, ✅ Branch deploys

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcGdka256dGFuZW1wenlnamZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODQyOTksImV4cCI6MjA4MTY2MDI5OX0.k8PpUvpLc9QhxQMyRiLQlU9dRl4mitDq0SWrohCbPvs`
   - Scopes: ✅ Production, ✅ Deploy previews, ✅ Branch deploys

4. Click **"Save"**

## Step 5: Redeploy

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for it to finish

## Step 6: Set Custom Domain (Optional)

1. Go to **Site configuration** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain
4. Follow DNS setup instructions

---

## Troubleshooting

### If build fails:
- Check that branch is set to `SplashPage`
- Verify build command: `npm run build`
- Verify publish directory: `dist`

### If environment variables don't work:
- Make sure you redeployed after adding them
- Check that all scopes are selected (Production, Deploy previews, Branch deploys)

### To change branch later:
1. **Site configuration** → **Build & deploy** → **Continuous Deployment**
2. Change **"Production branch"** to `SplashPage`
3. Click **"Save"**
4. Trigger a new deploy

---

## Quick Reference:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Branch**: `SplashPage`
- **Framework**: Vite (auto-detected)

