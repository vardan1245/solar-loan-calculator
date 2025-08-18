// Route Protection Module
// This module handles authentication checks and route protection

import { isAuthenticated, getCurrentUser } from './auth.js';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login'];

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/price_calculation', '/'];

// Check if current route requires authentication
export function checkRouteAuth() {
    const currentPath = window.location.pathname;
    
    // If not authenticated and trying to access protected route
    if (!isAuthenticated() && !PUBLIC_ROUTES.includes(currentPath)) {
        console.log('Route protection: Redirecting unauthenticated user to login');
        window.location.href = '/login';
        return false;
    }
    
    // If authenticated and on login page, redirect to main app
    if (isAuthenticated() && currentPath === '/login') {
        console.log('Route protection: Redirecting authenticated user to main app');
        window.location.href = '/price_calculation';
        return false;
    }
    
    return true;
}

// Initialize route protection for the current page
export function initRouteProtection() {
    // Check route auth immediately
    checkRouteAuth();
    
    // Set up route change listener for SPA navigation
    window.addEventListener('popstate', checkRouteAuth);
    
    // Check route auth periodically (in case of dynamic content changes)
    setInterval(checkRouteAuth, 5000);
}

// Function to navigate to protected route (with auth check)
export function navigateToProtectedRoute(route) {
    if (isAuthenticated()) {
        window.location.href = route;
    } else {
        window.location.href = '/login';
    }
}

// Function to check if user can access a specific route
export function canAccessRoute(route) {
    if (PUBLIC_ROUTES.includes(route)) {
        return true;
    }
    
    return isAuthenticated();
}

// Export current user info for route protection
export function getRouteUserInfo() {
    return {
        isAuthenticated: isAuthenticated(),
        user: getCurrentUser(),
        currentPath: window.location.pathname
    };
}
