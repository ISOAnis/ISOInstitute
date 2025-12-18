# How to Test if Your Database is Working

## Method 1: Test Through the Website (Easiest)

1. **Make sure your dev server is running:**
   ```bash
   npm run dev
   ```

2. **Open your website** in a browser (usually `http://localhost:5173`)

3. **Click "Join the Waitlist"** button

4. **Fill out the form:**
   - Enter a test name (e.g., "Test User")
   - Enter a test email (e.g., "test@example.com")
   - Optionally add a phone number
   - Click "Join Waitlist"

5. **Check the browser console:**
   - Press `F12` or right-click → "Inspect"
   - Go to the "Console" tab
   - Look for messages:
     - ✅ **If Supabase is configured:** You should see no errors, and the form should show "You're on the list"
     - ⚠️ **If Supabase is NOT configured:** You'll see a warning: "Supabase not configured. Logging to console instead:" followed by your data

6. **Check Supabase Dashboard:**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to **Table Editor** → **waitlist** table
   - You should see your test entry with:
     - Full name
     - Email
     - Phone (if provided)
     - Created timestamp

## Method 2: Check Browser Console for Errors

1. Open your website
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Try submitting the waitlist form
5. Look for:
   - **Red errors** = Something is wrong
   - **Yellow warnings** = Supabase not configured (but form still works)
   - **No errors** = Everything is working!

## Method 3: Verify Environment Variables

1. **Check if `.env` file exists:**
   ```bash
   cat .env
   ```
   (or open `.env` in your editor)

2. **Make sure it contains:**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Restart your dev server** after adding/changing `.env`:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

## Method 4: Quick Database Check in Supabase

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Table Editor** in the left sidebar
4. Click on **waitlist** table
5. If you see entries, the database is working! 🎉

## Troubleshooting

### If you see "Supabase not configured" warning:
- Your `.env` file is missing or empty
- Follow the setup steps in `WAITLIST_SETUP.md`

### If you see database errors:
- Check that you've created the `waitlist` table in Supabase
- Verify your API credentials are correct
- Make sure Row Level Security policies allow inserts

### If the form submits but nothing appears in Supabase:
- Check the browser console for error messages
- Verify your Supabase project is active
- Make sure the table name is exactly `waitlist` (lowercase)

## Expected Behavior

✅ **Working correctly:**
- Form submits successfully
- Shows "You're on the list" message
- Entry appears in Supabase `waitlist` table
- No errors in browser console

⚠️ **Not configured (but form still works):**
- Form submits successfully
- Shows "You're on the list" message
- Warning in console: "Supabase not configured"
- Data logged to console instead of database

❌ **Error:**
- Form doesn't submit
- Error message appears
- Check console for specific error details

