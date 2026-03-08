export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt: Date
}