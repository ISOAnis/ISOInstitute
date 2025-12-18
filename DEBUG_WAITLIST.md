# Debugging: Why isn't my waitlist data showing up?

## Quick Checklist

### 1. Check Browser Console for Errors
1. Open your website
2. Press `F12` (or right-click → Inspect)
3. Go to the **Console** tab
4. Submit the waitlist form again
5. Look for messages:
   - ✅ **"Supabase not configured"** = Your `.env` file isn't set up correctly
   - ❌ **Red error messages** = There's a problem (copy the error)
   - ✅ **No errors** = Form submitted, but check Supabase

### 2. Verify Your .env File
Your `.env` file should be in: `/Users/idris/Desktop/ISOInstitute/.env`

It should look like this (with YOUR actual values):
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Common issues:**
- ❌ Still has `your_project_url_here` = Not filled in yet
- ❌ File doesn't exist = Need to create it
- ❌ Wrong location = Should be in project root

### 3. Did You Restart the Dev Server?
After creating/editing `.env`, you MUST restart:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### 4. Check Supabase Dashboard
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Table Editor** → **waitlist**
4. Do you see your entry?

### 5. Verify Table Exists
1. In Supabase dashboard → **Table Editor**
2. Do you see a `waitlist` table?
3. If not, you need to create it (see CREATE_TABLE_GUIDE.md)

## Common Problems & Solutions

### Problem: "Supabase not configured" in console
**Solution:** 
- Check your `.env` file has real values (not placeholders)
- Make sure you restarted the dev server after editing `.env`

### Problem: Error about "relation waitlist does not exist"
**Solution:**
- You haven't created the table yet
- Go to Supabase → SQL Editor → Run the CREATE TABLE SQL

### Problem: Error about "permission denied" or "RLS policy"
**Solution:**
- The Row Level Security policy might not be set up
- Run the full SQL script from WAITLIST_SETUP.md (including the policy)

### Problem: Form submits but nothing in Supabase
**Check:**
1. Browser console for errors
2. That your Supabase URL and key are correct
3. That the table name is exactly `waitlist` (lowercase)
4. That column names match: `full_name`, `email`, `phone`, `created_at`

## Step-by-Step Debug Process

1. **Open browser console** (F12)
2. **Submit the form** and watch the console
3. **Check what message appears:**
   - If you see a warning → `.env` not configured
   - If you see an error → Copy the error message
   - If you see nothing → Check Supabase dashboard

4. **Verify .env file:**
   ```bash
   cat .env
   ```
   Make sure it has real values, not placeholders

5. **Check Supabase:**
   - Table exists?
   - Data is there?
   - Credentials are correct?

## Still Not Working?

Share with me:
1. What you see in the browser console
2. Whether the `.env` file has real values or placeholders
3. Whether you see the `waitlist` table in Supabase
4. Any error messages you're getting

