# 🎵 MusicStream - Home Server Music Streaming

A beautiful, Spotify-like music streaming web application that runs entirely from your home server. Features a dark theme with stunning gradients, local music library scanning, user authentication, and torrent downloading capabilities.

## ✨ Features

### 🎨 Beautiful UI
- **Spotify-inspired design** with dark theme and gradient accents
- **Responsive design** for mobile and desktop
- **Smooth animations** and transitions
- **Modern card-based layout**

### 🎵 Music Streaming
- **Local music library** - Scan and stream from your computer
- **Worldwide music search** - Browse millions of tracks via Deezer API
- **Audio player** with playback controls
- **User authentication** with persistent storage

### 📥 Download Management
- **Torrent integration** - Download music via torrent search
- **Download tracking** - Monitor progress and status
- **Seamless integration** - Downloads appear in your library

### 🌐 Works Everywhere
- **Responsive web design** - Works on any device with a browser
- **Mobile-optimized** - Touch-friendly controls
- **Desktop support** - Full experience on computers
- **Free hosting** - Frontend on GitHub Pages, backend on your home server

## 🏗️ Architecture

```
music-streaming-app/
├── backend/          # Node.js/Express API (runs on your home server)
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── database.js    # SQLite database
│   │   ├── musicScanner.js # Local music scanning
│   │   └── index.js  # Server entry point
│   └── package.json
├── css/              # Stylesheets
├── js/               # Frontend JavaScript
├── index.html        # Main page
├── login.html        # Login page
└── README.md
```

## 💰 Hosting Cost: $0/month!

- **Frontend**: FREE on GitHub Pages
- **Backend**: Your home server (free)
- **Database**: SQLite on your computer (free)
- **Music**: Your local collection (free)

## 🚀 Quick Setup

### 1. Configure Your Home Server

1. **Set up port forwarding** on your router:
   - External Port: 3001
   - Internal IP: Your computer's IP
   - Internal Port: 3001

2. **Find your public IP**:
   - Visit [whatismyipaddress.com](https://whatismyipaddress.com)
   - Note your public IP address

3. **Update config**:
   - Edit `js/config.js`
   - Replace `YOUR_PUBLIC_IP` with your actual IP

### 2. Set Up Music Library

1. **Create `.env` file** in `backend/` folder:
```env
MUSIC_PATHS=C:\Users\YourName\Music,D:\Music
AUTO_SCAN=true
PORT=3001
```

2. **Start the backend**:
```bash
cd backend
npm install
npm start
```

### 3. Deploy Frontend to GitHub

1. **Upload to GitHub**:
```bash
git add .
git commit -m "Deploy music streaming app"
git push origin main
```

2. **Enable GitHub Pages**:
   - Go to repo Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / / (root)
   - Your site: `https://yourusername.github.io/MusicApp`

## 🎮 Usage

1. **Visit your site**: `https://yourusername.github.io/MusicApp`
2. **Register/Login** to create your account
3. **Browse your music** library (auto-scanned)
4. **Search worldwide** music via Deezer
5. **Download music** via torrent integration
6. **Stream and enjoy** your personal music service!

## 🔧 Configuration

### Music Library Paths
Edit `backend/.env`:
```env
MUSIC_PATHS=C:\Users\YourName\Music,D:\Music,E:\MyMusic
```

### API Configuration
Edit `js/config.js`:
```javascript
API_URL: 'http://YOUR_PUBLIC_IP:3001'
```

## 🐛 Troubleshooting

### Backend won't start
- Check if Node.js is installed
- Verify all dependencies: `cd backend && npm install`
- Check if port 3001 is available

### Can't access from internet
- Verify port forwarding is set up
- Check your public IP address
- Ensure backend is running

### Music not found
- Check music paths in `.env` file
- Verify folders exist and contain music files
- Run manual scan: `POST /api/library/scan`

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Made with ❤️ for music lovers who want full control over their library**