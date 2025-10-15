# ⚡ Quick Start - Get Running in 5 Minutes

Choose your deployment method:

## 🌐 Option 1: GitHub Pages (FREE Hosting - Recommended!)

**Best for:** Accessing your music from anywhere on the internet

1. **Fork this repository** on GitHub

2. **Set up GitHub Pages:**
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"

3. **Add secrets** (Settings → Secrets and variables → Actions):
   - Click "New repository secret"
   - Add `API_URL`: Your backend public URL (see step 4)
   - Add `JELLYFIN_URL`: Your Jellyfin public URL

4. **Set up home server backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your settings
   npm start
   ```

5. **Make backend accessible** (choose one):

   **Option A: Cloudflare Tunnel (Easiest)**
   ```bash
   # Install: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/
   cloudflared tunnel --url http://localhost:3001
   # Copy the generated URL (e.g., https://random.trycloudflare.com)
   # Add to GitHub secrets as API_URL
   ```

   **Option B: Port Forwarding**
   - Get free domain from DuckDNS.org
   - Forward port 3001 on your router
   - Use your DDNS URL as API_URL

6. **Push to trigger deployment:**
   ```bash
   git push
   ```

7. **Access your site:**
   - Visit `https://YOUR_USERNAME.github.io/YOUR_REPO`
   - Works on phone, tablet, desktop!

**Full guide:** See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)

---

## 💻 Option 2: Local Development

**Best for:** Testing locally before deploying

### Prerequisites
- Node.js 18+
- Jellyfin running at http://localhost:8096
- Transmission running at http://localhost:9091

### Steps

```bash
# 1. Clone repository
git clone <your-repo-url>
cd music-streaming-app

# 2. Install dependencies
npm run install:all

# 3. Configure backend
cd backend
cp .env.example .env
# Edit .env with your Jellyfin API key, Last.fm key, etc.

# 4. Configure web
cd ../web
cp .env.local.example .env.local
# Edit if needed (defaults work for local development)

# 5. Start everything
cd ..
npm run dev
```

**Access:** http://localhost:3000

---

## 🐳 Option 3: Docker

**Best for:** Easy all-in-one setup

```bash
# 1. Configure
cp .env.example .env
# Edit .env with your API keys

# 2. Start
docker-compose up -d

# 3. Access
# Web: http://localhost:3000
# Jellyfin: http://localhost:8096 (complete setup wizard)
```

---

## First Time Setup Checklist

After choosing your method above:

- [ ] **Jellyfin Setup:**
  - Access Jellyfin web interface
  - Create admin account
  - Add music library
  - Dashboard → API Keys → Create new key
  - Copy API key and User ID

- [ ] **Last.fm API:**
  - Visit https://www.last.fm/api/account/create
  - Create API application
  - Copy API key and secret

- [ ] **Update Configuration:**
  - Add Jellyfin API key to backend .env
  - Add Last.fm key to backend .env
  - Restart backend

- [ ] **Test:**
  - Browse library (should show Jellyfin content)
  - Search music (should show Last.fm results)
  - Download a song (check Downloads page)
  - Play music (player appears at bottom)

---

## 🎯 Which Option Should I Choose?

| Feature | GitHub Pages | Local Dev | Docker |
|---------|-------------|-----------|--------|
| **Access from anywhere** | ✅ Yes | ❌ No | ❌ No* |
| **Cost** | FREE | FREE | FREE |
| **Setup difficulty** | Medium | Easy | Easy |
| **Mobile friendly** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Best for** | Public access | Development | Clean setup |

*Can be combined with Cloudflare Tunnel for public access

---

## 📱 Mobile Access

All options work on mobile browsers:
- **iOS Safari** ✅
- **Android Chrome** ✅
- **Any mobile browser** ✅

No app store needed! Just visit the URL.

**Tip:** Add to home screen for app-like experience:
- **iOS**: Share → Add to Home Screen
- **Android**: Menu → Add to Home Screen

---

## Troubleshooting

### "Cannot connect to backend"
```bash
# Check backend is running
curl http://localhost:3001/api/health
# Should return: {"status":"ok",...}
```

### "No music in library"
1. Check Jellyfin has music
2. Scan library in Jellyfin
3. Verify API key is correct

### GitHub Actions fails
1. Check you selected "GitHub Actions" as source (not "Deploy from a branch")
2. Verify secrets are added correctly
3. Check Actions tab for detailed error

---

## What's Next?

- 📚 Read [README.md](README.md) for all features
- 🌐 See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) for deployment details
- 🐳 Check [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for Docker setup
- 📖 Review [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed configuration

---

**Ready to stream your music from anywhere! 🎵🚀**
