// API Client - Works with or without backend!
const API = {
    baseUrl: CONFIG.getApiUrl(),
    useBackend: false, // Will auto-detect

    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Health check
    async checkHealth() {
        try {
            const result = await this.request('/api/health');
            this.useBackend = true;
            return result;
        } catch (error) {
            this.useBackend = false;
            throw error;
        }
    },

    // Music Search - Direct to Deezer with CORS proxy
    async searchMusic(query, type = 'track', limit = 30) {
        try {
            // Try backend first if available
            if (this.useBackend) {
                return await this.request(`/api/music/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`);
            }
        } catch (error) {
            console.log('Backend not available, using CORS proxy');
        }

        // Fallback: Deezer API via CORS proxy
        const corsProxy = 'https://corsproxy.io/?';
        const deezerUrl = `https://api.deezer.com/search/${type}?q=${encodeURIComponent(query)}&limit=${limit}`;
        const response = await fetch(corsProxy + encodeURIComponent(deezerUrl));
        const data = await response.json();
        
        return data.data.map(item => ({
            id: item.id,
            title: item.title || item.name,
            artist: item.artist?.name || 'Unknown',
            album: item.album?.title,
            image: item.album?.cover_medium || item.picture_medium,
            duration: item.duration,
            preview: item.preview,
            source: 'deezer'
        }));
    },

    // Get trending/chart music - Direct from Deezer with CORS proxy
    async getTrending(limit = 12) {
        try {
            // Try backend first if available
            if (this.useBackend) {
                return await this.request(`/api/music/trending?limit=${limit}`);
            }
        } catch (error) {
            console.log('Backend not available, using CORS proxy');
        }

        // Fallback: Deezer API via CORS proxy
        const corsProxy = 'https://corsproxy.io/?';
        const deezerUrl = `https://api.deezer.com/chart/0/tracks?limit=${limit}`;
        const response = await fetch(corsProxy + encodeURIComponent(deezerUrl));
        const data = await response.json();
        
        return data.data.map(item => ({
            id: item.id,
            title: item.title,
            artist: item.artist.name,
            album: item.album.title,
            image: item.album.cover_medium,
            duration: item.duration,
            preview: item.preview,
            source: 'deezer'
        }));
    },

    // Get track details
    async getTrackDetails(trackId) {
        return this.request(`/api/music/track/${trackId}`);
    },

    // Download music
    async downloadMusic(trackInfo) {
        return this.request('/api/download/add', {
            method: 'POST',
            body: JSON.stringify(trackInfo)
        });
    },

    // Get downloads
    async getDownloads() {
        return this.request('/api/download/list');
    },

    // Get download status
    async getDownloadStatus(downloadId) {
        return this.request(`/api/download/status/${downloadId}`);
    },

    // Cancel download
    async cancelDownload(downloadId) {
        return this.request(`/api/download/cancel/${downloadId}`, {
            method: 'DELETE'
        });
    },

    // Get library (Local)
    async getLibrary() {
        return this.request('/api/library/library');
    },

    // Stream URL - Can work without backend!
    async getStreamUrl(trackId, source = 'deezer') {
        if (source === 'deezer') {
            try {
                if (this.useBackend) {
                    return `${this.baseUrl}/api/music/stream/${trackId}`;
                }
            } catch (error) {
                console.log('Getting direct preview URL');
            }
            
            // Get direct preview URL from Deezer via CORS proxy
            const corsProxy = 'https://corsproxy.io/?';
            const deezerUrl = `https://api.deezer.com/track/${trackId}`;
            const response = await fetch(corsProxy + encodeURIComponent(deezerUrl));
            const data = await response.json();
            return data.preview; // 30s preview
        }
        return `${this.baseUrl}/api/jellyfin/stream/${trackId}`;
    }
};

