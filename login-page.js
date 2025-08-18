import { signIn, signUp, resetPassword, initAuth } from './auth.js';

// DOM elements
let currentForm = 'login'; // 'login' or 'signup'

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
    initializeLoginPage();
    await initAuth();
    
    // Initialize route protection
    const { initRouteProtection } = await import('./route-protection.js');
    initRouteProtection();
});

function initializeLoginPage() {
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signUpForm').addEventListener('submit', handleSignUp);
    
    // Form switching
    document.getElementById('showSignUp').addEventListener('click', showSignUpForm);
    document.getElementById('backToSignIn').addEventListener('click', showLoginForm);
    
    // Forgot password
    document.getElementById('forgotPassword').addEventListener('click', showForgotPasswordModal);
    
    // Enter key handlers
    document.getElementById('email').addEventListener('keypress', handleEnterKey);
    document.getElementById('password').addEventListener('keypress', handleEnterKey);
    document.getElementById('signUpEmail').addEventListener('keypress', handleEnterKey);
    document.getElementById('signUpPassword').addEventListener('keypress', handleEnterKey);
    document.getElementById('confirmPassword').addEventListener('keypress', handleEnterKey);
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const email = (emailInput?.value || '').trim().toLowerCase();
    const password = (passwordInput?.value || '').trim();
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    setLoadingState('login', true);
    
    try {
        const result = await signIn(email, password);
        
        if (result.success) {
            showMessage('Login successful! Redirecting...', 'success');
            // Force redirect after a short delay
            setTimeout(() => {
                window.location.href = '/price_calculation';
            }, 1000);
        } else {
            // Normalize common auth errors
            const message = (result.error || '').toString();
            if (message.toLowerCase().includes('invalid login credentials')) {
                showMessage('Invalid email or password. If you do not have an account, please sign up.', 'error');
            } else if (message.toLowerCase().includes('email not confirmed')) {
                showMessage('Please confirm your email address before signing in.', 'error');
            } else {
                showMessage(message || 'Login failed', 'error');
            }
        }
    } catch (error) {
        showMessage('An unexpected error occurred', 'error');
        console.error('Login error:', error);
    } finally {
        setLoadingState('login', false);
    }
}

// Handle sign up form submission
async function handleSignUp(event) {
    event.preventDefault();
    
    const email = (document.getElementById('signUpEmail')?.value || '').trim().toLowerCase();
    const password = (document.getElementById('signUpPassword')?.value || '').trim();
    const confirmPassword = (document.getElementById('confirmPassword')?.value || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    
    if (!email || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Show loading state
    setLoadingState('signup', true);
    
    try {
        const result = await signUp(email, password);
        
        if (result.success) {
            showMessage('Account created successfully! Please check your email to verify your account.', 'success');
            // Switch back to login form
            setTimeout(() => showLoginForm(), 2000);
        } else {
            const message = (result.error || '').toString();
            if (message.toLowerCase().includes('email address') && message.toLowerCase().includes('invalid')) {
                showMessage('The email address appears invalid. Please use a valid email.', 'error');
            } else if (message.toLowerCase().includes('already registered')) {
                showMessage('An account with this email already exists. Please sign in.', 'error');
            } else {
                showMessage(message || 'Sign up failed', 'error');
            }
        }
    } catch (error) {
        showMessage('An unexpected error occurred', 'error');
        console.error('Sign up error:', error);
    } finally {
        setLoadingState('signup', false);
    }
}

// Show sign up form
function showSignUpForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signUpForm').classList.remove('hidden');
    currentForm = 'signup';
    
    // Update title
    document.querySelector('h1').textContent = 'Create Account';
    document.querySelector('p').textContent = 'Sign up to get started';
}

// Show login form
function showLoginForm() {
    document.getElementById('signUpForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    currentForm = 'login';
    
    // Update title
    document.querySelector('h1').textContent = 'Tiamat Solar CRM';
    document.querySelector('p').textContent = 'Sign in to access your dashboard';
}

// Show forgot password modal
function showForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').classList.remove('hidden');
    document.getElementById('resetEmail').focus();
}

// Hide forgot password modal
function hideForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').classList.add('hidden');
    document.getElementById('resetEmail').value = '';
}

// Send reset password email
async function sendResetEmail() {
    const email = document.getElementById('resetEmail').value;
    
    if (!email) {
        showMessage('Please enter your email address', 'error');
        return;
    }
    
    try {
        const result = await resetPassword(email);
        
        if (result.success) {
            showMessage('Password reset link sent to your email!', 'success');
            hideForgotPasswordModal();
        } else {
            showMessage(result.error || 'Failed to send reset link', 'error');
        }
    } catch (error) {
        showMessage('An unexpected error occurred', 'error');
        console.error('Reset password error:', error);
    }
}

// Handle Enter key press
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (currentForm === 'login') {
            document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        } else {
            document.getElementById('signUpForm').dispatchEvent(new Event('submit'));
        }
    }
}

// Set loading state for forms
function setLoadingState(formType, isLoading) {
    if (formType === 'login') {
        const buttonText = document.getElementById('buttonText');
        const loadingSpinner = document.getElementById('loadingSpinner');
        
        if (isLoading) {
            buttonText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
        } else {
            buttonText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    } else if (formType === 'signup') {
        const buttonText = document.getElementById('signUpButtonText');
        const loadingSpinner = document.getElementById('signUpLoadingSpinner');
        
        if (isLoading) {
            buttonText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
        } else {
            buttonText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    }
}

// Show message to user
function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    
    // Remove existing messages
    messageContainer.innerHTML = '';
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `px-4 py-3 rounded-lg text-sm font-medium ${
        type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
        type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
        'bg-blue-100 text-blue-700 border border-blue-200'
    }`;
    messageElement.textContent = message;
    
    // Add to container
    messageContainer.appendChild(messageElement);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 5000);
}

// Make functions globally available for onclick handlers
window.sendResetEmail = sendResetEmail;
window.hideForgotPasswordModal = hideForgotPasswordModal;
