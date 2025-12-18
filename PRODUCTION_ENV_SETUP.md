# Setting Up Environment Variables for Production

## The Problem

When you deploy your website to a domain (Vercel, Netlify, etc.), the `.env` file doesn't get deployed for security reasons. You need to configure environment variables in your hosting platform.

## Solution: Add Environment Variables to Your Hosting Platform

### For Vercel:

1. Go to your project on [vercel.com](https://vercel.com)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add these two variables:

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://xjpgdknztanempzygjfa.supabase.co`
   - Environment: Select **Production**, **Preview**, and **Development**

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcGdka256dGFuZW1wenlnamZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODQyOTksImV4cCI6MjA4MTY2MDI5OX0.k8PpUvpLc9QhxQMyRiLQlU9dRl4mitDq0SWrohCbPvs`
   - Environment: Select **Production**, **Preview**, and **Development**

5. Click **Save**
6. **Redeploy your site** (go to Deployments → click the three dots on latest deployment → Redeploy)

### For Netlify:

1. Go to your site on [netlify.com](https://netlify.com)
2. Go to **Site configuration** → **Environment variables**
3. Click **Add variable**
4. Add:

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://xjpgdknztanempzygjfa.supabase.co`
   - Scopes: Select all (Production, Deploy previews, Branch deploys)

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcGdka256dGFuZW1wenlnamZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODQyOTksImV4cCI6MjA4MTY2MDI5OX0.k8PpUvpLc9QhxQMyRiLQlU9dRl4mitDq0SWrohCbPvs`
   - Scopes: Select all

5. Click **Save**
6. **Trigger a new deploy** (go to Deploys → Trigger deploy → Deploy site)

### For Other Platforms:

The process is similar:
1. Find **Environment Variables** or **Config Variables** in your hosting platform settings
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the values above
3. Redeploy/rebuild your site

## Important Notes:

- ⚠️ **The `.env` file only works locally** - it's not deployed to production
- ✅ **Environment variables must be set in your hosting platform**
- 🔄 **You must redeploy after adding environment variables**
- 🔒 **Never commit your `.env` file to git** (it's already in `.gitignore`)

## Your Current Values:

```
VITE_SUPABASE_URL=https://xjpgdknztanempzygjfa.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcGdka256dGFuZW1wenlnamZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODQyOTksImV4cCI6MjA4MTY2MDI5OX0.k8PpUvpLc9QhxQMyRiLQlU9dRl4mitDq0SWrohCbPvs
```

## Testing After Setup:

1. After adding variables and redeploying, test the waitlist form
2. Check the browser console (F12) - you should NOT see "Supabase not configured" warning
3. Submit a test entry and check your Supabase dashboard to confirm it was saved

## Troubleshooting:

- **Still not working?** Make sure you redeployed after adding the variables
- **Getting errors?** Check that the variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (case-sensitive)
- **Can't find the settings?** Look for "Environment Variables", "Config Vars", or "Secrets" in your hosting platform

