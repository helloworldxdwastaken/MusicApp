import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Player from '@/components/Player'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Music Stream - Your Personal Music Library',
  description: 'Stream your music from anywhere',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-spotify-dark text-white overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto pb-24">
            {children}
          </main>
        </div>
        <Player />
      </body>
    </html>
  )
}


