import { create } from 'zustand'

interface Track {
  id: string
  title: string
  artist: string
  album?: string
  image?: string
  streamUrl: string
  type: 'jellyfin' | 'lastfm' | 'local'
}

interface PlayerState {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  volume: number
  progress: number
  duration: number
  repeat: 'off' | 'one' | 'all'
  shuffle: boolean

  setCurrentTrack: (track: Track) => void
  setQueue: (queue: Track[]) => void
  setIsPlaying: (isPlaying: boolean) => void
  setVolume: (volume: number) => void
  setProgress: (progress: number) => void
  setDuration: (duration: number) => void
  setRepeat: (repeat: 'off' | 'one' | 'all') => void
  setShuffle: (shuffle: boolean) => void
  nextTrack: () => void
  previousTrack: () => void
  addToQueue: (track: Track) => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 70,
  progress: 0,
  duration: 0,
  repeat: 'off',
  shuffle: false,

  setCurrentTrack: (track) => set({ currentTrack: track, progress: 0 }),
  setQueue: (queue) => set({ queue }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),
  setRepeat: (repeat) => set({ repeat }),
  setShuffle: (shuffle) => set({ shuffle }),

  nextTrack: () => {
    const { queue, currentTrack } = get()
    if (queue.length === 0) return

    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id)
    const nextIndex = (currentIndex + 1) % queue.length
    set({ currentTrack: queue[nextIndex], progress: 0, isPlaying: true })
  },

  previousTrack: () => {
    const { queue, currentTrack, progress } = get()
    if (progress > 3) {
      set({ progress: 0 })
      return
    }

    if (queue.length === 0) return

    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id)
    const previousIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1
    set({ currentTrack: queue[previousIndex], progress: 0, isPlaying: true })
  },

  addToQueue: (track) => {
    const { queue } = get()
    set({ queue: [...queue, track] })
  },
}))


