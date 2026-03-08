import { NextResponse } from 'next/server'

// GET - Dummy products return karo
export async function GET() {
  const dummyProducts = [
    { id: '1', name: 'Premium Cotton Suit', price: 89.99, category: 'Cotton', image: '/n1.jpeg' },
    { id: '2', name: 'Luxury Lawn Suit', price: 129.99, category: 'Lawn', image: '/n2.jpeg' },
    { id: '3', name: 'Designer Cotton Suit', price: 99.99, category: 'Cotton', image: '/n3.jpeg' },
    { id: '4', name: 'Festival Lawn Suit', price: 199.99, category: 'Lawn', image: '/n4.jpeg' },
  ]
  
  return NextResponse.json({ products: dummyProducts })
}