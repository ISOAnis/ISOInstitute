# Waitlist Database Setup Guide

The waitlist form is now configured to save data to a Supabase database. Follow these steps to set it up:

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

## Step 2: Create the Waitlist Table

1. In your Supabase dashboard, go to **SQL Editor**
2. Run this SQL to create the `waitlist` table:

```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);

-- Enable Row Level Security (optional, for production)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows inserts (for public waitlist submissions)
CREATE POLICY "Allow public inserts" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

## Step 3: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your:
   - **Project URL** (this is your `VITE_SUPABASE_URL`)
   - **anon/public key** (this is your `VITE_SUPABASE_ANON_KEY`)

## Step 4: Configure Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add these variables:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Restart Your Dev Server

After adding the environment variables, restart your development server:

```bash
npm run dev
```

## Testing

1. Open your app and click "Join the Waitlist"
2. Fill out the form and submit
3. Check your Supabase dashboard → **Table Editor** → **waitlist** to see the entry

## Notes

- The code will gracefully fall back to console logging if Supabase is not configured
- All waitlist entries will be saved with a timestamp
- Email addresses are indexed for faster lookups
- Phone numbers are optional

## Viewing Your Data

You can view all waitlist entries in the Supabase dashboard:
1. Go to **Table Editor**
2. Select the `waitlist` table
3. You'll see all submissions with full name, email, phone, and timestamp

