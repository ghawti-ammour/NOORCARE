// User Management Module
class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('noorcare_users')) || [];
        this.currentUser = JSON.parse(sessionStorage.getItem('noorcare_currentUser')) || null;
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('noorcare_users', JSON.stringify(this.users));
    }

    // Register a new user
    register(userData) {
        // Check if user already exists
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'User with this email already exists' };
        }

        // Add new user
        const newUser = {
            id: 'user_' + Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString(),
            profileImage: null
        };

        this.users.push(newUser);
        this.saveUsers();
        this.currentUser = newUser;
        sessionStorage.setItem('noorcare_currentUser', JSON.stringify(newUser));
        
        return { success: true, user: newUser };
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        this.currentUser = user;
        sessionStorage.setItem('noorcare_currentUser', JSON.stringify(user));
        return { success: true, user };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('noorcare_currentUser');
        return { success: true };
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser || JSON.parse(sessionStorage.getItem('noorcare_currentUser')) || null;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    // Update user profile
    updateProfile(userId, updates) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) return { success: false, message: 'User not found' };
        
        this.users[userIndex] = { ...this.users[userIndex], ...updates };
        
        // If updating current user, update session
        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = this.users[userIndex];
            sessionStorage.setItem('noorcare_currentUser', JSON.stringify(this.currentUser));
        }
        
        this.saveUsers();
        return { success: true, user: this.users[userIndex] };
    }
}

// Create a global instance
const userManager = new UserManager();

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = userManager.getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // If user is logged in and on index page, redirect to dashboard
    if (currentUser && currentPage === 'index.html') {
        redirectToDashboard(currentUser.role);
    }
    // If user is not logged in and not on index page, redirect to login
    else if (!currentUser && !['index.html', ''].includes(currentPage)) {
        window.location.href = 'index.html';
    }
});

// Redirect to appropriate dashboard based on role
function redirectToDashboard(role) {
    switch(role) {
        case 'doctor':
            window.location.href = 'doctor-dashboard.html';
            break;
        case 'patient':
            window.location.href = 'patient-dashboard.html';
            break;
        case 'hospital':
            window.location.href = 'hospital-dashboard.html';
            break;
        case 'pharmacy':
            window.location.href = 'pharmacy-dashboard.html';
            break;
        case 'laboratoire':
            window.location.href = 'laboratory-dashboard.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

// Make functions available globally
window.userManager = userManager;
window.redirectToDashboard = redirectToDashboard;
