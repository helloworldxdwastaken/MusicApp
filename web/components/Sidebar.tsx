'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaSearch, FaMusic, FaDownload, FaCog, FaCompactDisc } from 'react-icons/fa'

const navItems = [
  { name: 'Home', path: '/', icon: FaHome },
  { name: 'Search', path: '/search', icon: FaSearch },
  { name: 'Your Library', path: '/library', icon: FaMusic },
  { name: 'Artists', path: '/artists', icon: FaCompactDisc },
  { name: 'Downloads', path: '/downloads', icon: FaDownload },
  { name: 'Settings', path: '/settings', icon: FaCog },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-black flex flex-col p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold gradient-text">MusicStream</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-spotify-dark-elevated text-white'
                      : 'text-gray-400 hover:text-white hover:bg-spotify-dark-elevated'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-800">
        <div className="bg-gradient-purple p-4 rounded-lg">
          <h3 className="font-bold mb-1">Server Status</h3>
          <p className="text-sm opacity-80">Connected to Jellyfin</p>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <span className="text-xs">Online</span>
          </div>
        </div>
      </div>
    </aside>
  )
}


