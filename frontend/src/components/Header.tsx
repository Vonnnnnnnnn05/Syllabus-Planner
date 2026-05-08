import { Menu, Bell, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth()
  const displayName = user?.fullName || 'Guest'
  const displayMeta = user?.department || user?.role || 'User'
  const avatar = user?.avatar || displayName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-academic-border">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-academic-text-muted hover:bg-academic-surface-alt transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-academic-text-muted" />
            <input
              type="text"
              placeholder="Search courses, syllabi, or users..."
              className="w-80 pl-9 pr-4 py-2 rounded-lg bg-academic-bg border border-transparent text-sm text-academic-text placeholder:text-academic-text-muted focus:outline-none focus:border-academic-primary/20 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg text-academic-text-muted hover:bg-academic-surface-alt transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-academic-accent" />
          </button>
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-academic-border">
            <div className="w-8 h-8 rounded-full bg-academic-primary flex items-center justify-center text-xs font-bold text-white">
              {avatar}
            </div>
            <div className="hidden md:block">
              <p className="max-w-40 truncate text-sm font-medium text-academic-text">{displayName}</p>
              <p className="max-w-40 truncate text-xs text-academic-text-muted">{displayMeta}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
