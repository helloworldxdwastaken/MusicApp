'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { FaDownload, FaPause, FaPlay, FaTrash } from 'react-icons/fa'

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDownloads()
    const interval = setInterval(loadDownloads, 3000) // Refresh every 3 seconds
    return () => clearInterval(interval)
  }, [])

  const loadDownloads = async () => {
    try {
      const data = await api.getDownloads()
      setDownloads(data)
    } catch (error) {
      console.error('Failed to load downloads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePause = async (torrentId: number) => {
    try {
      await api.pauseDownload(torrentId)
      await loadDownloads()
    } catch (error) {
      console.error('Failed to pause download:', error)
    }
  }

  const handleResume = async (torrentId: number) => {
    try {
      await api.resumeDownload(torrentId)
      await loadDownloads()
    } catch (error) {
      console.error('Failed to resume download:', error)
    }
  }

  const handleRemove = async (torrentId: number) => {
    if (!confirm('Are you sure you want to remove this download?')) return
    
    try {
      await api.removeDownload(torrentId)
      await loadDownloads()
    } catch (error) {
      console.error('Failed to remove download:', error)
    }
  }

  const formatSpeed = (bytesPerSecond: number) => {
    const mbps = bytesPerSecond / (1024 * 1024)
    return `${mbps.toFixed(2)} MB/s`
  }

  const formatSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    const mb = bytes / (1024 * 1024)
    return gb >= 1 ? `${gb.toFixed(2)} GB` : `${mb.toFixed(2)} MB`
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'text-yellow-500' // Paused
      case 4: return 'text-green-500' // Downloading
      case 6: return 'text-blue-500' // Seeding
      default: return 'text-gray-500'
    }
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Paused'
      case 1: return 'Check waiting'
      case 2: return 'Checking'
      case 3: return 'Download waiting'
      case 4: return 'Downloading'
      case 5: return 'Seed waiting'
      case 6: return 'Seeding'
      default: return 'Unknown'
    }
  }

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Downloads</h1>
        <div className="text-gray-400">
          {downloads.length} active download{downloads.length !== 1 && 's'}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-spotify-dark-elevated h-24 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : downloads.length > 0 ? (
        <div className="space-y-4">
          {downloads.map((download: any) => (
            <div
              key={download.id}
              className="bg-spotify-dark-elevated p-6 rounded-lg hover:bg-opacity-80 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{download.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className={getStatusColor(download.status)}>
                      {getStatusText(download.status)}
                    </span>
                    <span>{formatSize(download.downloadedEver)} / {formatSize(download.totalSize)}</span>
                    {download.rateDownload > 0 && (
                      <span className="text-green-400">
                        ↓ {formatSpeed(download.rateDownload)}
                      </span>
                    )}
                    {download.rateUpload > 0 && (
                      <span className="text-blue-400">
                        ↑ {formatSpeed(download.rateUpload)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {download.status === 4 ? (
                    <button
                      onClick={() => handlePause(download.id)}
                      className="p-3 bg-yellow-600 rounded-full hover:bg-yellow-700 transition"
                    >
                      <FaPause />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleResume(download.id)}
                      className="p-3 bg-green-600 rounded-full hover:bg-green-700 transition"
                    >
                      <FaPlay />
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(download.id)}
                    className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-green transition-all duration-300"
                  style={{ width: `${(download.percentDone * 100).toFixed(2)}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-400 text-right">
                {(download.percentDone * 100).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <FaDownload className="text-gray-600 mx-auto mb-4" size={64} />
          <p className="text-xl text-gray-400">No active downloads</p>
          <p className="text-gray-500 mt-2">Search for music and start downloading</p>
        </div>
      )}
    </div>
  )
}


