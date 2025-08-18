import { createClient } from 'https://esm.sh/@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://ylmcwkabyqvgdrbnunri.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsbWN3a2FieXF2Z2RyYm51bnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NTI3MjMsImV4cCI6MjA2MjUyODcyM30.UrsOv_NmOJilHeQu9-brBI_1N7PYbOCYHsqc4cy6YqY'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication state
let currentUser = null
let authListener = null

// Initialize authentication
export async function initAuth() {
    // Check for existing session
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
        currentUser = session.user
        onAuthStateChange(true, session.user)
    } else {
        // No session - redirect to login if not already there
        if (window.location.pathname !== '/login') {
            window.location.href = '/login'
        }
    }

    // Listen for auth changes
    authListener = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            currentUser = session.user
            onAuthStateChange(true, session.user)
        } else if (event === 'SIGNED_OUT') {
            currentUser = null
            onAuthStateChange(false, null)
        }
    })
}

// Check if current route requires authentication
export function checkRouteAuth() {
    const currentPath = window.location.pathname
    
    // Routes that don't require authentication
    const publicRoutes = ['/login']
    
    // If not authenticated and trying to access protected route
    if (!isAuthenticated() && !publicRoutes.includes(currentPath)) {
        window.location.href = '/login'
        return false
    }
    
    // If authenticated and on login page, redirect to main app
    if (isAuthenticated() && currentPath === '/login') {
        window.location.href = '/price_calculation'
        return false
    }
    
    return true
}

// Get current user
export function getCurrentUser() {
    return currentUser
}

// Check if user is authenticated
export function isAuthenticated() {
    return currentUser !== null
}

// Sign in with email and password
export async function signIn(email, password) {
    try {
        console.log('Signing in with email:', email)
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        
        if (error) throw error
        
        console.log('Sign in successful, user:', data.user)
        
        // Update current user immediately
        currentUser = data.user
        
        // Trigger auth state change
        onAuthStateChange(true, data.user)
        
        // Force redirect if on login page
        if (window.location.pathname === '/login') {
            console.log('Forcing redirect to /price_calculation')
            setTimeout(() => {
                window.location.href = '/price_calculation'
            }, 100)
        }
        
        return { success: true, user: data.user }
    } catch (error) {
        console.error('Sign in error:', error)
        return { success: false, error: error.message }
    }
}

// Sign up with email and password
export async function signUp(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })
        
        if (error) throw error
        return { success: true, user: data.user }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Sign out
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        
        // Update current user immediately
        currentUser = null
        
        // Trigger auth state change
        onAuthStateChange(false, null)
        
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Password reset
export async function resetPassword(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Auth state change callback
function onAuthStateChange(isAuthenticated, user) {
    console.log('Auth state changed:', { isAuthenticated, user: user?.email, currentPath: window.location.pathname })
    
    // Dispatch custom event for other parts of the app
    const event = new CustomEvent('authStateChanged', {
        detail: { isAuthenticated, user }
    })
    document.dispatchEvent(event)
    
    // Update UI based on auth state
    updateAuthUI(isAuthenticated, user)
    
    // Handle redirect after successful login
    if (isAuthenticated && user && window.location.pathname === '/login') {
        console.log('User authenticated, redirecting to main app...')
        setTimeout(() => {
            window.location.href = '/price_calculation'
        }, 100)
    }
}

// Update UI based on authentication state
function updateAuthUI(isAuthenticated, user) {
    console.log('Updating UI:', { isAuthenticated, user: user?.email, currentPath: window.location.pathname })
    
    const authContainer = document.getElementById('authContainer')
    const appContainer = document.getElementById('appContainer')
    
    console.log('Found elements:', { authContainer: !!authContainer, appContainer: !!appContainer })
    
    if (isAuthenticated && user) {
        // User is logged in - show app
        if (authContainer) authContainer.style.display = 'none'
        if (appContainer) appContainer.style.display = 'block'
        
        // Update user info display
        updateUserInfo(user)
        
        // Update URL to show the main app if on login page
        if (window.location.pathname === '/login') {
            console.log('Updating URL to /price_calculation')
            window.history.replaceState({}, '', '/price_calculation')
        }
    } else {
        // User is not logged in - show login
        if (authContainer) authContainer.style.display = 'block'
        if (appContainer) appContainer.style.display = 'none'
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
            console.log('Redirecting to /login')
            window.location.href = '/login'
        }
    }
}

// Update user information display
function updateUserInfo(user) {
    const userInfoElement = document.getElementById('userInfo')
    if (userInfoElement) {
        userInfoElement.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-sm text-gray-700">Welcome, ${user.email}</span>
                <button id="signOutBtn" class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                    Sign Out
                </button>
            </div>
        `
        
        // Add event listener to the sign out button
        const signOutBtn = userInfoElement.querySelector('#signOutBtn')
        if (signOutBtn) {
            signOutBtn.addEventListener('click', async () => {
                const result = await signOut()
                if (result.success) {
                    console.log('Signed out successfully')
                    // The auth state change will handle the redirect
                } else {
                    console.error('Sign out failed:', result.error)
                }
            })
        }
    }
}

// Cleanup function
export function cleanupAuth() {
    if (authListener) {
        authListener.data.subscription.unsubscribe()
    }
}


