'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* Twinkling Stars Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 10px 10px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 20px 30px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 40px 70px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 60px 90px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 80px 110px, white, rgba(0,0,0,0))`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            animation: 'twinkle 4s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 130px 40px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 150px 160px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 190px 70px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 220px 130px, white, rgba(0,0,0,0)),
                              radial-gradient(2px 2px at 270px 190px, white, rgba(0,0,0,0))`,
            backgroundRepeat: 'repeat',
            backgroundSize: '300px 300px',
            animation: 'twinkle 5s ease-in-out infinite reverse'
          }}
        ></div>
      </div>

      {/* Main Content */}
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
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
            About Us
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Discover the story behind Cotton & Lawn Paradise and our commitment to quality
          </p>
        </div>

        {/* Main Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative h-[500px] rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-700 group">
            <Image
              src="/n1.jpeg"
              alt="About Us"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-white text-2xl font-bold">Est. 2024</p>
            </div>
          </div>
          
          <div className="space-y-6 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-4">Our Story</h2>
            <div className="space-y-4 text-white/80 text-lg leading-relaxed">
              <p>
                Founded by <span className="text-yellow-300 font-semibold">Hafiz Sajid Syed</span>, our journey began with a simple vision: to provide premium quality cotton and lawn suits that combine traditional elegance with modern style.
              </p>
              <p>
                With over 15 years of experience in the textile industry, we understand what makes a perfect outfit. Every piece in our collection is carefully selected, ensuring the highest quality fabric, impeccable stitching, and designs that make you stand out.
              </p>
              <p>
                We believe in sustainable fashion and supporting local artisans. Our commitment to ethical practices ensures that every suit you purchase not only looks good but also contributes to a better world.
              </p>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 transform hover:scale-105 transition-all duration-500 group">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-4xl transform group-hover:rotate-12 transition-transform">
              🎯
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-white/70">To provide the finest quality suits while promoting sustainable and ethical fashion practices that respect both people and planet.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 transform hover:scale-105 transition-all duration-500 group">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-4xl transform group-hover:rotate-12 transition-transform">
              👁️
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-white/70">To become the most trusted name in premium cotton and lawn suits worldwide, celebrating cultural heritage through contemporary design.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20 transform hover:scale-105 transition-all duration-500 group">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-pink-400 to-red-500 rounded-2xl flex items-center justify-center text-4xl transform group-hover:rotate-12 transition-transform">
              💎
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Our Values</h3>
            <p className="text-white/70">Quality, Integrity, Customer Satisfaction, and Innovation in every piece we offer, ensuring excellence in every stitch.</p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Hafiz Sajid Syed', role: 'Founder & CEO', image: '/n2.jpeg', emoji: '👔' },
              { name: 'Fatima Khan', role: 'Head Designer', image: '/n3.jpeg', emoji: '✂️' },
              { name: 'Ahmed Malik', role: 'Quality Control', image: '/n4.jpeg', emoji: '🔍' },
              { name: 'Zara Ahmed', role: 'Customer Relations', image: '/n5.jpeg', emoji: '💬' }
            ].map((member, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 transform hover:scale-105 transition-all duration-500">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/30">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 128px"
                    className="object-cover"
                  />
                </div>
                <div className="text-3xl mb-2">{member.emoji}</div>
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-purple-300">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { number: '15+', label: 'Years Experience', emoji: '⭐' },
            { number: '10k+', label: 'Happy Customers', emoji: '😊' },
            { number: '500+', label: 'Unique Designs', emoji: '🎨' },
            { number: '50+', label: 'Cities Served', emoji: '🌍' }
          ].map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
              <div className="text-4xl mb-2">{stat.emoji}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-20 border border-white/20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Premium Quality',
                desc: '100% authentic fabrics with rigorous quality checks',
                icon: '✨'
              },
              {
                title: 'Expert Craftsmanship',
                desc: 'Skilled artisans with decades of experience',
                icon: '🪡'
              },
              {
                title: 'Authentic Designs',
                desc: 'Traditional patterns with modern aesthetics',
                icon: '🎭'
              },
              {
                title: 'Sustainable Practices',
                desc: 'Eco-friendly materials and ethical production',
                icon: '🌱'
              },
              {
                title: 'Customer First',
                desc: 'Dedicated support and easy returns',
                icon: '❤️'
              },
              {
                title: 'Global Shipping',
                desc: 'Fast and reliable worldwide delivery',
                icon: '🚚'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="text-4xl">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: 'Aisha Rahman',
                comment: 'The quality of cotton suits is exceptional. Very comfortable and elegant design!',
                rating: 5,
                image: '/n6.jpeg'
              },
              {
                name: 'Sana Malik',
                comment: 'Best lawn suits I have ever bought. The fabric is so soft and breathable.',
                rating: 5,
                image: '/n1.jpeg'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      sizes="64px"
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
                <p className="text-white/80 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Info */}
        <div className="text-center p-8 bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-3xl backdrop-blur-lg border border-white/20">
          <div className="text-5xl mb-4">👑</div>
          <p className="text-3xl font-bold text-white mb-2">Hafiz Sajid Syed</p>
          <p className="text-xl text-purple-300 mb-4">Founder & Administrator</p>
          <p className="text-lg text-white/80">sajid.syed@gmail.com</p>
          <div className="mt-6 flex justify-center space-x-4">
            <span className="px-4 py-2 bg-white/20 rounded-full text-white">📞 +1 (555) 123-4567</span>
            <span className="px-4 py-2 bg-white/20 rounded-full text-white">📍 New York, USA</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <Link
            href="/products"
            className="inline-block px-10 py-5 text-2xl font-bold text-white bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full hover:scale-110 transform transition-all duration-300 shadow-2xl"
          >
            Explore Our Collection
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