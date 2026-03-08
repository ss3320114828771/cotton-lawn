'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  createdAt?: string
}

interface Filters {
  category: string
  minPrice: string
  maxPrice: string
  search: string
  inStock: boolean
  sortBy: string
}

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Filter states
  const [filters, setFilters] = useState<Filters>({
    category: searchParams?.get('category') || 'all',
    minPrice: searchParams?.get('minPrice') || '',
    maxPrice: searchParams?.get('maxPrice') || '',
    search: searchParams?.get('search') || '',
    inStock: searchParams?.get('inStock') === 'true',
    sortBy: searchParams?.get('sortBy') || 'newest'
  })

  // Available categories (would come from API in real app)
  const categories = ['all', 'Cotton', 'Lawn', 'Silk', 'Chiffon', 'Organza', 'Velvet']
  
  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ]

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filters])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()

      if (res.ok) {
        setProducts(data.products || [])
        setFilteredProducts(data.products || [])
      } else {
        setError(data.error || 'Failed to load products')
      }
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category)
    }

    // Price range filter
    if (filters.minPrice) {
      const minPriceValue = parseFloat(filters.minPrice)
      if (!isNaN(minPriceValue)) {
        filtered = filtered.filter(p => p.price >= minPriceValue)
      }
    }
    if (filters.maxPrice) {
      const maxPriceValue = parseFloat(filters.maxPrice)
      if (!isNaN(maxPriceValue)) {
        filtered = filtered.filter(p => p.price <= maxPriceValue)
      }
    }

    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase().trim()
      filtered = filtered.filter(p => 
        (p.name?.toLowerCase() || '').includes(searchLower) || 
        (p.description?.toLowerCase() || '').includes(searchLower)
      )
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => (p.stock || 0) > 0)
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'name-asc':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      case 'name-desc':
        filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
        break
      default: // 'newest'
        filtered.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)

    // Update URL with filters
    const params = new URLSearchParams()
    if (filters.category && filters.category !== 'all') params.set('category', filters.category)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.search) params.set('search', filters.search)
    if (filters.inStock) params.set('inStock', 'true')
    if (filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy)
    
    const queryString = params.toString()
    router.push(queryString ? `/products?${queryString}` : '/products', { scroll: false })
  }

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      minPrice: '',
      maxPrice: '',
      search: '',
      inStock: false,
      sortBy: 'newest'
    })
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    )
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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Bismillah */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
            <p className="text-2xl md:text-4xl font-arabic bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
            Our Collection
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Discover our exquisite range of premium cotton and lawn suits
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full py-3 bg-white/20 backdrop-blur-lg text-white rounded-xl flex items-center justify-center space-x-2"
          >
            <span>🔍</span>
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-white/80 mb-2">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-white/80 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-800">
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-white/80 mb-2">Price Range ($)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* In Stock Only */}
              <div className="mb-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="w-4 h-4 bg-white/20 border border-white/30 rounded focus:ring-purple-500"
                  />
                  <span className="text-white/80">In Stock Only</span>
                </label>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-white/80 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="pt-4 border-t border-white/20">
                <p className="text-white/60 text-center">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mb-8">
                {error}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/20">
                <div className="text-6xl mb-6">😕</div>
                <h3 className="text-2xl font-bold text-white mb-4">No Products Found</h3>
                <p className="text-white/70 mb-8">Try adjusting your filters or search criteria.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:scale-105 transform transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Active Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {filters.category !== 'all' && (
                    <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm flex items-center">
                      Category: {filters.category}
                      <button
                        onClick={() => handleFilterChange('category', 'all')}
                        className="ml-2 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.minPrice && (
                    <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm flex items-center">
                      Min: ${parseFloat(filters.minPrice).toFixed(2)}
                      <button
                        onClick={() => handleFilterChange('minPrice', '')}
                        className="ml-2 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.maxPrice && (
                    <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm flex items-center">
                      Max: ${parseFloat(filters.maxPrice).toFixed(2)}
                      <button
                        onClick={() => handleFilterChange('maxPrice', '')}
                        className="ml-2 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.search && (
                    <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm flex items-center">
                      Search: {filters.search}
                      <button
                        onClick={() => handleFilterChange('search', '')}
                        className="ml-2 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.inStock && (
                    <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm flex items-center">
                      In Stock Only
                      <button
                        onClick={() => handleFilterChange('inStock', false)}
                        className="ml-2 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentItems.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:scale-105 transform transition-all duration-300 group"
                    >
                      <div className="relative h-64">
                        <Image
                          src={product.image || '/placeholder.jpg'}
                          alt={product.name || 'Product'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Stock Badge */}
                        <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-semibold ${
                          (product.stock || 0) > 10 
                            ? 'bg-green-500/80 text-white' 
                            : (product.stock || 0) > 0 
                            ? 'bg-orange-500/80 text-white'
                            : 'bg-red-500/80 text-white'
                        }`}>
                          {(product.stock || 0) > 10 ? 'In Stock' : (product.stock || 0) > 0 ? `${product.stock} left` : 'Out of Stock'}
                        </div>

                        {/* Category Badge */}
                        {product.category && (
                          <div className="absolute top-4 left-4 px-2 py-1 bg-purple-500/80 text-white rounded-full text-xs">
                            {product.category}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.name || 'Unnamed Product'}</h3>
                        <p className="text-white/60 text-sm mb-3 line-clamp-2">{product.description || 'No description available'}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-yellow-300">
                            ${(product.price || 0).toFixed(2)}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              alert('Added to cart!')
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm hover:scale-105 transform transition-all duration-300"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = i + 1
                      if (totalPages > 5) {
                        if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          } transition-colors`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
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