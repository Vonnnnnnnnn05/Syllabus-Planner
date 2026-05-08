import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../lib/api'

interface User {
  id: string
  fullName: string
  email: string
  role: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('syllabus_auth_user')
    return saved ? JSON.parse(saved) : null
  })

  const isAuthenticated = !!user

  useEffect(() => {
    if (user) {
      localStorage.setItem('syllabus_auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('syllabus_auth_user')
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await authApi.login(email, password)
      localStorage.setItem('syllabus_token', data.token)
      setUser(data.user)
      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore
    }
    setUser(null)
    localStorage.removeItem('syllabus_token')
    localStorage.removeItem('syllabus_auth_user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
