'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'user' | 'admin'
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuthorization()
  }, [pathname])

  const checkAuthorization = async () => {
    setIsLoading(true)
    
    try {
      // Check if user is authenticated by verifying token
      const token = document.cookie.includes('token=')
      
      if (!token) {
        setIsAuthorized(false)
        setIsLoading(false)
        
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(pathname)
        router.push(`${redirectTo}?redirect=${returnUrl}`)
        return
      }

      // If role is required, fetch user data to check role
      if (requiredRole) {
        const res = await fetch('/api/user')
        const data = await res.json()
        
        if (res.ok && data.user) {
          setUser(data.user)
          
          // Check if user has required role
          if (requiredRole === 'admin' && data.user.role !== 'admin') {
            setIsAuthorized(false)
            router.push('/dashboard?error=unauthorized')
          } else {
            setIsAuthorized(true)
          }
        } else {
          // Token exists but user fetch failed (invalid token)
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          setIsAuthorized(false)
          router.push(redirectTo)
        }
      } else {
        // No role required, just authentication
        setIsAuthorized(true)
        
        // Fetch user data for display
        const res = await fetch('/api/user')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      }
      
    } catch (error) {
      console.error('Authorization check failed:', error)
      setIsAuthorized(false)
      router.push(redirectTo)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="relative">
            {/* Animated rings */}
            <div className="w-24 h-24 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 border-4 border-pink-500/30 border-b-pink-500 rounded-full animate-spin"></div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Verifying Access</h3>
            <p className="text-white/70">Please wait while we check your credentials...</p>
            
            {/* Loading dots */}
            <div className="flex justify-center space-x-2 mt-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show unauthorized access message (if needed)
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
            {/* Lock Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-4xl animate-pulse">
              🔒
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">Access Denied</h2>
            
            <p className="text-white/70 mb-6">
              {requiredRole === 'admin' 
                ? 'This area is restricted to administrators only.' 
                : 'You need to be logged in to access this page.'}
            </p>
            
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300"
              >
                Go to Login
              </Link>
              
              <Link
                href="/"
                className="block w-full py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-colors"
              >
                Return Home
              </Link>
            </div>
            
            {requiredRole === 'admin' && (
              <p className="mt-4 text-sm text-white/50">
                Need admin access? Contact Hafiz Sajid Syed at{' '}
                <span className="text-purple-300">sajid.syed@gmail.com</span>
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render children if authorized
  return <>{children}</>
}

// Higher-Order Component wrapper
export function withProtection(
  Component: React.ComponentType<any>,
  options?: { requiredRole?: 'user' | 'admin'; redirectTo?: string }
) {
  return function ProtectedComponent(props: any) {
    return (
      <ProtectedRoute 
        requiredRole={options?.requiredRole} 
        redirectTo={options?.redirectTo}
      >
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Admin only route wrapper
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin" redirectTo="/admin/login">
      {children}
    </ProtectedRoute>
  )
}

// User only route wrapper
export function UserRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="user" redirectTo="/login">
      {children}
    </ProtectedRoute>
  )
}

// Public route wrapper (redirects if already logged in)
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie.includes('token=')
      if (token) {
        router.push('/dashboard')
      }
      setIsChecking(false)
    }

    checkAuth()
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Example usage component
export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-4xl">
            ⚠️
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Unauthorized Access</h2>
          
          <p className="text-white/70 mb-6">
            You don't have permission to access this page.
          </p>
          
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

// Session timeout handler
export function SessionTimeout({ children }: { children: React.ReactNode }) {
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 300 && prev > 0) { // Show warning when 5 minutes left
          setShowWarning(true)
        }
        if (prev <= 0) {
          // Logout user
          fetch('/api/auth/logout', { method: 'POST' })
          window.location.href = '/login?timeout=true'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const extendSession = () => {
    setTimeLeft(30 * 60)
    setShowWarning(false)
    // Call API to extend session
    fetch('/api/auth/extend', { method: 'POST' })
  }

  return (
    <>
      {showWarning && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500/90 backdrop-blur-lg text-white px-6 py-4 rounded-2xl shadow-2xl border border-yellow-400/50 animate-slide-down">
          <div className="flex items-center space-x-4">
            <span className="text-2xl">⏰</span>
            <div>
              <p className="font-bold">Session expiring soon</p>
              <p className="text-sm">You will be logged out in {Math.floor(timeLeft / 60)} minutes</p>
            </div>
            <button
              onClick={extendSession}
              className="px-4 py-2 bg-white text-yellow-600 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  )
}