'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const toggleMobileMenu = () => {
    const menu = document.getElementById('mobile-menu')
    if (menu) {
      menu.classList.toggle('hidden')
    }
  }

  return (
    <div className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900`}>
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

      {/* Admin Navigation Bar */}
      <nav className="relative z-20 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/admin" className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
                  Admin Panel
                </span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transform hover:scale-110 transition-all duration-300"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 hover:from-blue-500 hover:via-teal-500 hover:to-green-500 transform hover:scale-110 transition-all duration-300"
              >
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-pink-500 hover:via-red-500 hover:to-orange-500 transform hover:scale-110 transition-all duration-300"
              >
                Orders
              </Link>
              <Link
                href="/admin/users"
                className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-red-500 hover:via-pink-500 hover:to-purple-500 transform hover:scale-110 transition-all duration-300"
              >
                Users
              </Link>
              <Link
                href="/admin/settings"
                className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:from-gray-700 hover:via-gray-600 hover:to-gray-500 transform hover:scale-110 transition-all duration-300"
              >
                Settings
              </Link>
              <Link
                href="/"
                className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-red-500 hover:via-orange-500 hover:to-yellow-500 transform hover:scale-110 transition-all duration-300"
              >
                View Site
              </Link>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm text-white/70">Welcome,</p>
                <p className="text-lg font-bold text-white">Hafiz Sajid Syed</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                👑
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                id="mobile-menu-button"
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                onClick={toggleMobileMenu}
              >
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div id="mobile-menu" className="hidden md:hidden bg-white/10 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 transition-colors"
              onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 transition-colors"
              onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 transition-colors"
              onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
            >
              Orders
            </Link>
            <Link
              href="/admin/users"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 transition-colors"
              onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
            >
              Users
            </Link>
            <Link
              href="/admin/settings"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 transition-colors"
              onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
            >
              Settings
            </Link>
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/20 transition-colors"
              onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
            >
              View Site
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Bismillah */}
        <div className="text-center py-6">
          <div className="inline-block p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
            <p className="text-xl md:text-2xl font-arabic bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="relative z-10 bg-white/5 backdrop-blur-lg border-t border-white/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Admin Controls</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/admin/products/new" className="text-white/70 hover:text-white transition-colors">
                    ➕ Add New Product
                  </Link>
                </li>
                <li>
                  <Link href="/admin/orders/pending" className="text-white/70 hover:text-white transition-colors">
                    ⏳ Pending Orders
                  </Link>
                </li>
                <li>
                  <Link href="/admin/reports" className="text-white/70 hover:text-white transition-colors">
                    📊 View Reports
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
              <ul className="space-y-2 text-white/70">
                <li className="flex justify-between">
                  <span>Total Products:</span>
                  <span className="text-yellow-300 font-bold">156</span>
                </li>
                <li className="flex justify-between">
                  <span>Total Orders:</span>
                  <span className="text-yellow-300 font-bold">1,234</span>
                </li>
                <li className="flex justify-between">
                  <span>Total Users:</span>
                  <span className="text-yellow-300 font-bold">5,678</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Administrator</h3>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-white font-bold">Hafiz Sajid Syed</p>
                <p className="text-white/70 text-sm">sajid.syed@gmail.com</p>
                <div className="mt-2 flex space-x-2">
                  <span className="px-2 py-1 bg-purple-500/30 text-purple-200 rounded text-xs">Super Admin</span>
                  <span className="px-2 py-1 bg-green-500/30 text-green-200 rounded text-xs">Owner</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/50 text-sm">
              © 2024 Cotton & Lawn Suits E-Commerce. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}