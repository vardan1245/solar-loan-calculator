# Tiamat Solar Calculator with React Authentication

A modern React-based Solar Loan Calculator with Supabase authentication.

## Features

- 🔐 **Secure Authentication**: Login, forgot password, and password reset
- 🎨 **Modern UI**: Built with React + Tailwind CSS
- 🚀 **Fast Development**: Vite build tool for rapid development
- 📱 **Responsive Design**: Works on all devices
- 🔒 **Protected Routes**: Dashboard access requires authentication

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Authentication**: Supabase
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run start` - Start the backend server
- `npm run server` - Start the backend server (alternative)

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.tsx       # Login form
│   ├── ForgotPassword.tsx  # Password reset request
│   ├── ResetPassword.tsx   # New password setup
│   ├── Dashboard.tsx   # Protected dashboard
│   └── Loading.tsx     # Loading spinner
├── lib/
│   └── supabaseClient.ts  # Supabase configuration
├── App.tsx             # Main app component
├── main.tsx            # React entry point
└── index.css           # Tailwind CSS imports
```

## Authentication Flow

1. **Login** (`/login`)
   - Email and password authentication
   - Redirects to `/dashboard` on success
   - Shows error messages on failure

2. **Forgot Password** (`/forgot-password`)
   - Email input for password reset
   - Sends reset link via Supabase
   - Shows confirmation message

3. **Reset Password** (`/reset-password`)
   - New password input (accessed via email link)
   - Password validation and confirmation
   - Redirects to login after success

4. **Dashboard** (`/dashboard`)
   - Protected route requiring authentication
   - Shows user information
   - Logout functionality

## Supabase Configuration

The project is configured to use the existing Supabase database:
- **URL**: `https://ylmcwkabyqvgdrbnunri.supabase.co`
- **Tables**: `profiles` table for user data

## Development

### Adding New Components

1. Create component in `src/components/`
2. Import and add to routing in `App.tsx`
3. Style with Tailwind CSS classes

### Styling

- Use Tailwind CSS utility classes
- Custom components defined in `src/index.css`
- Responsive design with Tailwind breakpoints

### State Management

- React hooks for local state
- Supabase for authentication state
- React Router for navigation state

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy

The built files will be in the `dist/` directory, ready for deployment to:
- Vercel
- Netlify
- Any static hosting service

## Backend Integration

The existing Node.js backend (`server.js`) continues to work alongside the React frontend:
- API endpoints remain at `localhost:3001`
- Database connections unchanged
- Can be extended to work with React frontend

## Support

For issues or questions:
1. Check the console for error messages
2. Verify Supabase connection
3. Ensure all dependencies are installed

---

**Note**: This React version replaces the previous vanilla HTML/JS implementation while maintaining all the core functionality and adding modern authentication features. 