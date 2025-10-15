// Configuration
const CONFIG = {
    // Backend API URL - Update this when deploying
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3001'
        : 'http://YOUR_PUBLIC_IP:3001', // Your home server IP address
    
    // Auto-detect backend URL from URL parameter
    getApiUrl() {
        const params = new URLSearchParams(window.location.search);
        const apiUrl = params.get('api');
        if (apiUrl) {
            localStorage.setItem('api_url', apiUrl);
            return apiUrl;
        }
        return localStorage.getItem('api_url') || this.API_URL;
    }
};

// Replace API_URL on GitHub Pages
if (window.location.hostname.includes('github.io')) {
    // Users can pass ?api=https://their-backend-url.com to set the backend
    CONFIG.API_URL = CONFIG.getApiUrl();
}


