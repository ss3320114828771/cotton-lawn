'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    
    // Check login status
    checkAuthStatus()
    
    // Get cart count
    fetchCartCount()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const checkAuthStatus = () => {
    // Check if token exists in cookies
    const token = document.cookie.includes('token=')
    setIsLoggedIn(token)
    
    // In a real app, you would decode the token to get user role
    // For demo, we'll check if email is admin
    if (token) {
      // This is just for demo - in real app, get from token
      setUserRole('admin') // or 'user' based on actual role
    }
  }

  const fetchCartCount = () => {
    // Simulate fetching cart count
    // In real app, this would come from API/cart
    setCartCount(3)
    setWishlistCount(2)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsLoggedIn(false)
      setUserRole(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Products', href: '/products', icon: '👗' },
    { name: 'Collections', href: '/collections', icon: '✨' },
    { name: 'About', href: '/about', icon: '📖' },
    { name: 'Contact', href: '/contact', icon: '📞' },
  ]

  const userNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Orders', href: '/orders', icon: '📦' },
    { name: 'Wishlist', href: '/wishlist', icon: '❤️' },
  ]

  const adminNavItems = [
    { name: 'Admin', href: '/admin', icon: '⚙️' },
    { name: 'Products', href: '/admin/products', icon: '📦' },
    { name: 'Orders', href: '/admin/orders', icon: '📋' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-2xl py-2' 
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl group-hover:rotate-12 transition-transform">
                  👗
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%] hidden sm:block">
                  Cotton & Lawn
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex lg:items-center lg:space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg'
                        : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                    </span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-xl hover:bg-white/20 transition-colors relative group"
              >
                <span className="text-xl">🔍</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full group-hover:animate-ping"></span>
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 rounded-xl hover:bg-white/20 transition-colors relative hidden sm:block"
              >
                <span className="text-xl">❤️</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2 rounded-xl hover:bg-white/20 transition-colors relative"
              >
                <span className="text-xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative group">
                <button className="p-2 rounded-xl hover:bg-white/20 transition-colors">
                  <span className="text-xl">👤</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <div className="p-2">
                    {isLoggedIn ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm text-gray-500">Signed in as</p>
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {userRole === 'admin' ? 'Hafiz Sajid Syed' : 'Customer'}
                          </p>
                          {userRole === 'admin' && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold">
                              Admin
                            </span>
                          )}
                        </div>
                        
                        {userRole === 'admin' ? (
                          // Admin Menu Items
                          adminNavItems.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-colors"
                            >
                              <span>{item.icon}</span>
                              <span>{item.name}</span>
                            </Link>
                          ))
                        ) : (
                          // User Menu Items
                          userNavItems.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-colors"
                            >
                              <span>{item.icon}</span>
                              <span>{item.name}</span>
                            </Link>
                          ))
                        )}
                        
                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <span>🚪</span>
                            <span>Logout</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-colors"
                        >
                          <span>🔐</span>
                          <span>Login</span>
                        </Link>
                        <Link
                          href="/signup"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-colors"
                        >
                          <span>📝</span>
                          <span>Sign Up</span>
                        </Link>
                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <button
                            onClick={() => window.location.href = '/admin'}
                            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                          >
                            <span>👑</span>
                            <span>Admin Demo</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/20 transition-colors relative"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-current transform transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-current transform transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className={`overflow-hidden transition-all duration-300 ${showSearch ? 'max-h-20 mt-4' : 'max-h-0'}`}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-6 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm hover:scale-105 transition-transform"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden absolute left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Nav Items */}
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Mobile User Menu */}
            <div className="border-t border-gray-200 pt-4">
              <p className="px-4 text-xs text-gray-500 mb-2">Account</p>
              {isLoggedIn ? (
                <>
                  {userRole === 'admin' ? (
                    adminNavItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))
                  ) : (
                    userNavItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <span className="text-xl">🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all"
                  >
                    <span className="text-xl">🔐</span>
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all"
                  >
                    <span className="text-xl">📝</span>
                    <span className="font-medium">Sign Up</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Footer */}
            <div className="border-t border-gray-200 pt-4 px-4">
              <p className="text-xs text-gray-400 text-center">
                Admin: Hafiz Sajid Syed
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under navbar */}
      <div className="h-20"></div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  )
}