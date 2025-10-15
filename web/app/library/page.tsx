'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import AlbumCard from '@/components/AlbumCard'

export default function LibraryPage() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadAlbums()
  }, [])

  const loadAlbums = async () => {
    try {
      setLoading(true)
      const data = await api.getAlbums()
      setAlbums(data.Items || [])
    } catch (error) {
      console.error('Failed to load albums:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Your Library</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView('grid')}
            className={`px-4 py-2 rounded ${
              view === 'grid'
                ? 'bg-white text-black'
                : 'bg-spotify-dark-elevated hover:bg-gray-700'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded ${
              view === 'list'
                ? 'bg-white text-black'
                : 'bg-spotify-dark-elevated hover:bg-gray-700'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Albums Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-spotify-dark-elevated h-64 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>
          {albums.map((album: any) => (
            <AlbumCard
              key={album.Id}
              id={album.Id}
              title={album.Name}
              artist={album.AlbumArtist || album.Artists?.[0] || 'Unknown Artist'}
              image={
                album.ImageTags?.Primary
                  ? `${process.env.NEXT_PUBLIC_JELLYFIN_URL}/Items/${album.Id}/Images/Primary?maxWidth=400`
                  : '/placeholder-album.png'
              }
              type="jellyfin"
            />
          ))}
        </div>
      )}

      {!loading && albums.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400">No albums in your library yet</p>
          <p className="text-gray-500 mt-2">Start adding music to see it here</p>
        </div>
      )}
    </div>
  )
}


