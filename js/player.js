// Music Player
const Player = {
    audio: null,
    currentTrack: null,
    isPlaying: false,
    queue: [],

    init() {
        this.audio = document.getElementById('audio-player');
        this.setupEventListeners();
        this.updateUI();
    },

    setupEventListeners() {
        // Play/Pause button
        document.getElementById('btn-play').addEventListener('click', () => {
            this.togglePlay();
        });

        // Previous/Next buttons
        document.getElementById('btn-previous').addEventListener('click', () => {
            this.previous();
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            this.next();
        });

        // Progress bar
        document.getElementById('progress-bar').addEventListener('input', (e) => {
            const time = (e.target.value / 100) * this.audio.duration;
            this.audio.currentTime = time;
        });

        // Volume bar
        document.getElementById('volume-bar').addEventListener('input', (e) => {
            this.audio.volume = e.target.value / 100;
        });

        // Audio events
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audio.addEventListener('ended', () => {
            this.next();
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });
    },

    play(track) {
        this.currentTrack = track;
        this.audio.src = track.streamUrl;
        this.audio.play();
        this.isPlaying = true;
        this.updateUI();
        this.show();
    },

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play();
            this.isPlaying = true;
        }
        this.updatePlayButton();
    },

    previous() {
        // TODO: Implement queue navigation
        this.audio.currentTime = 0;
    },

    next() {
        // TODO: Implement queue navigation
        if (this.queue.length > 0) {
            const nextTrack = this.queue.shift();
            this.play(nextTrack);
        }
    },

    updateUI() {
        if (!this.currentTrack) return;

        document.getElementById('player-image').src = this.currentTrack.image || 'https://via.placeholder.com/56';
        document.getElementById('player-title').textContent = this.currentTrack.title;
        document.getElementById('player-artist').textContent = this.currentTrack.artist;
        this.updatePlayButton();
    },

    updatePlayButton() {
        const icon = document.querySelector('#btn-play i');
        icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    },

    updateProgress() {
        if (!this.audio.duration) return;

        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        document.getElementById('progress-bar').value = progress;

        document.getElementById('current-time').textContent = this.formatTime(this.audio.currentTime);
    },

    updateDuration() {
        document.getElementById('duration').textContent = this.formatTime(this.audio.duration);
    },

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    show() {
        document.getElementById('player').style.display = 'flex';
    },

    hide() {
        document.getElementById('player').style.display = 'none';
    }
};


