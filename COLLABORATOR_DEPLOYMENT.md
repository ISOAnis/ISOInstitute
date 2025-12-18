# Deployment Options for Collaborators

## Your Situation:
- Repository owner: ISOAnis
- You're a collaborator
- You need to deploy the `SplashPage` branch

## Option 1: Ask ISOAnis to Set It Up (Easiest)

**Have ISOAnis (the repo owner) do the deployment setup:**

1. ISOAnis should:
   - Go to Netlify/Vercel
   - Import the repository
   - Set branch to `SplashPage`
   - Add environment variables
   - Deploy

2. Then they can:
   - Add you as a collaborator on the Netlify/Vercel project
   - You'll be able to see deployments and manage them

**This is the cleanest solution** - one deployment, everyone can manage it.

---

## Option 2: Fork the Repository (If you need your own deployment)

If you need your own deployment separate from ISOAnis:

1. **Fork the repository:**
   - Go to the GitHub repo
   - Click "Fork" (top right)
   - This creates your own copy

2. **Deploy your fork:**
   - Connect your forked repo to Netlify/Vercel
   - Deploy from `SplashPage` branch
   - Add environment variables

3. **Keep it in sync:**
   - You can pull updates from the original repo
   - Your deployment is independent

**Note:** This creates a separate deployment, so you'd have your own domain/URL.

---

## Option 3: Deploy from Your Local Branch (Temporary)

If you just need to test or show it quickly:

1. **Push your SplashPage branch to your own GitHub repo** (if you have one)
2. **Deploy that repo** to Netlify/Vercel
3. This gives you a working deployment to test

---

## Option 4: Use Netlify/Vercel CLI (If you have access)

If you have deployment access but can't change settings in UI:

1. Install CLI: `npm i -g vercel` or `npm i -g netlify-cli`
2. Login: `vercel login` or `netlify login`
3. Link project: `vercel link` or `netlify link`
4. Deploy: `vercel --prod` or `netlify deploy --prod`
5. Make sure you're on SplashPage branch: `git checkout SplashPage`

---

## Recommended Solution:

**Ask ISOAnis to:**
1. Set up the Netlify/Vercel deployment
2. Configure it to use `SplashPage` branch
3. Add you as a collaborator on the deployment platform
4. Add the environment variables

This way:
- ✅ One deployment for the team
- ✅ Everyone can manage it
- ✅ No duplicate deployments
- ✅ Clean and organized

---

## What to Tell ISOAnis:

"Hey, can you set up the Netlify/Vercel deployment for the splash page? We need it to deploy from the `SplashPage` branch and add these environment variables for Supabase. Then add me as a collaborator so I can help manage it."

Send them the `NETLIFY_SETUP.md` or `PRODUCTION_ENV_SETUP.md` guide!

