'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  createdAt: string
}

interface RelatedProduct {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`)
      const data = await res.json()

      if (res.ok) {
        setProduct(data.product)
        // Fetch related products
        fetchRelatedProducts(data.product.category, data.product.id)
      } else {
        setError(data.error || 'Product not found')
      }
    } catch (err) {
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (category: string, currentProductId: string) => {
    try {
      const res = await fetch(`/api/products?category=${category}&limit=4`)
      const data = await res.json()
      
      if (res.ok) {
        // Filter out current product
        const filtered = data.products.filter((p: any) => p.id !== currentProductId)
        setRelatedProducts(filtered.slice(0, 4))
      }
    } catch (err) {
      console.error('Failed to fetch related products:', err)
    }
  }

  const addToCart = async () => {
    if (!product) return
    
    setAddingToCart(true)
    try {
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

      const data = await res.json()

      if (res.ok) {
        // Show success message
        alert(`${product.name} added to cart!`)
      } else if (res.status === 401) {
        // Redirect to login
        router.push(`/signin?redirect=/products/${productId}`)
      } else {
        alert(data.error || 'Failed to add to cart')
      }
    } catch (err) {
      alert('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const buyNow = async () => {
    await addToCart()
    router.push('/cart')
  }

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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/20">
            <div className="text-6xl mb-6">😕</div>
            <h2 className="text-3xl font-bold text-white mb-4">Product Not Found</h2>
            <p className="text-white/70 text-lg mb-8">{error || 'The product you are looking for does not exist.'}</p>
            <Link
              href="/products"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Mock additional images (in real app, these would come from API)
  const productImages = [
    product.image,
    product.image.replace('.jpeg', '-2.jpeg'),
    product.image.replace('.jpeg', '-3.jpeg'),
    product.image.replace('.jpeg', '-4.jpeg'),
  ].filter(Boolean)

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

        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex text-sm text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{product.name}</span>
          </nav>
        </div>

        {/* Main Product Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 mb-12">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-[500px] rounded-2xl overflow-hidden group">
                <Image
                  src={productImages[selectedImage] || product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Stock Badge */}
                <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold ${
                  product.stock > 10 
                    ? 'bg-green-500/80 text-white' 
                    : product.stock > 0 
                    ? 'bg-orange-500/80 text-white'
                    : 'bg-red-500/80 text-white'
                }`}>
                  {product.stock > 10 
                    ? 'In Stock' 
                    : product.stock > 0 
                    ? `Only ${product.stock} left` 
                    : 'Out of Stock'}
                </div>
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-purple-500 scale-105' 
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - View ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Category and Title */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm">
                    {product.category}
                  </span>
                  {product.stock === 0 && (
                    <span className="px-3 py-1 bg-red-500/30 text-red-200 rounded-full text-sm">
                      Out of Stock
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
                <p className="text-3xl font-bold text-yellow-300">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              {/* Short Description */}
              <p className="text-white/70 leading-relaxed">
                {product.description.substring(0, 150)}...
              </p>

              {/* Tabs */}
              <div className="border-b border-white/20">
                <div className="flex space-x-8">
                  {['description', 'details', 'shipping'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium transition-colors ${
                        activeTab === tab
                          ? 'border-purple-500 text-white'
                          : 'border-transparent text-white/50 hover:text-white/70'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="min-h-[150px]">
                {activeTab === 'description' && (
                  <div className="text-white/70 space-y-4">
                    <p>{product.description}</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>100% authentic fabric</li>
                      <li>Premium quality stitching</li>
                      <li>Elegant design</li>
                      <li>Comfortable fit</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="text-white/70">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-white/10">
                          <td className="py-2 font-medium">Fabric</td>
                          <td className="py-2">Premium {product.category}</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 font-medium">Care Instructions</td>
                          <td className="py-2">Dry clean only</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-2 font-medium">Pattern</td>
                          <td className="py-2">Embroidered</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Occasion</td>
                          <td className="py-2">Casual & Festive</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="text-white/70 space-y-4">
                    <p>✓ Free shipping on orders over $100</p>
                    <p>✓ Standard delivery: 3-5 business days</p>
                    <p>✓ Express delivery: 1-2 business days</p>
                    <p>✓ Easy returns within 30 days</p>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-white/70">Quantity:</span>
                <div className="flex items-center border border-white/30 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-white font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <span className="text-white/50 text-sm">{product.stock} available</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={addToCart}
                  disabled={addingToCart || product.stock === 0}
                  className="py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Adding...</span>
                    </span>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                
                <button
                  onClick={buyNow}
                  disabled={product.stock === 0}
                  className="py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {/* Product Meta */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
                <div className="text-center">
                  <p className="text-white/50 text-sm">SKU</p>
                  <p className="text-white font-mono text-sm">{product.id.slice(-8)}</p>
                </div>
                <div className="text-center">
                  <p className="text-white/50 text-sm">Category</p>
                  <p className="text-white">{product.category}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/products/${related.id}`}
                  className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:scale-105 transform transition-all duration-300 group"
                >
                  <div className="relative h-48">
                    <Image
                      src={related.image}
                      alt={related.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-purple-300 mb-1">{related.category}</p>
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">{related.name}</h3>
                    <p className="text-yellow-300 font-bold">${related.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
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