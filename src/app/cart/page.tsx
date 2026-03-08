'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

interface Cart {
  id: string
  userId: string
  items: CartItem[]
}

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart')
      const data = await res.json()

      if (res.ok) {
        setCart(data.cart)
      } else if (res.status === 401) {
        // Not authenticated, redirect to login
        router.push('/signin?redirect=/cart')
      } else {
        setError(data.error || 'Failed to load cart')
      }
    } catch (err) {
      setError('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return
    
    setUpdating(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity
        })
      })

      const data = await res.json()

      if (res.ok) {
        setCart(data.cart)
      } else {
        alert(data.error || 'Failed to update cart')
      }
    } catch (err) {
      alert('Failed to update cart')
    } finally {
      setUpdating(false)
    }
  }

  const removeItem = async (productId: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (res.ok) {
        setCart(data.cart)
      } else {
        alert(data.error || 'Failed to remove item')
      }
    } catch (err) {
      alert('Failed to remove item')
    } finally {
      setUpdating(false)
    }
  }

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return

    setUpdating(true)
    try {
      const res = await fetch('/api/cart?clearAll=true', {
        method: 'DELETE'
      })

      const data = await res.json()

      if (res.ok) {
        setCart(data.cart)
      } else {
        alert(data.error || 'Failed to clear cart')
      }
    } catch (err) {
      alert('Failed to clear cart')
    } finally {
      setUpdating(false)
    }
  }

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    // Simulate checkout process
    setTimeout(() => {
      alert('Checkout functionality coming soon!')
      setCheckoutLoading(false)
    }, 1500)
  }

  // Calculate totals
  const subtotal = cart?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

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
            Shopping Cart
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Review and manage your selected items
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {!cart || cart.items.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/20">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-white/70 text-lg mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 text-lg"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden group">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                          <p className="text-2xl font-bold text-yellow-300 mb-4">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={updating || item.quantity <= 1}
                            className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="w-12 text-center text-white font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={updating}
                            className="w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Item Total and Remove */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                        <p className="text-white/70">
                          Item Total: <span className="text-white font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          disabled={updating}
                          className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Cart Actions */}
              <div className="flex justify-between items-center mt-6">
                <Link
                  href="/products"
                  className="text-purple-300 hover:text-purple-200 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Continue Shopping</span>
                </Link>
                
                <button
                  onClick={clearCart}
                  disabled={updating}
                  className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear Cart</span>
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 text-white/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-white font-semibold">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span className="text-white font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  
                  {shipping === 0 && (
                    <div className="text-green-400 text-sm flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Free shipping applied!</span>
                    </div>
                  )}
                  
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span className="text-yellow-300">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-6">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>

                {/* Payment Methods */}
                <div className="mt-6 text-center">
                  <p className="text-white/50 text-sm mb-3">We accept</p>
                  <div className="flex justify-center space-x-4 text-2xl">
                    <span className="text-white/70 hover:text-white transition-colors cursor-pointer">💳</span>
                    <span className="text-white/70 hover:text-white transition-colors cursor-pointer">📱</span>
                    <span className="text-white/70 hover:text-white transition-colors cursor-pointer">💰</span>
                    <span className="text-white/70 hover:text-white transition-colors cursor-pointer">🏦</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-white/20 text-center">
                  <div className="flex items-center justify-center space-x-2 text-white/50 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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