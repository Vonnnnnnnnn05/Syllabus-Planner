import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('mjdaday@sku.edu.ph')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }
    setLoading(true)
    const success = await login(email, password)
    setLoading(false)
    if (success) {
      toast.success('Welcome back!')
      navigate('/')
    } else {
      toast.error('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-academic-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-academic-primary flex items-center justify-center mx-auto mb-4 shadow-elevated">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-academic-primary tracking-tight">
            Syllabus Planner
          </h1>
          <p className="text-sm text-academic-text-muted mt-1">
            AI-Powered Academic Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="card-elevated">
          <h2 className="text-lg font-semibold text-academic-primary mb-1">Sign In</h2>
          <p className="text-sm text-academic-text-muted mb-6">
            Enter your credentials to access your workspace.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-academic-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@sku.edu.ph"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-academic-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-academic-text-muted hover:text-academic-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-academic-text-muted cursor-pointer">
                <input type="checkbox" className="rounded border-academic-border text-academic-primary focus:ring-academic-primary" />
                Remember me
              </label>
              <button type="button" className="text-academic-accent hover:text-academic-accent-dark font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 justify-center disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-academic-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-academic-text-muted mb-3 text-center">
              Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { email: 'mjdaday@sku.edu.ph', role: 'Teacher' },
                { email: 'rbc@sku.edu.ph', role: 'Program Chair' },
                { email: 'eoa@sku.edu.ph', role: 'Dean' },
                { email: 'vev@sku.edu.ph', role: 'Admin' },
              ].map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => { setEmail(acc.email); setPassword('password') }}
                  className="text-left px-3 py-2 rounded-lg bg-academic-bg hover:bg-academic-surface-alt border border-academic-border hover:border-academic-primary/20 transition-all"
                >
                  <p className="text-xs font-medium text-academic-text truncate">{acc.email}</p>
                  <p className="text-[10px] text-academic-text-muted">{acc.role}</p>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-academic-text-muted text-center mt-2">Password for all: <span className="font-mono text-academic-accent">password</span></p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-academic-text-muted text-center mt-6">
          Sultan Kudarat State University · College of Computing and IT
        </p>
      </div>
    </div>
  )
}
