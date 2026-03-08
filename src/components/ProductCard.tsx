'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
}

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'featured'
  showActions?: boolean
  onAddToCart?: (productId: string, quantity: number) => void
  onAddToWishlist?: (productId: string) => void
}

export default function ProductCard({ 
  product, 
  variant = 'default',
  showActions = true,
  onAddToCart,
  onAddToWishlist 
}: ProductCardProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAddingToCart(true)
    
    try {
      if (onAddToCart) {
        await onAddToCart(product.id, quantity)
      } else {
        // Default add to cart behavior
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: product.id,
            quantity
          })
        })

        if (!res.ok) {
          throw new Error('Failed to add to cart')
        }
      }

      // Show success feedback
      const button = e.currentTarget
      button.classList.add('bg-green-500')
      setTimeout(() => {
        button.classList.remove('bg-green-500')
      }, 1000)
      
    } catch (error) {
      console.error('Add to cart error:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsInWishlist(!isInWishlist)
    
    if (onAddToWishlist) {
      onAddToWishlist(product.id)
    }
    
    // Show heart animation
    const heart = e.currentTarget.querySelector('.heart-icon')
    heart?.classList.add('animate-heartbeat')
    setTimeout(() => {
      heart?.classList.remove('animate-heartbeat')
    }, 500)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickView(true)
  }

  const getStockStatus = () => {
    if (product.stock > 10) {
      return { text: 'In Stock', color: 'bg-green-500', textColor: 'text-green-500' }
    } else if (product.stock > 0) {
      return { text: `Only ${product.stock} left`, color: 'bg-orange-500', textColor: 'text-orange-500' }
    } else {
      return { text: 'Out of Stock', color: 'bg-red-500', textColor: 'text-red-500' }
    }
  }

  const stockStatus = getStockStatus()
  const discount = product.price > 100 ? 20 : 0 // Example discount logic
  const discountedPrice = discount > 0 ? product.price * (1 - discount / 100) : null

  // Card variants
  const cardClasses = {
    default: 'bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:scale-105 transform transition-all duration-300 group',
    compact: 'bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:scale-102 transform transition-all duration-300 group',
    featured: 'bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border-2 border-purple-500/50 hover:scale-105 transform transition-all duration-300 group shadow-2xl'
  }

  const imageSizes = {
    default: 'h-64',
    compact: 'h-48',
    featured: 'h-80'
  }

  return (
    <>
      <Link
        href={`/products/${product.id}`}
        className={`${cardClasses[variant]} relative`}
      >
        {/* Image Container */}
        <div className={`relative ${imageSizes[variant]} overflow-hidden`}>
          <Image
            src={imageError ? '/placeholder.jpg' : product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImageError(true)}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discount > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                -{discount}% OFF
              </span>
            )}
            <span className={`px-3 py-1 ${stockStatus.color} text-white text-xs font-bold rounded-full`}>
              {stockStatus.text}
            </span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-purple-500/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">
              {product.category}
            </span>
          </div>

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white/90 text-gray-900 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
          >
            Quick View
          </button>
        </div>

        {/* Content */}
        <div className="p-4 relative">
          {/* Product Name & Price */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-white/60 line-clamp-2 mb-2">
              {product.description}
            </p>
            <div className="flex items-center gap-2">
              {discountedPrice ? (
                <>
                  <span className="text-2xl font-bold text-yellow-300">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-white/50 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-yellow-300">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Rating Stars (Example) */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-400'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-white/50 ml-1">(24 reviews)</span>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex items-center gap-2">
              {/* Quantity Selector (for default and featured variants) */}
              {variant !== 'compact' && product.stock > 0 && (
                <div className="flex items-center border border-white/30 rounded-lg">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setQuantity(Math.max(1, quantity - 1))
                    }}
                    className="w-8 h-8 text-white hover:bg-white/20 transition-colors rounded-l-lg"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-white text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }}
                    className="w-8 h-8 text-white hover:bg-white/20 transition-colors rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  product.stock === 0
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 text-white'
                }`}
              >
                {isAddingToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Adding...</span>
                  </span>
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  'Add to Cart'
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={handleAddToWishlist}
                className="p-2 rounded-lg border border-white/30 hover:bg-white/20 transition-colors group"
              >
                <span className={`heart-icon text-xl transition-all duration-300 ${
                  isInWishlist ? 'text-red-500 scale-110' : 'text-white'
                }`}>
                  {isInWishlist ? '❤️' : '🤍'}
                </span>
              </button>
            </div>
          )}

          {/* Stock Progress Bar (for featured variant) */}
          {variant === 'featured' && product.stock > 0 && product.stock < 20 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-white/50 mb-1">
                <span>Stock</span>
                <span>{product.stock} units</span>
              </div>
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                  style={{ width: `${(product.stock / 50) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Sold Out Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-full transform -rotate-12">
              SOLD OUT
            </span>
          </div>
        )}
      </Link>

      {/* Quick View Modal */}
      {showQuickView && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowQuickView(false)}
        >
          <div 
            className="max-w-2xl w-full bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl overflow-hidden border-2 border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 md:h-auto">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs text-purple-300">{product.category}</span>
                    <h3 className="text-2xl font-bold text-white">{product.name}</h3>
                  </div>
                  <button
                    onClick={() => setShowQuickView(false)}
                    className="text-white/50 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                
                <p className="text-white/70 mb-4">{product.description}</p>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-yellow-300">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className={`ml-2 text-sm ${stockStatus.textColor}`}>
                    {stockStatus.text}
                  </span>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300"
                >
                  Add to Cart
                </button>
                
                <Link
                  href={`/products/${product.id}`}
                  className="block text-center mt-3 text-purple-300 hover:text-purple-200"
                >
                  View Full Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        .animate-heartbeat {
          animation: heartbeat 0.3s ease-in-out;
        }
      `}</style>
    </>
  )
}