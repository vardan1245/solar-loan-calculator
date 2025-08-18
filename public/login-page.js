import { signIn, resetPassword, initAuth } from './auth.js';

// DOM elements

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
    
    // Forgot password
    document.getElementById('forgotPassword').addEventListener('click', showForgotPasswordModal);
    
    // Enter key handlers
    document.getElementById('email').addEventListener('keypress', handleEnterKey);
    document.getElementById('password').addEventListener('keypress', handleEnterKey);
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
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
}

// Set loading state for login form
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
