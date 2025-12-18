# How to Fix "Invalid API key" Error in Netlify

## The Problem:
Netlify is saying "Invalid API key" when you try to add the environment variables.

## Common Causes:

1. **Extra spaces** - Copying might include leading/trailing spaces
2. **Missing characters** - Key got cut off during copy
3. **Key was regenerated** - Supabase keys might have been changed
4. **Wrong key type** - Using service_role key instead of anon key

## Solution: Get Fresh Keys from Supabase

### Step 1: Go to Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project (the one with URL: `xjpgdknztanempzygjfa.supabase.co`)

### Step 2: Get the Correct Keys
1. Click **"Settings"** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. You'll see two sections:

   **Project URL:**
   - Copy the **"Project URL"** (should be: `https://xjpgdknztanempzygjfa.supabase.co`)

   **API Keys:**
   - Find the **"anon"** or **"public"** key (NOT the service_role key!)
   - Click the eye icon to reveal it
   - Click the copy icon to copy it

### Step 3: Add to Netlify (Carefully)

**Variable 1:**
- **Key**: `VITE_SUPABASE_URL`
- **Value**: Paste the Project URL (should start with `https://`)
- Make sure NO spaces before or after

**Variable 2:**
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Paste the anon/public key (long string starting with `eyJ...`)
- Make sure NO spaces before or after
- Make sure you copied the ENTIRE key (it's very long)

### Step 4: Verify Format

The anon key should:
- Start with: `eyJ`
- Be very long (hundreds of characters)
- End with a long string
- Have NO line breaks or spaces

### Step 5: Save and Redeploy

1. Click **"Save"** in Netlify
2. Go to **"Deploys"** tab
3. Click **"Trigger deploy"** → **"Deploy site"**

## Quick Check:

If you're still getting "Invalid API key" error:
- Make sure you're using the **anon** key, NOT service_role
- Make sure there are NO spaces in the value field
- Try copying the key again from Supabase (it might have been regenerated)

