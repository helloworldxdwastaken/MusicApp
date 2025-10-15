import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const api = {
  // Jellyfin endpoints
  getLibraries: async () => {
    const response = await apiClient.get('/api/jellyfin/libraries')
    return response.data
  },

  getArtists: async () => {
    const response = await apiClient.get('/api/jellyfin/artists')
    return response.data
  },

  getAlbums: async (artistId?: string, limit = 50, startIndex = 0) => {
    const response = await apiClient.get('/api/jellyfin/albums', {
      params: { artistId, limit, startIndex },
    })
    return response.data
  },

  getAlbumTracks: async (albumId: string) => {
    const response = await apiClient.get(`/api/jellyfin/albums/${albumId}/tracks`)
    return response.data
  },

  getRecentMusic: async () => {
    const response = await apiClient.get('/api/jellyfin/recent')
    return response.data
  },

  searchJellyfin: async (query: string) => {
    const response = await apiClient.get('/api/jellyfin/search', {
      params: { query },
    })
    return response.data
  },

  getStreamUrl: async (itemId: string) => {
    const response = await apiClient.get(`/api/jellyfin/stream/${itemId}`)
    return response.data
  },

  getImageUrl: async (itemId: string, type = 'Primary', maxWidth = 400) => {
    const response = await apiClient.get(`/api/jellyfin/image/${itemId}`, {
      params: { type, maxWidth },
    })
    return response.data
  },

  // Search endpoints
  searchMusic: async (query: string, type = 'track', limit = 30) => {
    const response = await apiClient.get('/api/search/music', {
      params: { query, type, limit },
    })
    return response.data
  },

  getTrackInfo: async (artist: string, track: string) => {
    const response = await apiClient.get(`/api/search/track/${artist}/${track}`)
    return response.data
  },

  getAlbumInfo: async (artist: string, album: string) => {
    const response = await apiClient.get(`/api/search/album/${artist}/${album}`)
    return response.data
  },

  getArtistInfo: async (artist: string) => {
    const response = await apiClient.get(`/api/search/artist/${artist}`)
    return response.data
  },

  getTopTracks: async (limit = 50) => {
    const response = await apiClient.get('/api/search/top/tracks', {
      params: { limit },
    })
    return response.data
  },

  // Download endpoints
  addDownload: async (magnetLink: string, torrentUrl?: string, artist?: string, album?: string) => {
    const response = await apiClient.post('/api/download/add', {
      magnetLink,
      torrentUrl,
      artist,
      album,
    })
    return response.data
  },

  getDownloads: async () => {
    const response = await apiClient.get('/api/download/list')
    return response.data
  },

  getDownloadStatus: async (torrentId: number) => {
    const response = await apiClient.get(`/api/download/status/${torrentId}`)
    return response.data
  },

  removeDownload: async (torrentId: number, deleteData = false) => {
    const response = await apiClient.delete(`/api/download/remove/${torrentId}`, {
      params: { deleteData },
    })
    return response.data
  },

  pauseDownload: async (torrentId: number) => {
    const response = await apiClient.post(`/api/download/pause/${torrentId}`)
    return response.data
  },

  resumeDownload: async (torrentId: number) => {
    const response = await apiClient.post(`/api/download/resume/${torrentId}`)
    return response.data
  },
}


