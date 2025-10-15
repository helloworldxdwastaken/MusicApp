'use client'

import { usePlayerStore } from '@/store/playerStore'
import { FaPlay } from 'react-icons/fa'
import { useState } from 'react'

interface AlbumCardProps {
  id: string
  title: string
  artist: string
  image: string
  type: 'jellyfin' | 'lastfm'
}

export default function AlbumCard({ id, title, artist, image, type }: AlbumCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { setCurrentTrack, setIsPlaying } = usePlayerStore()

  const handlePlay = async () => {
    if (type === 'jellyfin') {
      const streamUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/jellyfin/stream/${id}`
      setCurrentTrack({
        id,
        title,
        artist,
        image,
        streamUrl,
        type
      })
      setIsPlaying(true)
    }
  }

  return (
    <div
      className="bg-spotify-dark-elevated p-4 rounded-lg cursor-pointer card-hover relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4">
        <img
          src={image}
          alt={title}
          className="w-full aspect-square object-cover rounded-md shadow-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-album.png'
          }}
        />
        {isHovered && type === 'jellyfin' && (
          <button
            onClick={handlePlay}
            className="absolute bottom-2 right-2 w-12 h-12 bg-spotify-highlight rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            <FaPlay className="text-black ml-0.5" size={16} />
          </button>
        )}
      </div>
      <h3 className="font-semibold truncate mb-1">{title}</h3>
      <p className="text-sm text-gray-400 truncate">{artist}</p>
    </div>
  )
}


