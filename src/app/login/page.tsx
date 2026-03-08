'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Check if user just registered
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setError('')
      // Show success message
      const timer = setTimeout(() => {
        const successMsg = document.getElementById('success-message')
        if (successMsg) successMsg.style.opacity = '1'
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password')
      }

      // Redirect to dashboard or requested page
      router.push(redirect)
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
    
    // Demo credentials
    const demoCredentials = role === 'admin' 
      ? { email: 'sajid.syed@gmail.com', password: 'demo123' }
      : { email: 'customer@demo.com', password: 'demo123' }
    
    setFormData(demoCredentials)
    
    // Simulate API call
    setTimeout(() => {
      router.push(role === 'admin' ? '/admin' : '/dashboard')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Twinkling Stars Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(2px 2px at 10px 10px, white, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 20px 30px, white, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 40px 70px, white, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 60px 90px, white, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 80px 110px, white, rgba(0,0,0,0))`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          animation: 'twinkle 4s ease-in-out infinite'
        }}></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(2px 2px at 130px 40px, white, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 150px 160px, white, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 190px 70px, white, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 220px 130px, white, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 270px 190px, white, rgba(0,0,0,0))`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          animation: 'twinkle 5s ease-in-out infinite reverse'
        }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Bismillah */}
          <div className="text-center">
            <div className="inline-block p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 mb-6">
              <p className="text-xl md:text-2xl font-arabic bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
              </p>
            </div>
          </div>

          {/* Main Login Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-4xl animate-pulse">
                👑
              </div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Sign in to your account to continue
              </p>
            </div>

            {/* Success Message (for new registration) */}
            <div 
              id="success-message"
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-center opacity-0 transition-opacity duration-500"
            >
              <p className="font-semibold">✓ Registration successful!</p>
              <p className="text-sm">Please sign in with your credentials</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center animate-pulse">
                <p className="font-semibold">✗ {error}</p>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
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
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing in...</span>
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            {/* Demo Login Buttons */}
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

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-white/70">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="font-medium text-purple-300 hover:text-purple-200 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Admin Info */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-center text-sm text-white/50">
                Administrator: <span className="text-yellow-300">Hafiz Sajid Syed</span>
              </p>
              <p className="text-center text-xs text-white/30 mt-1">
                sajid.syed@gmail.com
              </p>
            </div>
          </div>

          {/* Additional Links */}
          <div className="flex justify-center space-x-4 text-sm">
            <Link href="/" className="text-white/50 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/about" className="text-white/50 hover:text-white transition-colors">
              About
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/contact" className="text-white/50 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}