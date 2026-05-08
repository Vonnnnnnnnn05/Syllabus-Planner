import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { authApi } from '../lib/api'

interface User {
  id: string
  fullName: string
  email: string
  role: string
  avatar: string
  department?: string
}

interface LoginResult {
  success: boolean
  error?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<LoginResult>
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
    const token = localStorage.getItem('syllabus_token')
    if (!token) {
      setUser(null)
      return
    }

    authApi.me()
      .then(({ data }) => setUser(data))
      .catch(() => {
        setUser(null)
        localStorage.removeItem('syllabus_token')
        localStorage.removeItem('syllabus_auth_user')
      })
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('syllabus_auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('syllabus_auth_user')
    }
  }, [user])

  const getLoginErrorMessage = (error: unknown): string => {
    if (!axios.isAxiosError(error)) {
      return 'Something went wrong while signing in.'
    }

    if (!error.response) {
      return 'Cannot connect to the authentication server. Make sure Laravel is running on port 8000.'
    }

    if (error.response.status === 422 || error.response.status === 401) {
      return error.response.data?.message || 'Invalid email or password.'
    }

    if (error.response.status === 419) {
      return 'Login is being blocked by CSRF middleware. Restart Laravel and try again.'
    }

    if (error.response.status >= 500) {
      return 'The authentication server had an error. Check the Laravel logs.'
    }

    return error.response.data?.message || 'Unable to sign in. Please try again.'
  }

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const { data } = await authApi.login(email, password)
      localStorage.setItem('syllabus_token', data.token)
      setUser(data.user)
      return { success: true }
    } catch (error) {
      return { success: false, error: getLoginErrorMessage(error) }
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
