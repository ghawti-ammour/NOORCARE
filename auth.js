// Auth Module
class Auth {
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
}

// Create a global instance
const auth = new Auth();

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = auth.getCurrentUser();
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
    const dashboards = {
        'doctor': 'doctor-dashboard.html',
        'patient': 'patient-dashboard.html',
        'hospital': 'hospital-dashboard.html',
        'pharmacy': 'pharmacy-dashboard.html',
        'laboratoire': 'laboratory-dashboard.html'
    };

    const dashboard = dashboards[role] || 'index.html';
    window.location.href = dashboard;
}

// Show alert message
function showAlert(message, type = 'info') {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = `alert-message alert-${type}`;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// Make functions available globally
window.auth = auth;
window.redirectToDashboard = redirectToDashboard;
window.showAlert = showAlert;
