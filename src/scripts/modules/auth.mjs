// src/scripts/modules/auth.mjs
export class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.currentUser = this.getCurrentUser();
    }

    async register(username, email, password) {
        // Validation
        if (!username || !email || !password) {
            throw new Error('All fields are required');
        }

        if (username.length < 3) {
            throw new Error('Username must be at least 3 characters');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        // Check if user already exists
        const existingUsers = this.getStoredUsers();
        if (existingUsers.find(user => user.username === username)) {
            throw new Error('Username already exists');
        }

        if (existingUsers.find(user => user.email === email)) {
            throw new Error('Email already registered');
        }

        // Create new user
        const newUser = {
            username,
            email,
            userId: this.generateUserId(),
            createdAt: Date.now()
        };

        // Store user
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        // REMOVED the showNotification call here - let main.mjs handle notifications
        return true;
    }

    async login(username, password) {
        // Demo validation
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        // For demo purposes, any credentials work
        const user = { 
            username, 
            loginTime: Date.now(),
            userId: this.generateUserId()
        };
        
        // Store in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Initialize user progress if not exists
        if (!localStorage.getItem('userProgress')) {
            localStorage.setItem('userProgress', JSON.stringify({
                testsCompleted: 0,
                averageScore: 0,
                studyTime: 0,
                studyStreak: 0,
                lastActive: Date.now()
            }));
        }
        
        this.currentUser = user;
        return true;
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        return true;
    }

    getCurrentUser() {
        try {
            const userData = localStorage.getItem('currentUser');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    getStoredUsers() {
        try {
            return JSON.parse(localStorage.getItem('users') || '[]');
        } catch (error) {
            return [];
        }
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }
}