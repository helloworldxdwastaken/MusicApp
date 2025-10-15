# 🌐 GitHub Pages Deployment Guide

Deploy your MusicStream frontend to GitHub Pages for free, while running the backend on your home server!

## Architecture

```
┌─────────────────────────────────────┐
│   GitHub Pages (Frontend)           │
│   - Static HTML/CSS/JS              │
│   - Responsive web app              │
│   - Works on mobile browsers        │
│   https://username.github.io        │
└──────────────┬──────────────────────┘
               │ API Calls
               ▼
┌─────────────────────────────────────┐
│   Your Home Server (Backend)        │
│   - Node.js API                     │
│   - Jellyfin connection             │
│   - Torrent downloads               │
│   - Music streaming                 │
│   http://your-home-ip:3001          │
└─────────────────────────────────────┘
```

## Quick Setup (5 Steps)

### 1. Fork/Create Repository

1. Create a new repository on GitHub
2. Push this code to your repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**
   - (Don't select "Deploy from a branch")

### 3. Set Up Secrets

Your backend API URL needs to be accessible from the internet. You have two options:

#### Option A: Use Dynamic DNS + Port Forwarding (Recommended)

1. Set up Dynamic DNS (use services like DuckDNS, No-IP, or your router's DDNS)
2. Port forward port 3001 on your router to your server
3. Add secrets to GitHub:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Add:
     - `API_URL`: `https://your-domain.duckdns.org:3001` (or your DDNS URL)
     - `JELLYFIN_URL`: `https://your-domain.duckdns.org:8096`

#### Option B: Use Cloudflare Tunnel (Free, More Secure)

1. Install Cloudflare Tunnel on your server: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/
2. Expose your backend:
   ```bash
   cloudflared tunnel --url http://localhost:3001
   ```
3. Get the tunnel URL (e.g., `https://random-name.trycloudflare.com`)
4. Add to GitHub secrets:
   - `API_URL`: Your tunnel URL
   - `JELLYFIN_URL`: Your Jellyfin tunnel URL (or public URL)

### 4. Update Next.js Config (If Using Subdirectory)

If your site will be at `https://username.github.io/repo-name/` (not the root), edit `web/next.config.js`:

```javascript
const nextConfig = {
  // ... existing config
  basePath: '/your-repo-name',
  assetPrefix: '/your-repo-name/',
}
```

### 5. Deploy!

```bash
git add .
git commit -m "Configure for GitHub Pages"
git push
```

GitHub Actions will automatically build and deploy your site!

## Accessing Your Site

- **Production URL**: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
- **Custom Domain**: Configure in GitHub Pages settings

The website will work on:
- ✅ Desktop browsers
- ✅ Mobile browsers (iOS Safari, Android Chrome)
- ✅ Tablets
- ✅ Any device with a browser!

## Setting Up Your Home Server

### 1. Install Backend

On your home server (Windows/Mac/Linux):

```bash
cd backend
npm install
cp .env.example .env
```

### 2. Configure Environment

Edit `backend/.env`:

```env
PORT=3001

# Jellyfin (local)
JELLYFIN_URL=http://localhost:8096
JELLYFIN_API_KEY=your_jellyfin_api_key
JELLYFIN_USER_ID=your_jellyfin_user_id

# Transmission (local)
TRANSMISSION_HOST=localhost
TRANSMISSION_PORT=9091
DOWNLOAD_PATH=/path/to/music

# Last.fm
LASTFM_API_KEY=your_lastfm_key
LASTFM_API_SECRET=your_lastfm_secret

# IMPORTANT: Allow your GitHub Pages domain
ALLOWED_ORIGINS=https://YOUR_USERNAME.github.io
```

### 3. Start Backend

```bash
npm start
```

Or use PM2 for auto-restart:

```bash
npm install -g pm2
pm2 start src/index.js --name music-backend
pm2 startup  # Enable on boot
pm2 save
```

## Making Backend Accessible

### Option 1: Cloudflare Tunnel (Easiest & Secure)

```bash
# Install cloudflared
# Windows: Download from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
# Mac: brew install cloudflare/cloudflare/cloudflared
# Linux: wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && sudo dpkg -i cloudflared-linux-amd64.deb

# Run tunnel
cloudflared tunnel --url http://localhost:3001
```

Copy the generated URL and update GitHub secrets!

### Option 2: Port Forwarding + Dynamic DNS

1. **Get a free domain:**
   - DuckDNS: https://www.duckdns.org/
   - No-IP: https://www.noip.com/

2. **Port forward on your router:**
   - Forward port 3001 → your server's local IP
   - Forward port 8096 → your server (for Jellyfin)

3. **Set up HTTPS (optional but recommended):**
   ```bash
   # Install nginx
   sudo apt install nginx certbot python3-certbot-nginx

   # Configure nginx reverse proxy
   sudo nano /etc/nginx/sites-available/musicstream

   # Get SSL certificate
   sudo certbot --nginx -d your-domain.duckdns.org
   ```

## CORS Configuration

Since your frontend is on GitHub Pages and backend is on your server, you need CORS configured.

Your `backend/.env` should have:

```env
ALLOWED_ORIGINS=https://YOUR_USERNAME.github.io,https://YOUR_CUSTOM_DOMAIN
```

## Testing Locally Before Deploy

Test the static export locally:

```bash
cd web
npm run build
npx serve out
```

Visit http://localhost:3000 to test!

## Updating Your Site

Just push to GitHub:

```bash
git add .
git commit -m "Update site"
git push
```

GitHub Actions automatically rebuilds and deploys!

## Troubleshooting

### "Cannot connect to backend"

1. **Check backend is running:**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Check backend is accessible externally:**
   - Visit your public URL/api/health in browser
   - Should return: `{"status":"ok",...}`

3. **Check CORS:**
   - Open browser console (F12)
   - Look for CORS errors
   - Verify ALLOWED_ORIGINS in backend .env

### "Failed to load resource" errors

1. **If using subdirectory**, make sure `basePath` is set in next.config.js
2. Clear GitHub Pages cache
3. Hard refresh browser (Ctrl+Shift+R)

### GitHub Actions fails

1. Check Actions tab for error details
2. Verify secrets are set correctly
3. Make sure you selected "GitHub Actions" as source in Pages settings

## Custom Domain

1. Buy a domain (or use free subdomain from Freenom)
2. Add CNAME record pointing to `username.github.io`
3. In GitHub repo settings → Pages → Custom domain
4. Enter your domain and save

## Security Considerations

✅ **Recommended:**
- Use HTTPS for backend (Cloudflare Tunnel or Let's Encrypt)
- Keep backend API key secure
- Use strong Jellyfin/Transmission passwords
- Limit ALLOWED_ORIGINS to your actual domain

⚠️ **Don't:**
- Expose backend without HTTPS
- Share API keys publicly
- Allow CORS from *

## Mobile Experience

Your site automatically works on mobile:
- Install as PWA (Add to Home Screen)
- Full-screen experience
- Touch-optimized controls
- Responsive design

No app store fees needed!

## Local Development

When developing locally:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd web
npm run dev
```

Frontend at http://localhost:3000 will connect to local backend at http://localhost:3001

## Advanced: Custom Backend URL Per Environment

Create `web/.env.local` for local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_JELLYFIN_URL=http://localhost:8096
```

GitHub Actions will use the secrets for production!

## Cost Breakdown

- **GitHub Pages**: FREE
- **Domain (optional)**: $10-15/year
- **Cloudflare**: FREE
- **DuckDNS**: FREE
- **Let's Encrypt**: FREE
- **Total**: $0 (or ~$12/year with custom domain)

---

**You now have a free Spotify-like music streaming service! 🎉**

Questions? Open an issue on GitHub!


