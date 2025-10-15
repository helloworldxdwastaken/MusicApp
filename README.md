# 🎵 MusicStream - Self-Hosted Music Streaming Platform

A beautiful, Spotify-like music streaming web application that works on **all devices** through the browser. Host the frontend on **GitHub Pages for FREE**, while running the backend on your home server. Features a dark theme with stunning gradients, Jellyfin integration, worldwide music search, and torrent downloading capabilities.

![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Mobile%20Browser-blue)
![Hosting](https://img.shields.io/badge/hosting-GitHub%20Pages-green)
![Cost](https://img.shields.io/badge/cost-FREE-success)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎨 Beautiful UI
- **Spotify-inspired design** with dark theme and gradient accents
- **Responsive design** for mobile and desktop
- **Smooth animations** and transitions
- **Modern card-based layout**

### 🎵 Music Streaming
- **Jellyfin integration** - Stream from your home server
- **Worldwide music search** - Browse millions of tracks via Last.fm API
- **Audio player** with playback controls
- **Queue management** and playlist support

### 📥 Download Management
- **Torrent integration** - Download music via Transmission
- **Auto-organization** - Automatically organize by artist/album
- **Download tracking** - Monitor progress and status
- **Seamless integration** - Downloads appear in your library

### 🌐 Works Everywhere
- **Responsive web design** - Works on any device with a browser
- **Mobile-optimized** - Touch-friendly controls, looks great on phones
- **Desktop support** - Full experience on computers
- **No app store fees** - Free hosting on GitHub Pages!

## 🏗️ Architecture

```
music-streaming-app/
├── backend/          # Node.js/Express API (runs on your server)
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   └── index.js  # Server entry point
│   └── package.json
├── web/              # Next.js web app (deployed to GitHub Pages)
│   ├── app/          # Pages and layouts
│   ├── components/   # React components
│   ├── store/        # Zustand state management
│   └── lib/          # API client
└── package.json      # Root workspace config
```

## 💰 Hosting

- **Frontend**: FREE on GitHub Pages
- **Backend**: Your home server (any computer)
- **Total cost**: $0 (optional: custom domain ~$12/year)

## 🚀 Two Ways to Use

### Option 1: GitHub Pages (Recommended - FREE!)

**What you need:**
- GitHub account (free)
- A computer at home to run the backend
- That's it!

**Quick Start:**
1. Fork this repository
2. Follow [HOW_TO_RUN.md](HOW_TO_RUN.md) for simple step-by-step instructions
3. Your site will be live at `https://yourusername.github.io`!

**Detailed guides:** See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)

### Option 2: Local Development

**Prerequisites:**
- **Node.js** 18+ and npm
- **Jellyfin** media server (v10.8+)
- **Transmission** torrent client
- **Last.fm API key** (free from https://www.last.fm/api)

### 1. Install Dependencies

```bash
# Install all dependencies (backend + web)
npm run install:all

# Or install individually
cd backend && npm install
cd ../web && npm install
```

### 2. Configure Backend

Create `backend/.env` from the example:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your settings:

```env
PORT=3001

# Jellyfin Configuration
JELLYFIN_URL=http://localhost:8096
JELLYFIN_API_KEY=your_jellyfin_api_key
JELLYFIN_USER_ID=your_jellyfin_user_id

# Transmission Configuration
TRANSMISSION_HOST=localhost
TRANSMISSION_PORT=9091
DOWNLOAD_PATH=/path/to/music/downloads

# Last.fm API
LASTFM_API_KEY=your_lastfm_api_key
LASTFM_API_SECRET=your_lastfm_secret
```

**Getting Jellyfin API Key:**
1. Log into Jellyfin web interface
2. Go to Dashboard → API Keys
3. Create a new API key
4. Copy the key and user ID

**Getting Last.fm API Key:**
1. Visit https://www.last.fm/api/account/create
2. Create an API account
3. Copy the API key and shared secret

### 3. Configure Web App

Create `web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_JELLYFIN_URL=http://localhost:8096
```

### 4. Start Development Servers

```bash
# Start backend and web together
npm run dev

# Or start individually:
npm run dev:backend  # Backend API on port 3001
npm run dev:web      # Web app on port 3000
```

**Access the app:** http://localhost:3000

The web app is fully responsive and works great on mobile browsers!

## 🎮 Usage

### Web Application

1. Open http://localhost:3000
2. Browse your Jellyfin library
3. Search for music worldwide
4. Download music via torrents
5. Stream and enjoy!

### API Endpoints

#### Jellyfin Routes (`/api/jellyfin`)
- `GET /libraries` - Get music libraries
- `GET /artists` - Get all artists
- `GET /albums` - Get albums
- `GET /albums/:albumId/tracks` - Get album tracks
- `GET /recent` - Recently added music
- `GET /search?query=...` - Search Jellyfin library
- `GET /stream/:itemId` - Get stream URL

#### Search Routes (`/api/search`)
- `GET /music?query=...&type=track` - Search worldwide music
- `GET /track/:artist/:track` - Get track info
- `GET /album/:artist/:album` - Get album info
- `GET /artist/:artist` - Get artist info
- `GET /top/tracks` - Get top tracks globally

#### Download Routes (`/api/download`)
- `POST /add` - Add torrent download
- `GET /list` - List all downloads
- `GET /status/:torrentId` - Get download status
- `DELETE /remove/:torrentId` - Remove download
- `POST /pause/:torrentId` - Pause download
- `POST /resume/:torrentId` - Resume download

## 🎨 Customization

### Theme Colors

Edit `web/tailwind.config.js`:

```javascript
colors: {
  'spotify-dark': '#121212',
  'spotify-dark-elevated': '#1a1a1a',
  'spotify-highlight': '#1ed760',
  // Add your custom colors
}
```

### Gradients

Available gradient classes:
- `bg-gradient-purple` - Purple gradient
- `bg-gradient-blue` - Blue gradient
- `bg-gradient-pink` - Pink gradient
- `bg-gradient-green` - Green gradient
- `bg-gradient-orange` - Orange gradient

## 🔧 Configuration

### Jellyfin Setup

1. Install Jellyfin: https://jellyfin.org/downloads
2. Add music to your library
3. Enable API access in settings
4. Create an API key for the app

### Transmission Setup

1. Install Transmission
2. Enable web interface
3. Configure download path
4. Optional: Set up authentication

### Production Deployment

#### Frontend (GitHub Pages)

See detailed guide: [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)

```bash
# Build static site
cd web
npm run build

# The 'out' folder can be deployed anywhere
```

#### Backend (Home Server)

```bash
cd backend
npm start
```

Use PM2 for auto-restart:

```bash
npm install -g pm2
pm2 start src/index.js --name music-backend
pm2 startup
pm2 save
```

Make backend accessible with **Cloudflare Tunnel** (free & secure):

```bash
cloudflared tunnel --url http://localhost:3001
```

## 🐛 Troubleshooting

### Backend won't connect to Jellyfin
- Check Jellyfin URL and API key
- Ensure Jellyfin is running
- Check firewall settings

### Downloads not working
- Verify Transmission is running
- Check Transmission credentials
- Ensure download path exists and is writable

### Can't access from internet
- Use Cloudflare Tunnel (easiest)
- Or set up port forwarding + Dynamic DNS
- See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)

### Audio won't play
- Check Jellyfin streaming settings
- Verify audio file formats are supported
- Check browser/app permissions

## 🛣️ Roadmap

- [ ] Playlist creation and management
- [ ] Lyrics integration
- [ ] PWA support (install as app)
- [ ] Chromecast support
- [ ] Social features (sharing, recommendations)
- [ ] Advanced search filters
- [ ] Theme customization in app
- [ ] Multiple user support
- [ ] Queue management UI

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- **Jellyfin** - Amazing open-source media server
- **Last.fm** - Music metadata and discovery
- **Transmission** - Reliable torrent client
- **Spotify** - UI/UX inspiration

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the troubleshooting guide above
- Review Jellyfin and Transmission documentation

---

**Made with ❤️ for music lovers who want control over their library**

