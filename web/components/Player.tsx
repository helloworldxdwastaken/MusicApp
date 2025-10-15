'use client'

import { useEffect, useRef } from 'react'
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaHeart } from 'react-icons/fa'
import { usePlayerStore } from '@/store/playerStore'

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    setIsPlaying,
    setProgress,
    setDuration,
    nextTrack,
    previousTrack,
  } = usePlayerStore()

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentTrack])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setProgress(time)
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!currentTrack) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-spotify-dark-elevated border-t border-gray-800 px-4 py-3">
      <audio
        ref={audioRef}
        src={currentTrack.streamUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
      />

      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        {/* Track Info */}
        <div className="flex items-center space-x-4 w-1/4">
          {currentTrack.image && (
            <img
              src={currentTrack.image}
              alt={currentTrack.title}
              className="w-14 h-14 rounded"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{currentTrack.title}</p>
            <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
          </div>
          <button className="text-gray-400 hover:text-white">
            <FaHeart />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center space-x-6 mb-2">
            <button
              onClick={previousTrack}
              className="text-gray-400 hover:text-white transition"
            >
              <FaStepBackward size={20} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition"
            >
              {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} className="ml-0.5" />}
            </button>
            <button
              onClick={nextTrack}
              className="text-gray-400 hover:text-white transition"
            >
              <FaStepForward size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full max-w-2xl">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(progress)}
            </span>
            <input
              type="range"
              min="0"
              max={audioRef.current?.duration || 0}
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-400 w-10">
              {formatTime(audioRef.current?.duration || 0)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-end space-x-3 w-1/4">
          <FaVolumeUp className="text-gray-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => usePlayerStore.setState({ volume: parseInt(e.target.value) })}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .slider:hover::-webkit-slider-thumb {
          background: #1ed760;
        }

        .slider:hover::-moz-range-thumb {
          background: #1ed760;
        }
      `}</style>
    </div>
  )
}

