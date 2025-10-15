// Authentication Handler
const Auth = {
    init() {
        this.setupEventListeners();
        this.checkAuth();
    },

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        // Guest button
        const guestBtn = document.getElementById('btn-guest');
        if (guestBtn) {
            guestBtn.addEventListener('click', () => {
                this.loginAsGuest();
            });
        }

        // Toggle between login and signup
        const showSignup = document.getElementById('show-signup');
        const showLogin = document.getElementById('show-login');
        
        if (showSignup) {
            showSignup.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.login-box:not(.signup-box)').style.display = 'none';
                document.querySelector('.signup-box').style.display = 'block';
            });
        }

        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.signup-box').style.display = 'none';
                document.querySelector('.login-box:not(.signup-box)').style.display = 'block';
            });
        }

        // Toggle password visibility
        document.querySelectorAll('.toggle-password').forEach(icon => {
            icon.addEventListener('click', () => {
                const input = icon.previousElementSibling;
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    },

    checkAuth() {
        // Check if user is already logged in
        const user = this.getUser();
        console.log('Auth check - User:', user, 'Path:', window.location.pathname);
        
        if (user && window.location.pathname.includes('login.html')) {
            // User is logged in but on login page, redirect to main app
            console.log('Redirecting to index.html');
            window.location.href = 'index.html';
        } else if (!user && window.location.pathname.includes('index.html')) {
            // User is not logged in but on main app, redirect to login
            console.log('Redirecting to login.html');
            window.location.href = 'login.html';
        }
    },

    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Show loading state
        const btn = document.querySelector('.btn-login');
        const btnText = btn.querySelector('span');
        const originalText = btnText.textContent;
        btnText.textContent = 'Logging in...';
        btn.disabled = true;

        try {
            // Always try backend first (server-side storage)
            if (window.CONFIG) {
                const response = await fetch(`${window.CONFIG.getApiUrl()}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    this.saveUser(data.user, remember);
                    window.location.href = 'index.html';
                    return;
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || 'Login failed');
                    btnText.textContent = originalText;
                    btn.disabled = false;
                    return;
                }
            }

            // Fallback: Local authentication (only if backend not available)
            const users = JSON.parse(localStorage.getItem('musicstream_users') || '[]');
            const user = users.find(u => 
                (u.username === username || u.email === username) && u.password === password
            );

            if (user) {
                this.saveUser(user, remember);
                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password');
                btnText.textContent = originalText;
                btn.disabled = false;
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
            btnText.textContent = originalText;
            btn.disabled = false;
        }
    },

    async handleSignup() {
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        // Show loading state
        const btn = document.querySelector('.signup-box .btn-login');
        const btnText = btn.querySelector('span');
        const originalText = btnText.textContent;
        btnText.textContent = 'Creating account...';
        btn.disabled = true;

        try {
            // Always try backend first (server-side storage)
            if (window.CONFIG) {
                const response = await fetch(`${window.CONFIG.getApiUrl()}/api/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    this.saveUser(data.user, true);
                    window.location.href = 'index.html';
                    return;
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || 'Signup failed');
                    btnText.textContent = originalText;
                    btn.disabled = false;
                    return;
                }
            }

            // Fallback: Local registration (only if backend not available)
            const users = JSON.parse(localStorage.getItem('musicstream_users') || '[]');
            
            // Check if username/email already exists
            if (users.find(u => u.username === username || u.email === email)) {
                alert('Username or email already exists');
                btnText.textContent = originalText;
                btn.disabled = false;
                return;
            }

            const newUser = {
                id: Date.now().toString(),
                username,
                email,
                password, // In production, hash this!
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('musicstream_users', JSON.stringify(users));
            
            this.saveUser(newUser, true);
            console.log('User saved, redirecting to index.html');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Signup error:', error);
            alert('Signup failed. Please try again.');
            btnText.textContent = originalText;
            btn.disabled = false;
        }
    },

    loginAsGuest() {
        const guestUser = {
            id: 'guest',
            username: 'Guest',
            email: 'guest@musicstream.com',
            isGuest: true
        };

        this.saveUser(guestUser, false);
        window.location.href = 'index.html';
    },

    saveUser(user, remember) {
        // Don't save password to localStorage
        const userToSave = { ...user };
        delete userToSave.password;

        console.log('Saving user:', userToSave, 'Remember:', remember);

        if (remember) {
            localStorage.setItem('musicstream_user', JSON.stringify(userToSave));
            console.log('User saved to localStorage');
        } else {
            sessionStorage.setItem('musicstream_user', JSON.stringify(userToSave));
            console.log('User saved to sessionStorage');
        }
    },

    getUser() {
        const user = localStorage.getItem('musicstream_user') || 
                     sessionStorage.getItem('musicstream_user');
        return user ? JSON.parse(user) : null;
    },

    logout() {
        localStorage.removeItem('musicstream_user');
        sessionStorage.removeItem('musicstream_user');
        window.location.href = 'login.html';
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});


