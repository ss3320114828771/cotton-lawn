import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              Cotton Suits
            </h3>
            <p className="text-gray-300">
              Premium quality cotton and lawn suits for every occasion.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/cart" className="text-gray-300 hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-white transition-colors">Returns</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📍 123 Fashion Street</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>✉️ sajid.syed@gmail.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Cotton Suits E-Commerce. All rights reserved.</p>
          <p className="text-sm mt-2">Admin: Hafiz Sajid Syed</p>
        </div>
      </div>
    </footer>
  )
}