'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
}

interface Testimonial {
  id: number
  name: string
  comment: string
  rating: number
  image: string
}

export default function HomePage() {
  const router = useRouter()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Sample products (in real app, these would come from API)
  const sampleProducts: Product[] = [
    { id: '1', name: 'Premium Cotton Suit - Royal Blue', price: 89.99, image: '/n1.jpeg', category: 'Cotton' },
    { id: '2', name: 'Luxury Lawn Suit - Blossom Pink', price: 129.99, image: '/n2.jpeg', category: 'Lawn' },
    { id: '3', name: 'Designer Cotton Suit - Emerald Green', price: 99.99, image: '/n3.jpeg', category: 'Cotton' },
    { id: '4', name: 'Premium Lawn Suit - Royal Purple', price: 149.99, image: '/n4.jpeg', category: 'Lawn' },
    { id: '5', name: 'Casual Cotton Suit - Sunshine Yellow', price: 79.99, image: '/n5.jpeg', category: 'Cotton' },
    { id: '6', name: 'Festival Lawn Suit - Ruby Red', price: 199.99, image: '/n6.jpeg', category: 'Lawn' },
  ]

  // Testimonials
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Aisha Rahman',
      comment: 'The quality of cotton suits is exceptional. Very comfortable and elegant design!',
      rating: 5,
      image: '/n1.jpeg'
    },
    {
      id: 2,
      name: 'Fatima Khan',
      comment: 'Best lawn suits I have ever bought. The fabric is so soft and breathable.',
      rating: 5,
      image: '/n2.jpeg'
    },
    {
      id: 3,
      name: 'Sana Malik',
      comment: 'Amazing collection and prompt delivery. Highly recommended!',
      rating: 5,
      image: '/n3.jpeg'
    }
  ]

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setFeaturedProducts(sampleProducts.slice(0, 4))
      setNewArrivals(sampleProducts.slice(2, 6))
      setLoading(false)
    }, 1000)

    // Auto-slide for hero section
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const heroSlides = [
    {
      title: 'Elegant Cotton Collection',
      subtitle: 'Discover our premium cotton suits',
      image: '/n1.jpeg',
      color: 'from-blue-900 to-purple-900'
    },
    {
      title: 'Luxury Lawn Designs',
      subtitle: 'Exclusive lawn collection for you',
      image: '/n2.jpeg',
      color: 'from-pink-900 to-red-900'
    },
    {
      title: 'Festival Special',
      subtitle: 'Traditional elegance meets modern style',
      image: '/n3.jpeg',
      color: 'from-green-900 to-teal-900'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white/70 text-xl">Loading beautiful collection...</p>
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

      <div className="relative z-10">
        {/* Bismillah */}
        <div className="text-center pt-8">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
            <p className="text-2xl md:text-4xl font-arabic bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          </div>
        </div>

        {/* Hero Slider */}
        <div className="relative h-[600px] overflow-hidden mt-8">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-black/50 z-10"></div>
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-60 z-20`}></div>
              <div className="absolute inset-0 z-30 flex items-center justify-center text-center">
                <div className="max-w-4xl px-4">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 mb-8">
                    {slide.subtitle}
                  </p>
                  <Link
                    href="/products"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:scale-110 transform transition-all duration-300 text-lg"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-purple-500'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Cotton', 'Lawn', 'Silk', 'Festival'].map((category, index) => (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={`/n${index + 1}.jpeg`}
                  alt={category}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{category}</h3>
                  <p className="text-purple-300 group-hover:text-white transition-colors">
                    Shop Now →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
            Featured Products
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:scale-105 transform transition-all duration-300 group"
              >
                <div className="relative h-64">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4 px-2 py-1 bg-purple-500/80 text-white rounded-full text-xs">
                    {product.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-yellow-300 font-bold text-xl">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
            >
              View All Products →
            </Link>
          </div>
        </div>

        {/* New Arrivals */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
            New Arrivals
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:scale-105 transform transition-all duration-300 group"
              >
                <div className="relative h-64">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-2 py-1 bg-green-500/80 text-white rounded-full text-xs">
                    New
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-yellow-300 font-bold text-xl">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Health Benefits Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Importance of Cotton in Health
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🌿</div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-300 mb-2">Breathable & Comfortable</h3>
                    <p className="text-white/80">
                      Cotton allows your skin to breathe naturally, reducing the risk of skin irritations and allergies. 
                      It's hypoallergenic and perfect for sensitive skin types, making it ideal for daily wear.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">💧</div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-300 mb-2">Moisture Absorbent</h3>
                    <p className="text-white/80">
                      Natural cotton fibers absorb moisture effectively, keeping you dry and comfortable throughout the day. 
                      This helps prevent bacterial growth and skin infections.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🌡️</div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-300 mb-2">Temperature Regulating</h3>
                    <p className="text-white/80">
                      Cotton adapts to body temperature, keeping you cool in summer and warm in winter, 
                      promoting better sleep and overall comfort throughout the year.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🌱</div>
                  <div>
                    <h3 className="text-2xl font-bold text-pink-300 mb-2">Eco-Friendly Choice</h3>
                    <p className="text-white/80">
                      Choosing organic cotton supports sustainable farming practices, reducing exposure to harmful chemicals 
                      and protecting the environment for future generations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transform transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                    <div className="flex text-yellow-400">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-white/70 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, new arrivals, and fashion tips
            </p>
            
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Admin Info */}
        <div className="text-center py-12 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="inline-block p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <p className="text-2xl text-white mb-2">👑 <span className="font-bold">Hafiz Sajid Syed</span></p>
              <p className="text-purple-300 mb-2">Founder & Administrator</p>
              <p className="text-white/70">sajid.syed@gmail.com</p>
              <div className="mt-4 flex justify-center space-x-4">
                <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm">📞 +1 (555) 123-4567</span>
                <span className="px-3 py-1 bg-pink-500/30 text-pink-200 rounded-full text-sm">📍 New York, USA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  )
}