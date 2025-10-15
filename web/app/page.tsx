'use client'

import { useEffect, useState } from 'react'
import AlbumCard from '@/components/AlbumCard'
import { api } from '@/lib/api'

export default function Home() {
  const [recentMusic, setRecentMusic] = useState([])
  const [topTracks, setTopTracks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [recent, top] = await Promise.all([
        api.getRecentMusic(),
        api.getTopTracks()
      ])
      setRecentMusic(recent.slice(0, 6))
      setTopTracks(top.tracks?.track?.slice(0, 6) || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-8 py-6">
      {/* Hero Section with Gradient */}
      <div className="relative h-80 mb-8 rounded-lg overflow-hidden bg-gradient-purple">
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative z-10 h-full flex flex-col justify-end p-8">
          <h1 className="text-6xl font-bold mb-4">Welcome Back</h1>
          <p className="text-xl opacity-90">Your personal music streaming library</p>
        </div>
      </div>

      {/* Recently Added Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Recently Added</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-spotify-dark-elevated h-64 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentMusic.map((item: any) => (
              <AlbumCard
                key={item.Id}
                id={item.Id}
                title={item.Name}
                artist={item.AlbumArtist || item.Artists?.[0]}
                image={item.ImageTags?.Primary ? 
                  `${process.env.NEXT_PUBLIC_JELLYFIN_URL}/Items/${item.Id}/Images/Primary?maxWidth=400` : 
                  '/placeholder-album.png'
                }
                type="jellyfin"
              />
            ))}
          </div>
        )}
      </section>

      {/* Top Tracks Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Trending Worldwide</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-spotify-dark-elevated h-64 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topTracks.map((track: any, index: number) => (
              <AlbumCard
                key={index}
                id={track.mbid}
                title={track.name}
                artist={track.artist?.name}
                image={track.image?.[3]?.['#text'] || '/placeholder-album.png'}
                type="lastfm"
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick Access Cards */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-blue p-6 rounded-lg cursor-pointer card-hover">
            <h3 className="text-xl font-bold mb-2">Your Library</h3>
            <p className="opacity-80">Browse all your music</p>
          </div>
          <div className="bg-gradient-pink p-6 rounded-lg cursor-pointer card-hover">
            <h3 className="text-xl font-bold mb-2">Discover</h3>
            <p className="opacity-80">Find new music</p>
          </div>
          <div className="bg-gradient-green p-6 rounded-lg cursor-pointer card-hover">
            <h3 className="text-xl font-bold mb-2">Downloads</h3>
            <p className="opacity-80">Manage your downloads</p>
          </div>
          <div className="bg-gradient-orange p-6 rounded-lg cursor-pointer card-hover">
            <h3 className="text-xl font-bold mb-2">Settings</h3>
            <p className="opacity-80">Configure your server</p>
          </div>
        </div>
      </section>
    </div>
  )
}


