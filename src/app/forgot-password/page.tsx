'use client'

import { useState } from 'react'
import Link from 'next/link'
import GradientBackground from '@/components/GradientBackground'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1500)
  }

  return (
    <GradientBackground>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div>
            <h2 className="mt-6 text-center text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
              Reset Password
            </h2>
            <p className="mt-2 text-center text-sm text-white/70">
              Remember your password?{' '}
              <Link href="/signin" className="font-medium text-purple-300 hover:text-purple-200">
                Sign in
              </Link>
            </p>
          </div>

          {!submitted ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 bg-white/20 border border-white/30 placeholder-white/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-blue-600 hover:via-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✉️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Check Your Email</h3>
              <p className="text-white/70 mb-6">
                We've sent a password reset link to <br />
                <span className="text-purple-300 font-semibold">{email}</span>
              </p>
              <Link
                href="/signin"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:scale-105 transform transition-all duration-300"
              >
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </GradientBackground>
  )
}