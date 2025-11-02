// sessionManager.js - Session management utilities
class SessionManager {
    static SESSION_KEY = 'lostfound_session';
    static USER_KEY = 'lostfound_user';
    static LOGIN_TIMESTAMP_KEY = 'lostfound_login_time';
    static SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Create a new session
    static createSession(userData) {
        const sessionData = {
            user: userData,
            loginTime: Date.now(),
            sessionId: this.generateSessionId()
        };
        
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
        localStorage.setItem(this.LOGIN_TIMESTAMP_KEY, sessionData.loginTime.toString());
        
        console.log('Session created:', sessionData.sessionId);
    }

    // Check if current session is valid
    static isValidSession() {
        try {
            const sessionData = localStorage.getItem(this.SESSION_KEY);
            const loginTime = localStorage.getItem(this.LOGIN_TIMESTAMP_KEY);
            
            if (!sessionData || !loginTime) {
                return false;
            }

            const session = JSON.parse(sessionData);
            const currentTime = Date.now();
            const timeSinceLogin = currentTime - parseInt(loginTime);

            // Check if session has expired
            if (timeSinceLogin > this.SESSION_DURATION) {
                console.log('Session expired');
                this.clearSession();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error validating session:', error);
            this.clearSession();
            return false;
        }
    }

    // Get current user data
    static getCurrentUser() {
        if (!this.isValidSession()) {
            return null;
        }

        try {
            const userData = localStorage.getItem(this.USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            this.clearSession();
            return null;
        }
    }

    // Clear session and logout
    static clearSession() {
        localStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.LOGIN_TIMESTAMP_KEY);
        localStorage.removeItem('user'); // Legacy key
        localStorage.removeItem('isLoggedIn'); // Legacy key
        console.log('Session cleared');
    }

    // Generate a unique session ID
    static generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Force logout with redirect
    static logout(redirectUrl = '/signin') {
        this.clearSession();
        
        // Clear any cached data
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        
        // Redirect to login page
        window.location.href = redirectUrl;
    }

    // Require authentication (call this on protected pages)
    static requireAuth(redirectUrl = '/signin') {
        if (!this.isValidSession()) {
            console.log('Authentication required, redirecting to:', redirectUrl);
            this.logout(redirectUrl);
            return false;
        }
        return true;
    }

    // Extend session (call this on user activity)
    static extendSession() {
        if (this.isValidSession()) {
            const userData = this.getCurrentUser();
            if (userData) {
                this.createSession(userData);
            }
        }
    }
}

// Auto-extend session on user activity
let activityTimer;
const resetActivityTimer = () => {
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        SessionManager.extendSession();
    }, 5 * 60 * 1000); // Extend session every 5 minutes of activity
};

// Listen for user activity
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetActivityTimer, true);
});
