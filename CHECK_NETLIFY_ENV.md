# How to Check and Fix Environment Variables in Netlify

## Step 1: Verify Environment Variables Are Set

1. Go to your Netlify site dashboard
2. Click **"Site configuration"** (or **"Site settings"**)
3. Click **"Environment variables"** in the left sidebar
4. You should see:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Step 2: If They're Missing, Add Them

1. Click **"Add variable"**
2. Add Variable 1:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://xjpgdknztanempzygjfa.supabase.co`
   - **Scopes**: ✅ Production, ✅ Deploy previews, ✅ Branch deploys
3. Click **"Add variable"** again
4. Add Variable 2:
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcGdka256dGFuZW1wenlnamZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODQyOTksImV4cCI6MjA4MTY2MDI5OX0.k8PpUvpLc9QhxQMyRiLQlU9dRl4mitDq0SWrohCbPvs`
   - **Scopes**: ✅ Production, ✅ Deploy previews, ✅ Branch deploys
5. Click **"Save"**

## Step 3: Redeploy After Adding Variables

**IMPORTANT:** After adding/changing environment variables, you MUST redeploy:

1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for it to finish

## Step 4: Test Again

1. Visit your live site
2. Open browser console (F12)
3. Click "Join the Waitlist" and submit
4. Check console - should NOT see "Supabase not configured"
5. Check Supabase dashboard → waitlist table

## Common Issues:

- **Variables added but not working?** → You need to redeploy after adding them
- **Still seeing "Supabase not configured"?** → Check that variable names are exactly correct (case-sensitive)
- **Variables not showing in list?** → Make sure you clicked "Save" after adding them

