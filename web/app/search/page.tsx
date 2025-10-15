'use client'

import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { api } from '@/lib/api'
import AlbumCard from '@/components/AlbumCard'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'track' | 'album' | 'artist'>('track')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const data = await api.searchMusic(query, searchType)
      setResults(data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderResults = () => {
    if (!results) return null

    let items: any[] = []
    
    if (searchType === 'track' && results.results?.trackmatches?.track) {
      items = results.results.trackmatches.track
    } else if (searchType === 'album' && results.results?.albummatches?.album) {
      items = results.results.albummatches.album
    } else if (searchType === 'artist' && results.results?.artistmatches?.artist) {
      items = results.results.artistmatches.artist
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((item: any, index: number) => (
          <AlbumCard
            key={index}
            id={item.mbid || `${searchType}-${index}`}
            title={item.name}
            artist={item.artist || ''}
            image={item.image?.[3]?.['#text'] || '/placeholder-album.png'}
            type="lastfm"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="px-8 py-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Search</h1>
        
        <form onSubmit={handleSearch} className="max-w-3xl">
          <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg">
            <div className="pl-6 pr-4">
              <FaSearch className="text-gray-500" size={20} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              className="flex-1 py-4 text-black outline-none text-lg"
            />
            <button
              type="submit"
              className="bg-spotify-highlight text-black px-8 py-4 font-semibold hover:bg-opacity-90 transition"
            >
              Search
            </button>
          </div>

          {/* Search Type Filters */}
          <div className="flex gap-3 mt-4">
            {(['track', 'album', 'artist'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSearchType(type)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  searchType === type
                    ? 'bg-white text-black'
                    : 'bg-spotify-dark-elevated text-white hover:bg-gray-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Results */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-spotify-dark-elevated h-64 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!loading && results && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Results for "{query}"
          </h2>
          {renderResults()}
        </div>
      )}

      {!loading && !results && (
        <div className="text-center py-20">
          <FaSearch className="text-gray-600 mx-auto mb-4" size={64} />
          <p className="text-xl text-gray-400">
            Search for your favorite music worldwide
          </p>
        </div>
      )}
    </div>
  )
}


