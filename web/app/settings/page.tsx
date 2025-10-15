'use client'

import { useState } from 'react'
import { FaCog, FaServer, FaMusic, FaDownload } from 'react-icons/fa'

export default function SettingsPage() {
  const [jellyfinUrl, setJellyfinUrl] = useState(process.env.NEXT_PUBLIC_JELLYFIN_URL || '')
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In a real app, you'd save these to local storage or user preferences
    localStorage.setItem('jellyfinUrl', jellyfinUrl)
    localStorage.setItem('apiUrl', apiUrl)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="px-8 py-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Server Settings */}
        <section className="bg-spotify-dark-elevated p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <FaServer className="text-2xl mr-3 text-spotify-highlight" />
            <h2 className="text-2xl font-semibold">Server Configuration</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Backend API URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:3001"
                className="w-full bg-spotify-dark px-4 py-3 rounded border border-gray-700 focus:border-spotify-highlight outline-none"
              />
              <p className="text-sm text-gray-400 mt-1">
                URL of your backend API server
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Jellyfin Server URL
              </label>
              <input
                type="text"
                value={jellyfinUrl}
                onChange={(e) => setJellyfinUrl(e.target.value)}
                placeholder="http://localhost:8096"
                className="w-full bg-spotify-dark px-4 py-3 rounded border border-gray-700 focus:border-spotify-highlight outline-none"
              />
              <p className="text-sm text-gray-400 mt-1">
                URL of your Jellyfin media server
              </p>
            </div>
          </div>
        </section>

        {/* Playback Settings */}
        <section className="bg-spotify-dark-elevated p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <FaMusic className="text-2xl mr-3 text-spotify-purple" />
            <h2 className="text-2xl font-semibold">Playback</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Gapless Playback</p>
                <p className="text-sm text-gray-400">Seamless transitions between tracks</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-spotify-highlight peer-focus:ring-2 peer-focus:ring-spotify-highlight transition"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Crossfade</p>
                <p className="text-sm text-gray-400">Fade between songs</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-spotify-highlight peer-focus:ring-2 peer-focus:ring-spotify-highlight transition"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-play similar songs</p>
                <p className="text-sm text-gray-400">When your music ends</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-spotify-highlight peer-focus:ring-2 peer-focus:ring-spotify-highlight transition"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Download Settings */}
        <section className="bg-spotify-dark-elevated p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <FaDownload className="text-2xl mr-3 text-spotify-pink" />
            <h2 className="text-2xl font-semibold">Downloads</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Download Quality
              </label>
              <select className="w-full bg-spotify-dark px-4 py-3 rounded border border-gray-700 focus:border-spotify-highlight outline-none">
                <option>320 kbps (High Quality)</option>
                <option>256 kbps</option>
                <option>192 kbps</option>
                <option>128 kbps</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Automatic Organization</p>
                <p className="text-sm text-gray-400">Organize downloads by artist/album</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-spotify-highlight peer-focus:ring-2 peer-focus:ring-spotify-highlight transition"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-spotify-highlight text-black font-semibold py-4 rounded-full hover:scale-105 transition-transform"
        >
          {saved ? 'Settings Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}


