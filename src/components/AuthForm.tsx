'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AuthFormProps {
  type: 'login' | 'signup'
  onSuccess?: () => void
  redirectTo?: string
}

export default function AuthForm({ type, onSuccess, redirectTo = '/dashboard' }: AuthFormProps) {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      return false
    }

    if (type === 'signup') {
      if (!formData.name) {
        setError('Name is required')
        return false
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const payload = type === 'login' 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Failed to ${type}`)
      }

      if (onSuccess) {
        onSuccess()
      }

      // Redirect after successful authentication
      router.push(redirectTo)
      router.refresh()

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (role: 'user' | 'admin') => {
    setLoading(true)
    setError('')
    
    const demoCredentials = role === 'admin' 
      ? { email: 'sajid.syed@gmail.com', password: 'demo123' }
      : { email: 'customer@demo.com', password: 'demo123' }
    
    setFormData(prev => ({
      ...prev,
      email: demoCredentials.email,
      password: demoCredentials.password,
      confirmPassword: demoCredentials.password
    }))
    
    // Simulate API call
    setTimeout(() => {
      router.push(role === 'admin' ? '/admin' : '/dashboard')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
            {type === 'login' ? '🔐' : '📝'}
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
            {type === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-white/70">
            {type === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Join us to start shopping'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center animate-pulse">
            <p className="font-semibold">✗ {error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {type === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
                  👤
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
                ✉️
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
                🔒
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {type === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
                  🔐
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          )}

          {type === 'login' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-white/20 border border-white/30 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-white/70">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg relative overflow-hidden group"
          >
            <span className="relative z-10">
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{type === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                </span>
              ) : (
                type === 'login' ? 'Sign In' : 'Create Account'
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </form>

        {/* Demo Login for Login Form */}
        {type === 'login' && (
          <div className="mt-6">
            <p className="text-center text-sm text-white/50 mb-3">Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('user')}
                disabled={loading}
                className="py-2 px-4 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors text-sm"
              >
                👤 User Demo
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                className="py-2 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:scale-105 transform transition-all text-sm"
              >
                👑 Admin Demo
              </button>
            </div>
          </div>
        )}

        {/* Toggle between Login and Signup */}
        <div className="mt-6 text-center">
          <p className="text-white/70">
            {type === 'login' ? "Don't have an account?" : "Already have an account?"}
            {' '}
            <Link
              href={type === 'login' ? '/signup' : '/login'}
              className="font-medium text-purple-300 hover:text-purple-200 transition-colors"
            >
              {type === 'login' ? 'Sign up here' : 'Sign in here'}
            </Link>
          </p>
        </div>

        {/* Terms for Signup */}
        {type === 'signup' && (
          <div className="mt-4 text-center">
            <p className="text-xs text-white/50">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-purple-300 hover:text-purple-200">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-purple-300 hover:text-purple-200">
                Privacy Policy
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}