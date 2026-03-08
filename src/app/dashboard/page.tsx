'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GradientBackground from '@/components/GradientBackground'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = document.cookie.includes('token=')
    if (!token) {
      router.push('/signin')
    } else {
      // Fetch user data
      setUser({
        id: '1',
        name: 'Hafiz Sajid Syed',
        email: 'sajid.syed@gmail.com',
        role: 'admin'
      })
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <GradientBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </GradientBackground>
    )
  }

  return (
    <GradientBackground>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl text-white">👤</span>
                </div>
                <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                <p className="text-white/60 text-sm">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-xs font-semibold">
                  {user?.role}
                </span>
              </div>

              <nav className="space-y-2">
                <Link href="/dashboard" className="block px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                  Overview
                </Link>
                <Link href="/dashboard/orders" className="block px-4 py-2 text-white/70 hover:bg-white/20 rounded-lg transition-colors">
                  My Orders
                </Link>
                <Link href="/dashboard/profile" className="block px-4 py-2 text-white/70 hover:bg-white/20 rounded-lg transition-colors">
                  Profile Settings
                </Link>
                <Link href="/dashboard/wishlist" className="block px-4 py-2 text-white/70 hover:bg-white/20 rounded-lg transition-colors">
                  Wishlist
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="block px-4 py-2 text-yellow-300 hover:bg-white/20 rounded-lg transition-colors">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                    router.push('/')
                  }}
                  className="w-full text-left px-4 py-2 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-3xl mb-2">📦</div>
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-white/60">Total Orders</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-3xl mb-2">❤️</div>
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-white/60">Wishlist Items</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="text-3xl mb-2">🛍️</div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-white/60">In Cart</div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Recent Orders</h2>
              
              <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                  <div key={order} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">Order #{order}24</p>
                      <p className="text-white/60 text-sm">Placed on Mar {order}, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-300 font-bold">$129.99</p>
                      <span className="inline-block px-2 py-1 bg-green-500/30 text-green-200 rounded-full text-xs">
                        Delivered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 w-full py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                View All Orders
              </button>
            </div>

            {/* Recommended Products */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Recommended for You</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                    <div className="w-16 h-16 bg-purple-500/30 rounded-lg"></div>
                    <div>
                      <h3 className="text-white font-semibold">Premium Cotton Suit</h3>
                      <p className="text-yellow-300">$89.99</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GradientBackground>
  )
}