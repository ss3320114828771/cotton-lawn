// app/collections/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Collection {
  id: string
  name: string
  description: string
  image: string
  productCount: number
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Sample collections data
    const sampleCollections: Collection[] = [
      {
        id: '1',
        name: 'Summer Breeze Collection',
        description: 'Light and breathable cotton suits perfect for summer',
        image: '/n1.jpeg',
        productCount: 24
      },
      {
        id: '2',
        name: 'Festive Elegance',
        description: 'Traditional lawn suits for celebrations',
        image: '/n2.jpeg',
        productCount: 18
      },
      {
        id: '3',
        name: 'Royal Heritage',
        description: 'Premium silk and velvet fusion',
        image: '/n3.jpeg',
        productCount: 15
      },
      {
        id: '4',
        name: 'Modern Chic',
        description: 'Contemporary designs with traditional touch',
        image: '/n4.jpeg',
        productCount: 22
      },
      {
        id: '5',
        name: 'Wedding Special',
        description: 'Exclusive bridal collection',
        image: '/n5.jpeg',
        productCount: 12
      },
      {
        id: '6',
        name: 'Casual Comfort',
        description: 'Everyday wear cotton suits',
        image: '/n6.jpeg',
        productCount: 30
      }
    ]

    setTimeout(() => {
      setCollections(sampleCollections)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
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
            Our Collections
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Discover our curated collections of premium cotton and lawn suits
          </p>
        </div>

        {/* Featured Collection - Hero */}
        <div className="relative h-[400px] rounded-3xl overflow-hidden mb-16 group">
          <Image
            src="/n1.jpeg"
            alt="Featured Collection"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-12">
            <span className="text-purple-300 text-lg mb-2 block">Featured Collection</span>
            <h2 className="text-5xl font-bold text-white mb-4">Summer Breeze</h2>
            <p className="text-white/80 text-xl mb-6 max-w-2xl">
              Light, breathable, and elegant cotton suits for the summer season
            </p>
            <Link
              href="/products?collection=summer"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300"
            >
              Shop Collection →
            </Link>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/products?collection=${collection.id}`}
              className="group relative h-96 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-500"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{collection.name}</h3>
                <p className="text-white/70 mb-3 line-clamp-2">{collection.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">{collection.productCount} Products</span>
                  <span className="text-white group-hover:translate-x-2 transition-transform">
                    View Collection →
                  </span>
                </div>
              </div>

              {/* Product Count Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-purple-500/90 text-white rounded-full text-sm backdrop-blur-sm">
                {collection.productCount} Items
              </div>
            </Link>
          ))}
        </div>

        {/* Seasonal Collections */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Seasonal Specials</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {['Spring Collection', 'Winter Wear', 'Festival Special'].map((season, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 hover:scale-105 transition-all duration-300">
                <div className="text-5xl mb-4">
                  {index === 0 ? '🌸' : index === 1 ? '❄️' : '✨'}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{season}</h3>
                <p className="text-white/60 mb-4">Coming Soon</p>
                <button className="text-purple-300 hover:text-purple-200 transition-colors">
                  Notify Me →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <Link
            href="/products"
            className="inline-block px-10 py-5 text-2xl font-bold text-white bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full hover:scale-110 transform transition-all duration-300 shadow-2xl"
          >
            Browse All Products
          </Link>
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