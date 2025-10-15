# 🚀 How to Run This Project

Choose one option:

---

## 🌐 Option 1: GitHub Pages (Access from Anywhere - FREE!)

**This lets you access your music from any device, anywhere!**

### Step 1: Get Last.fm API Key (Free)
1. Go to https://www.last.fm/api/account/create
2. Fill in the form (use any info)
3. Copy your **API Key** and **Shared Secret**

### Step 2: Set Up Your Home Server Backend

```bash
# 1. Open terminal in the project folder
cd backend

# 2. Install dependencies
npm install

# 3. Create config file
copy .env.example .env     # Windows
# OR
cp .env.example .env       # Mac/Linux

# 4. Edit .env file and add:
# - Your Last.fm API key
# - Your Jellyfin URL (if you have Jellyfin running)
# - Save the file

# 5. Start the backend
npm start
```

**Backend is now running on port 3001!**

### Step 3: Make Backend Accessible from Internet

**Option A: Cloudflare Tunnel (Easiest)**
```bash
# Download cloudflared from:
# https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/

# Run this command:
cloudflared tunnel --url http://localhost:3001

# It will give you a URL like: https://random-name.trycloudflare.com
# COPY THIS URL - you'll need it!
```

**Option B: Use ngrok (Alternative)**
```bash
# Download from: https://ngrok.com/download

# Run:
ngrok http 3001

# Copy the https URL it gives you
```

### Step 4: Deploy to GitHub Pages

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Create a new repository (name it whatever you want)
   - Don't initialize with README

2. **Push your code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repo on GitHub
   - Click **Settings** → **Pages**
   - Under "Build and deployment"
   - Source: Select **GitHub Actions**

4. **Add Your Backend URL:**
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `API_URL`
   - Value: The URL from Step 3 (e.g., `https://random-name.trycloudflare.com`)
   - Click **Add secret**
   - Add another secret:
     - Name: `JELLYFIN_URL`
     - Value: Your Jellyfin URL (or same as API_URL if you don't have Jellyfin yet)

5. **Deploy:**
   - Just push any change to trigger deployment:
   ```bash
   git commit --allow-empty -m "Deploy"
   git push
   ```
   - Wait 2-3 minutes
   - Visit: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

**Done! Your music app is live on the internet!** 🎉

---

## 💻 Option 2: Run Locally (Testing Only)

**This only works on your computer and devices on the same WiFi**

### Quick Start:

```bash
# 1. Install everything
npm run install:all

# 2. Set up backend
cd backend
copy .env.example .env     # Windows
# OR  
cp .env.example .env       # Mac/Linux

# Edit .env and add your Last.fm API key (get from https://www.last.fm/api)

# 3. Go back and start everything
cd ..
npm run dev
```

**Open http://localhost:3000** in your browser!

**To access from your phone (same WiFi):**
1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` (look for inet)
2. On your phone, open: `http://YOUR_IP:3000`

---

## ⚙️ What You Need

### Required:
- ✅ **Node.js 18+** - Download from https://nodejs.org/
- ✅ **Last.fm API Key** - Free from https://www.last.fm/api

### Optional (for full features):
- **Jellyfin** - For your music library (https://jellyfin.org/)
- **Transmission** - For downloading music (https://transmissionbt.com/)

---

## 🎵 Using Without Jellyfin

You can still use the app without Jellyfin:
- ✅ Search worldwide music (Last.fm)
- ✅ Browse top tracks
- ✅ Download music (if Transmission is set up)
- ❌ Won't have "Your Library" until you set up Jellyfin

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Make sure Node.js is installed
node --version    # Should show v18 or higher

# Make sure you're in the backend folder
cd backend
npm install
```

### "Cannot connect to backend"
- Make sure backend is running (you should see "🚀 Backend server running...")
- Check the backend URL in your GitHub secrets matches your Cloudflare/ngrok URL

### Web app shows blank page
```bash
# Make sure you're in the web folder
cd web
npm install
npm run dev
```

---

## 📱 Mobile Access

The website works perfectly on phones:
- Just visit the URL in your mobile browser
- Tap "Add to Home Screen" for app-like experience
- Works on iPhone, Android, any phone with a browser!

---

## 🎯 Quick Commands Reference

```bash
# Start backend only
cd backend && npm start

# Start web only (for development)
cd web && npm run dev

# Start both (development)
npm run dev

# Build for GitHub Pages
cd web && npm run build
```

---

## 💡 Tips

1. **Keep backend running:** Use PM2 or just keep the terminal open
2. **Cloudflare tunnel:** Run it whenever you want to access from outside
3. **Free hosting:** GitHub Pages is completely free, no credit card needed!

---

**Need more help?** Check:
- [QUICK_START.md](QUICK_START.md) - More detailed instructions
- [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) - Complete GitHub Pages guide
- [README.md](README.md) - Full documentation

**Ready to stream your music! 🎵**

