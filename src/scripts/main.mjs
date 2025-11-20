// src/scripts/main.mjs
import { AuthManager } from './modules/auth.mjs';
import { initModal, showNotification, closeAllModals } from './modules/utils.mjs';

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cinque Stelle CBT Platform Initialized');
    
    const authManager = new AuthManager();
    initModal();
    
    // Check if user is already logged in
    const currentUser = authManager.getCurrentUser();
    if (currentUser) {
        updateAuthUI(true, currentUser.username);
        showNotification(`Welcome back, ${currentUser.username}!`, 'success');
    }

    // Event listeners for Get Started button
    document.getElementById('get-started')?.addEventListener('click', () => {
        showLoginModal();
    });

    document.getElementById('learn-more')?.addEventListener('click', () => {
        showNotification('Our platform offers JAMB, WAEC, and NECO past questions with detailed analytics!', 'info');
    });

    // Auth link in navigation
    document.getElementById('auth-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (authManager.getCurrentUser()) {
            authManager.logout();
            updateAuthUI(false);
            showNotification('Logged out successfully', 'info');
        } else {
            showLoginModal();
        }
    });

    // Login form submission
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');
        
        // Basic validation
        if (!username || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        try {
            if (await authManager.login(username, password)) {
                updateAuthUI(true, username);
                closeAllModals();
                showNotification('Login successful! Redirecting to dashboard...', 'success');
                
                // Redirect to dashboard after successful login
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });

    // Switch to registration form
    document.getElementById('show-register')?.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterModal();
    });

    // Register form submission
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('reg-username');
        const email = formData.get('email');
        const password = formData.get('reg-password');
        const confirmPassword = formData.get('confirm-password');
        
        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }
        
        try {
            if (await authManager.register(username, email, password)) {
                closeAllModals();
                showNotification('Registration successful! Please login with your new account.', 'success');
                setTimeout(() => {
                    showLoginModal();
                }, 1000);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });

    // Switch back to login from registration
    document.getElementById('show-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginModal();
    });

    // Mobile navigation toggle
    document.querySelector('.nav-toggle')?.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        const navToggle = document.querySelector('.nav-toggle');
        
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    function showLoginModal() {
        closeAllModals();
        document.getElementById('login-modal').classList.remove('hidden');
        // Clear form fields
        document.getElementById('login-form').reset();
    }

    function showRegisterModal() {
        closeAllModals();
        document.getElementById('register-modal').classList.remove('hidden');
        // Clear form fields
        document.getElementById('register-form').reset();
    }

    function updateAuthUI(isLoggedIn, username = '') {
        const authLink = document.getElementById('auth-link');
        if (authLink) {
            if (isLoggedIn) {
                authLink.innerHTML = `👤 ${username} | Logout`;
                authLink.style.fontWeight = '600';
            } else {
                authLink.textContent = 'Login';
                authLink.style.fontWeight = 'normal';
            }
        }
    }
});