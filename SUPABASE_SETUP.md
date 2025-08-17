# 🔑 Supabase API Key Setup Guide

## 🚨 **Current Issue**
Your React app is getting a 401 Unauthorized error because the Supabase API key is invalid or missing.

## ✅ **Solution: Add Correct Environment Variables**

### **Step 1: Get Your Supabase API Keys**

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Sign in to your account
   - Select your project: `ylmcwkabyqvgdrbnunri`

2. **Navigate to API Settings:**
   - Click **"Settings"** in the left sidebar
   - Click **"API"** tab

3. **Copy These Values:**
   - **Project URL**: `https://ylmcwkabyqvgdrbnunri.supabase.co`
   - **anon public**: Copy the entire key (it's a long string)

### **Step 2: Update Your .env File**

Add these lines to your `.env` file:

```bash
# Supabase Frontend Authentication
VITE_SUPABASE_URL=https://ylmcwkabyqvgdrbnunri.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

**Important Notes:**
- ✅ **Must start with `VITE_`** (Vite requirement)
- ✅ **No spaces around `=`**
- ✅ **No quotes around values**
- ✅ **Copy the entire anon key** (it's very long)

### **Step 3: Restart Your Development Server**

After updating the `.env` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### **Step 4: Verify Configuration**

You should see this in your browser console:
```
🔐 Supabase configuration loaded:
   URL: https://ylmcwkabyqvgdrbnunri.supabase.co
   Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔍 **Example .env File**

Your `.env` file should look like this:

```bash
# Supabase Database Connection
DATABASE_URL=postgresql://postgres.ylmcwkabyqvgdrbnunri:Gordzara!12@aws-0-eu-north-1.pooler.supabase.com:6543/postgres

# Supabase Frontend Authentication
VITE_SUPABASE_URL=https://ylmcwkabyqvgdrbnunri.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsbWN3a2FieXF2Z2RyYm51bnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.ACTUAL_KEY_CONTINUES_HERE

PORT=3001
```

## 🧪 **Testing After Setup**

1. **Restart your dev server**
2. **Check browser console** for the Supabase configuration message
3. **Try logging in** with test credentials
4. **Create a test user** in Supabase dashboard if needed

## 🚨 **Common Issues**

### **"Missing VITE_SUPABASE_URL" Error**
- Check that your `.env` file has the correct variable names
- Ensure no spaces around the `=` sign

### **"Invalid API key format" Error**
- Make sure you copied the entire anon key
- It should be a very long string (100+ characters)

### **Still Getting 401 Errors**
- Verify the API key is correct in Supabase dashboard
- Check that you're using the **anon public** key, not the service role key
- Ensure your Supabase project is active and not paused

## 🎯 **Next Steps**

After setting up the environment variables:

1. **Test the login** with valid credentials
2. **Create test users** in Supabase dashboard
3. **Test the complete authentication flow**
4. **Customize the UI** as needed

---

**Need Help?** Check the browser console for specific error messages after updating your `.env` file.
