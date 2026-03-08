'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GradientBackground from '@/components/GradientBackground'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is admin
    const isAdmin = true // This should be verified from the server
    if (!isAdmin) {
      router.push('/dashboard')
    } else {
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
          Admin Panel
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin Cards */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transform transition-all duration-300 cursor-pointer">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Dashboard Overview</h3>
            <p className="text-white/70">View site statistics and analytics</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transform transition-all duration-300 cursor-pointer">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-white mb-2">Manage Products</h3>
            <p className="text-white/70">Add, edit, or remove products</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transform transition-all duration-300 cursor-pointer">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-2">Manage Users</h3>
            <p className="text-white/70">View and manage user accounts</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transform transition-all duration-300 cursor-pointer">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">Orders</h3>
            <p className="text-white/70">Process and track customer orders</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transform transition-all duration-300 cursor-pointer">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-white mb-2">Sales Reports</h3>
            <p className="text-white/70">View sales and revenue reports</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transform transition-all duration-300 cursor-pointer">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold text-white mb-2">Settings</h3>
            <p className="text-white/70">Configure site settings</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white">New order #2024{item} placed</p>
                  <p className="text-white/60 text-sm">2 minutes ago</p>
                </div>
                <span className="text-yellow-300">$129.99</span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Info */}
        <div className="mt-8 text-center text-white/70 p-6 bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-3xl">
          <p className="text-xl mb-2">Administrator: Hafiz Sajid Syed</p>
          <p className="text-lg">Email: sajid.syed@gmail.com</p>
        </div>
      </div>
    </GradientBackground>
  )
}