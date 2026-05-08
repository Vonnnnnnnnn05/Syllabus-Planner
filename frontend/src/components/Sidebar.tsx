import { useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Target,
  Scale,
  Sparkles,
  ClipboardCheck,
  Users,
  GraduationCap,
  X,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth } from '../context/AuthContext'
import { LogOut } from 'lucide-react'

interface SidebarProps {
  onClose: () => void
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Courses', icon: BookOpen, path: '/courses' },
  { label: 'Syllabus Planner', icon: CalendarDays, path: '/syllabus-planner' },
  { label: 'Learning Outcomes', icon: Target, path: '/clos' },
  { label: 'Grading System', icon: Scale, path: '/grading' },
  { label: 'AI Companion', icon: Sparkles, path: '/ai-companion' },
  { label: 'My Work Sessions', icon: ClipboardCheck, path: '/approvals' },
  { label: 'User Management', icon: Users, path: '/users' },
]

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-academic-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-academic-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-academic-primary tracking-tight leading-tight">
              Syllabus Planner
            </h1>
            <p className="text-[10px] text-academic-text-muted font-medium tracking-wide uppercase">
              Academic Management
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-md text-academic-text-muted hover:bg-academic-surface-alt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-academic-primary/5 text-academic-primary'
                  : 'text-academic-text-muted hover:bg-academic-surface-alt hover:text-academic-text'
              )}
            >
              <item.icon
                className={cn(
                  'w-[18px] h-[18px] transition-colors',
                  isActive
                    ? 'text-academic-accent'
                    : 'text-academic-text-muted group-hover:text-academic-primary'
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1 h-5 rounded-full bg-academic-accent" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-academic-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-academic-primary flex items-center justify-center text-xs font-bold text-white">
            {user?.avatar || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-academic-text truncate">
              {user?.fullName || 'Guest'}
            </p>
            <p className="text-xs text-academic-text-muted truncate">{user?.role || 'User'}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-md text-academic-text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
