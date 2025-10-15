'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { FaUser } from 'react-icons/fa'

export default function ArtistsPage() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArtists()
  }, [])

  const loadArtists = async () => {
    try {
      setLoading(true)
      const data = await api.getArtists()
      setArtists(data.Items || [])
    } catch (error) {
      console.error('Failed to load artists:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-8 py-6">
      <h1 className="text-4xl font-bold mb-8">Artists</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-spotify-dark-elevated animate-pulse mb-4" />
              <div className="h-4 w-32 bg-spotify-dark-elevated rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {artists.map((artist: any) => (
            <div
              key={artist.Id}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 bg-gradient-purple group-hover:scale-105 transition-transform shadow-lg">
                {artist.ImageTags?.Primary ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_JELLYFIN_URL}/Items/${artist.Id}/Images/Primary?maxWidth=300`}
                    alt={artist.Name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser size={64} className="text-white opacity-50" />
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-center">{artist.Name}</h3>
              {artist.SongCount && (
                <p className="text-sm text-gray-400">
                  {artist.SongCount} song{artist.SongCount !== 1 && 's'}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && artists.length === 0 && (
        <div className="text-center py-20">
          <FaUser className="text-gray-600 mx-auto mb-4" size={64} />
          <p className="text-xl text-gray-400">No artists in your library yet</p>
        </div>
      )}
    </div>
  )
}


