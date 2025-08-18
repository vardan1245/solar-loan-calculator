# 🔐 Authentication System Setup

This document explains how to set up and use the Supabase authentication system for the Tiamat Solar CRM.

## 🚀 Overview

The application now includes a complete authentication system that:
- Protects all pages and data behind a login wall
- Uses Supabase Auth for secure user management
- Provides user registration, login, and password reset
- Automatically redirects unauthenticated users to the login page

## 📋 Prerequisites

1. **Supabase Project**: You need a Supabase project with authentication enabled
2. **Environment Variables**: Supabase URL and anon key configured
3. **Email Provider**: Configured email provider in Supabase for user verification

## ⚙️ Configuration

### 1. Supabase Setup

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Configure your email provider (SMTP or use Supabase's built-in email service)
4. Enable email confirmations if desired

### 2. Environment Variables

Update the following in `auth.js`:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
```

### 3. Database Policies

Ensure your Supabase tables have proper Row Level Security (RLS) policies:

```sql
-- Example: Allow authenticated users to read data
CREATE POLICY "Users can read their own data" ON your_table
    FOR SELECT USING (auth.uid() = user_id);

-- Example: Allow authenticated users to insert data
CREATE POLICY "Users can insert data" ON your_table
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

## 👥 User Management

### Creating Test Users

1. **Via Supabase Dashboard**:
   - Go to **Authentication** → **Users**
   - Click **Add User**
   - Enter email and password

2. **Via API** (for development):
   - Use the signup form on the login page
   - Or run the `create-test-user.js` script

### Default Test User

For development, you can create a test user:
- **Email**: `test@tiamat.com`
- **Password**: `test123456`

## 🔧 File Structure

```
├── auth.js              # Authentication module
├── login.html           # Login/signup page
├── login.js             # Login page logic
├── index.html           # Main app (protected)
├── server.js            # Server with auth routes
└── create-test-user.js  # Test user creation script
```

## 🚀 Usage

### 1. Starting the Application

```bash
# Start the server
node server.js

# Or use the start script
npm start
```

### 2. Accessing the Application

1. **First Visit**: Users are redirected to `/login`
2. **Login**: Users enter credentials
3. **Success**: Users are redirected to the main app
4. **Session**: Users stay logged in until they sign out

### 3. Authentication Flow

```
User visits app → Check auth status → 
├─ Authenticated → Show main app
└─ Not authenticated → Redirect to login → 
   ├─ Login success → Redirect to main app
   └─ Login failed → Show error message
```

## 🛡️ Security Features

### 1. Route Protection

- All routes except `/login` require authentication
- Unauthenticated users see only the login page
- Session persistence across browser sessions

### 2. Data Protection

- API endpoints can check authentication status
- Database queries respect RLS policies
- Sensitive data hidden from unauthenticated users

### 3. Session Management

- Automatic session refresh
- Secure token storage
- Automatic logout on session expiry

## 🔍 Troubleshooting

### Common Issues

1. **"Cannot access Supabase"**
   - Check your Supabase URL and anon key
   - Verify your project is active

2. **"Email not confirmed"**
   - Check spam folder
   - Verify email provider configuration
   - Check Supabase email settings

3. **"Authentication failed"**
   - Verify user exists in Supabase
   - Check password requirements
   - Ensure user account is active

### Debug Mode

Enable debug logging by adding to `auth.js`:

```javascript
// Add this line for debugging
console.log('Auth state change:', event, session);
```

## 📱 User Experience

### Login Page Features

- ✅ Clean, modern design
- ✅ Email/password authentication
- ✅ User registration
- ✅ Password reset
- ✅ Remember me functionality
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling

### Main App Features

- ✅ User info display
- ✅ Sign out button
- ✅ Session persistence
- ✅ Automatic redirects
- ✅ Protected content

## 🔄 Future Enhancements

1. **Social Login**: Google, Facebook, etc.
2. **Two-Factor Authentication**: SMS/email codes
3. **Role-Based Access**: Different permission levels
4. **Session Management**: Multiple device handling
5. **Audit Logging**: Track user actions

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify Supabase project configuration
3. Check network requests in DevTools
4. Review Supabase logs in dashboard

## 🎯 Quick Start

1. **Setup Supabase**: Configure authentication
2. **Update Config**: Set your project URL and key
3. **Create User**: Add a test user
4. **Start Server**: Run `node server.js`
5. **Test Login**: Visit `/login` and authenticate
6. **Access App**: Use the main application

---

**Note**: This authentication system is designed for production use but should be thoroughly tested in your specific environment before deployment.
