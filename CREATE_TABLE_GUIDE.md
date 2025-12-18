# Step-by-Step Guide: Creating the Waitlist Table in Supabase

## Step 1: Log into Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Sign In** (or **Start your project** if you don't have an account)
3. Log in with your account

## Step 2: Select Your Project

1. After logging in, you'll see your dashboard
2. Click on your project (or create a new one if you haven't yet)
3. Wait for the project to load

## Step 3: Open the SQL Editor

1. In the left sidebar, look for **SQL Editor**
2. Click on **SQL Editor**
3. You should see a blank SQL editor window

## Step 4: Copy and Paste the SQL Code

1. Copy this entire SQL code block:

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

2. Paste it into the SQL Editor window

## Step 5: Run the SQL

1. Click the **RUN** button (usually at the bottom right of the SQL editor, or press `Ctrl+Enter` / `Cmd+Enter`)
2. You should see a success message like "Success. No rows returned"

## Step 6: Verify the Table Was Created

1. In the left sidebar, click on **Table Editor**
2. You should now see a **waitlist** table in the list
3. Click on **waitlist** to see the table structure
4. You should see columns:
   - `id` (uuid)
   - `full_name` (text)
   - `email` (text)
   - `phone` (text)
   - `created_at` (timestamp)

## ✅ Success!

If you can see the `waitlist` table in the Table Editor, you're done! The table is ready to receive data.

## Troubleshooting

### If you get an error about "policy already exists":
- The policy might already be created. You can ignore this error or remove that line from the SQL

### If you get an error about "table already exists":
- The table might already exist. You can either:
  - Delete the existing table and run the SQL again, OR
  - Skip the CREATE TABLE line and just run the rest

### If you don't see the SQL Editor:
- Make sure you're logged into Supabase
- Make sure you've selected a project
- The SQL Editor should be in the left sidebar menu

### If the RUN button is grayed out:
- Make sure you've pasted the SQL code into the editor
- Try clicking inside the editor first

## Next Steps

After creating the table:
1. Get your Supabase credentials (see Step 3 in WAITLIST_SETUP.md)
2. Create a `.env` file with your credentials
3. Restart your dev server
4. Test the waitlist form!

