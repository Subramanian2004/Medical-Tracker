# MedsTracker - Complete Setup Guide

This guide will walk you through setting up the MedsTracker application from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Environment Variables](#environment-variables)
5. [Running the Application](#running-the-application)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
  - Check: `node --version`
  - Download from: https://nodejs.org/

- **npm**: Usually comes with Node.js
  - Check: `npm --version`

- **Git**: For version control
  - Check: `git --version`
  - Download from: https://git-scm.com/

## Local Development Setup

### Step 1: Get the Code

```bash
# If you have the code
cd meds-tracker-app

# If cloning from Git
git clone <repository-url>
cd meds-tracker-app
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React, React DOM, React Router
- TypeScript
- Tailwind CSS
- Supabase client
- Form handling libraries
- And more...

### Step 3: Verify Installation

```bash
npm run dev
```

You should see output like:
```
VITE v5.0.11  ready in XXX ms

➜  Local:   http://localhost:3000/
```

Press `Ctrl+C` to stop the server (we'll configure Supabase first).

## Supabase Configuration

### Step 1: Create a Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub (recommended) or email
4. Click "New Project"
5. Fill in:
   - **Name**: MedsTracker (or any name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

### Step 2: Get API Credentials

1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Click **API** in the sidebar
3. You'll see:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon public key**: Copy this (long string starting with `eyJ...`)

### Step 3: Set Up Database

1. In Supabase dashboard, click **SQL Editor** in the sidebar
2. Click **New query**
3. Open the `supabase-schema.sql` file from the project
4. Copy all the SQL code
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

This creates:
- `users` table (with caretaker email)
- `medications` table (medication details)
- `medication_logs` table (tracking when taken)
- All necessary security policies
- Indexes for performance

### Step 4: Verify Database Setup

1. Click **Table Editor** in Supabase sidebar
2. You should see three tables:
   - users
   - medications
   - medication_logs

### Step 5: Configure Email (Optional but Recommended)

For password reset and notifications:

1. Go to **Authentication** > **Providers** in Supabase
2. Enable Email provider if not already enabled
3. For custom emails, go to **Authentication** > **Email Templates**
4. Customize the templates as needed

## Environment Variables

### Step 1: Create .env File

```bash
# In the project root directory
cp .env.example .env
```

Or create a new file named `.env` manually.

### Step 2: Add Your Credentials

Edit the `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace:**
- `your-project-id.supabase.co` with your actual Project URL
- `your-anon-key-here` with your actual anon key

**Important:** 
- Never commit `.env` to Git
- The `.env` file is already in `.gitignore`

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will open at: http://localhost:3000

### Production Build

To create an optimized build:

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Deploy to Vercel (Recommended)

1. **Prepare Your Code**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite settings

3. **Add Environment Variables**
   - In Vercel project settings
   - Go to "Environment Variables"
   - Add:
     - `VITE_SUPABASE_URL` = Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app will be live at `your-app.vercel.app`

### Deploy to Netlify

1. **Build Locally First**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to https://netlify.com
   - Drag and drop the `dist/` folder
   OR
   - Connect your Git repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Add Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add the same variables as Vercel

## Troubleshooting

### Common Issues

#### 1. "Missing Supabase environment variables"

**Problem**: The `.env` file is not configured or not being read.

**Solution**:
```bash
# Make sure .env exists
ls -la .env

# Verify it contains:
cat .env

# Restart the dev server
npm run dev
```

#### 2. "Failed to fetch medications" or Authentication Errors

**Problem**: Database schema not set up or RLS policies blocking access.

**Solution**:
1. Go to Supabase SQL Editor
2. Run the schema SQL again
3. Check Table Editor to verify tables exist
4. Try signing up with a new account

#### 3. CORS Errors

**Problem**: Supabase URL is incorrect.

**Solution**:
1. Verify your Supabase URL in `.env`
2. Should look like: `https://xxxxx.supabase.co`
3. No trailing slash
4. Restart dev server

#### 4. TypeScript Errors

**Problem**: Type definitions not found.

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 5. Build Fails

**Problem**: Missing dependencies or TypeScript errors.

**Solution**:
```bash
# Check for TypeScript errors
npm run lint

# Fix any errors shown
# Then rebuild
npm run build
```

### Getting Help

If you encounter issues:

1. **Check Browser Console**: Press F12 and look for errors
2. **Check Supabase Logs**: In your Supabase dashboard
3. **Verify Database**: Use Table Editor to check data
4. **Check Network Tab**: See if API calls are failing

### Debug Mode

To see more detailed logs:

```javascript
// In src/lib/supabase.ts, temporarily add:
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    debug: true // Add this line
  }
});
```

## Next Steps

Once everything is running:

1. **Create an Account**: Use the Sign Up page
2. **Add Caretaker Email**: Optional but enables notifications
3. **Add Medications**: Switch to Caretaker view
4. **Test Patient View**: Mark medications as taken
5. **Check Statistics**: View the dashboard stats

## Additional Configuration

### Custom Domain (Vercel)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Email Notifications

To enable automatic email alerts:

1. Set up Supabase Edge Function
2. Use the `check_overdue_medications()` function
3. Schedule it to run every hour
4. Configure SMTP in Supabase

See: https://supabase.com/docs/guides/functions

---

**Congratulations!** 🎉 

Your MedsTracker application is now set up and ready to use!
