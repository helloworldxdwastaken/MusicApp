// Main App
const App = {
    currentPage: 'home',
    searchType: 'track',
    downloads: [],

    async init() {
        console.log('🎵 MusicStream Starting...');
        
        // Load user info
        this.loadUserInfo();

        // Initialize player
        Player.init();

        // Setup navigation
        this.setupNavigation();

        // Setup search
        this.setupSearch();

        // Setup logout
        this.setupLogout();

        // Check backend connection
        await this.checkBackend();

        // Load initial content
        await this.loadTrendingMusic();

        // Start download updates
        this.startDownloadUpdates();

        console.log('✅ MusicStream Ready!');
    },

    loadUserInfo() {
        const user = Auth.getUser();
        if (user) {
            document.getElementById('user-name').textContent = user.username;
            if (user.isGuest) {
                document.getElementById('user-status').textContent = 'Guest Mode';
            } else {
                document.getElementById('user-status').textContent = 'Free Plan';
            }
        }
    },

    setupLogout() {
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    Auth.logout();
                }
            });
        }
    },

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
    },

    navigateTo(page) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Show page
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(`page-${page}`).classList.add('active');

        this.currentPage = page;

        // Load page content
        if (page === 'library') {
            this.loadLibrary();
        } else if (page === 'downloads') {
            this.loadDownloads();
        }
    },

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        // Search on button click
        searchBtn.addEventListener('click', () => {
            this.performSearch();
        });

        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.searchType = btn.getAttribute('data-type');
            });
        });
    },

    async checkBackend() {
        try {
            const response = await API.checkHealth();
            console.log('✅ Backend connected:', response);
            this.updateStatus(true, 'Connected');
        } catch (error) {
            console.warn('⚠️ Backend not connected - using direct API mode');
            this.updateStatus(false, 'Direct Mode');
        }
    },

    updateStatus(online, statusText) {
        const dot = document.getElementById('status-dot');
        const text = document.getElementById('status-text');

        if (online) {
            dot.classList.remove('offline');
            text.textContent = statusText || 'Connected';
        } else {
            dot.classList.remove('offline'); // Show as online even in direct mode
            text.textContent = statusText || 'Direct Mode';
        }
    },

    async loadTrendingMusic() {
        const container = document.getElementById('trending-music');
        container.innerHTML = '<div class="loading">Loading trending music...</div>';

        try {
            const data = await API.getTrending();
            this.renderMusicGrid(data, container);
        } catch (error) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load music</p></div>';
        }
    },

    async performSearch() {
        const query = document.getElementById('search-input').value.trim();
        if (!query) return;

        const container = document.getElementById('search-results');
        container.innerHTML = '<div class="loading">Searching...</div>';

        try {
            const results = await API.searchMusic(query, this.searchType);
            this.renderMusicGrid(results, container);
        } catch (error) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Search failed</p></div>';
        }
    },

    renderMusicGrid(data, container) {
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>No results found</p></div>';
            return;
        }

        container.innerHTML = data.map(item => `
            <div class="music-card">
                <img src="${item.image || 'https://via.placeholder.com/180'}" alt="${item.title}">
                <button class="play-btn" onclick="App.playTrack(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                    <i class="fas fa-play"></i>
                </button>
                <button class="download-btn" onclick="App.downloadTrack(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                    <i class="fas fa-download"></i>
                </button>
                <h3>${this.escapeHtml(item.title)}</h3>
                <p>${this.escapeHtml(item.artist)}</p>
            </div>
        `).join('');
    },

    async playTrack(track) {
        console.log('Playing:', track);
        
        // Add stream URL
        track.streamUrl = await API.getStreamUrl(track.id, track.source || 'deezer');
        
        Player.play(track);
    },

    async downloadTrack(track) {
        console.log('Downloading:', track);
        
        if (!API.useBackend) {
            alert('⚠️ Backend required for downloads!\n\nTo enable downloads:\n1. Install Node.js\n2. Run: cd backend && npm install && npm start');
            return;
        }
        
        try {
            const result = await API.downloadMusic(track);
            alert(`Download started: ${track.title}`);
            
            // Refresh downloads page
            if (this.currentPage === 'downloads') {
                this.loadDownloads();
            }
        } catch (error) {
            alert('Download failed: ' + error.message);
        }
    },

    async loadLibrary() {
        const container = document.getElementById('library-content');
        container.innerHTML = '<div class="loading">Loading library...</div>';

        try {
            const data = await API.getLibrary();
            if (data && data.length > 0) {
                this.renderMusicGrid(data, container);
            } else {
                container.innerHTML = '<div class="empty-state"><i class="fas fa-music"></i><p>No music in library yet</p><small>Download some music to see it here</small></div>';
            }
        } catch (error) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-music"></i><p>Library not available</p><small>Set up Jellyfin to see your library</small></div>';
        }
    },

    async loadDownloads() {
        const container = document.getElementById('downloads-list');
        
        try {
            this.downloads = await API.getDownloads();
            
            document.getElementById('download-count').textContent = 
                `${this.downloads.length} active download${this.downloads.length !== 1 ? 's' : ''}`;

            if (this.downloads.length === 0) {
                container.innerHTML = '<div class="empty-state"><i class="fas fa-download"></i><p>No active downloads</p></div>';
                return;
            }

            container.innerHTML = this.downloads.map(download => `
                <div class="download-item">
                    <div class="download-header">
                        <div class="download-info">
                            <h3>${this.escapeHtml(download.name)}</h3>
                            <div class="download-stats">
                                <span class="status">${download.status}</span>
                                <span>${this.formatSize(download.size)}</span>
                                ${download.speed ? `<span class="speed">↓ ${this.formatSpeed(download.speed)}</span>` : ''}
                            </div>
                        </div>
                        <div class="download-actions">
                            <button class="btn-icon" onclick="App.cancelDownload('${download.id}')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${download.progress}%"></div>
                    </div>
                    <div class="progress-text">${download.progress.toFixed(1)}%</div>
                </div>
            `).join('');
        } catch (error) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load downloads</p></div>';
        }
    },

    async cancelDownload(downloadId) {
        if (!confirm('Cancel this download?')) return;

        try {
            await API.cancelDownload(downloadId);
            this.loadDownloads();
        } catch (error) {
            alert('Failed to cancel download');
        }
    },

    startDownloadUpdates() {
        // Update downloads every 3 seconds if on downloads page
        setInterval(() => {
            if (this.currentPage === 'downloads' && this.downloads.length > 0) {
                this.loadDownloads();
            }
        }, 3000);
    },

    formatSize(bytes) {
        if (!bytes) return '0 B';
        const gb = bytes / (1024 * 1024 * 1024);
        const mb = bytes / (1024 * 1024);
        return gb >= 1 ? `${gb.toFixed(2)} GB` : `${mb.toFixed(2)} MB`;
    },

    formatSpeed(bytesPerSecond) {
        const mbps = bytesPerSecond / (1024 * 1024);
        return `${mbps.toFixed(2)} MB/s`;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

