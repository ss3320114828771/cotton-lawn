'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Simulate form submission
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    }, 1500)
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
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-center animate-pulse">
            <p className="text-lg font-semibold">✓ Message sent successfully!</p>
            <p className="text-sm">We'll get back to you within 24 hours.</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center">
            <p className="text-lg font-semibold">✗ {error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Admin Info Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-500">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-3xl">
                  👑
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Hafiz Sajid Syed</h3>
                  <p className="text-purple-300">Founder & CEO</p>
                </div>
              </div>
              <div className="space-y-2 text-white/70">
                <p className="flex items-center space-x-2">
                  <span className="text-yellow-400">✉️</span>
                  <span>sajid.syed@gmail.com</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="text-yellow-400">📞</span>
                  <span>+1 (555) 123-4567</span>
                </p>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Visit Us</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">📍</div>
                  <div>
                    <p className="text-white font-semibold">Address</p>
                    <p className="text-white/70">123 Fashion Street<br />Design District<br />New York, NY 10001</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🕒</div>
                  <div>
                    <p className="text-white font-semibold">Business Hours</p>
                    <p className="text-white/70">Monday - Friday: 9:00 AM - 8:00 PM</p>
                    <p className="text-white/70">Saturday: 10:00 AM - 6:00 PM</p>
                    <p className="text-white/70">Sunday: 11:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Quick Contact</h3>
              <div className="space-y-3">
                <a href="tel:+15551234567" className="flex items-center space-x-3 text-white/70 hover:text-white transition-colors">
                  <span className="text-2xl">📞</span>
                  <span>+1 (555) 123-4567</span>
                </a>
                <a href="mailto:sajid.syed@gmail.com" className="flex items-center space-x-3 text-white/70 hover:text-white transition-colors">
                  <span className="text-2xl">✉️</span>
                  <span>sajid.syed@gmail.com</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-white/70 hover:text-white transition-colors">
                  <span className="text-2xl">💬</span>
                  <span>Live Chat</span>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                  📘
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-600 flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                  📷
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-300 to-blue-500 flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                  🐦
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center text-2xl hover:scale-110 transition-transform">
                  📌
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="" className="bg-gray-800">Select a subject</option>
                      <option value="general" className="bg-gray-800">General Inquiry</option>
                      <option value="orders" className="bg-gray-800">Order Status</option>
                      <option value="returns" className="bg-gray-800">Returns & Exchanges</option>
                      <option value="wholesale" className="bg-gray-800">Wholesale</option>
                      <option value="feedback" className="bg-gray-800">Feedback</option>
                      <option value="other" className="bg-gray-800">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Write your message here..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 bg-white/20 border border-white/30 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="terms" className="text-white/70 text-sm">
                    I agree to the processing of my data and accept the{' '}
                    <Link href="/privacy" className="text-purple-300 hover:text-purple-200">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Find Us Here</h2>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.9147703893!2d-74.1197631730915!3d40.69740344166063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
            <div className="mt-6 text-center text-white/70">
              <p className="flex items-center justify-center space-x-2">
                <span>📍</span>
                <span>123 Fashion Street, Design District, New York, NY 10001</span>
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="mt-12 text-center">
          <p className="text-white/70 mb-4">Have questions? Check our</p>
          <Link
            href="/faq"
            className="inline-block px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
          >
            Frequently Asked Questions
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