import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

// In-memory cart storage (temporary, will reset on server restart)
const carts: any = {}

// GET /api/cart - Get user's cart
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get or create cart from memory
    if (!carts[payload.id]) {
      carts[payload.id] = {
        id: `cart_${payload.id}`,
        userId: payload.id,
        items: []
      }
    }

    return NextResponse.json({
      success: true,
      cart: carts[payload.id]
    })

  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Dummy products data
    const dummyProducts: any = {
      '1': { id: '1', name: 'Premium Cotton Suit', price: 89.99, image: '/n1.jpeg', stock: 15 },
      '2': { id: '2', name: 'Luxury Lawn Suit', price: 129.99, image: '/n2.jpeg', stock: 10 },
      '3': { id: '3', name: 'Designer Cotton Suit', price: 99.99, image: '/n3.jpeg', stock: 20 },
      '4': { id: '4', name: 'Premium Lawn Suit', price: 149.99, image: '/n4.jpeg', stock: 8 },
      '5': { id: '5', name: 'Casual Cotton Suit', price: 79.99, image: '/n5.jpeg', stock: 25 },
      '6': { id: '6', name: 'Festival Lawn Suit', price: 199.99, image: '/n6.jpeg', stock: 5 }
    }

    const product = dummyProducts[productId]

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Get or create cart
    if (!carts[payload.id]) {
      carts[payload.id] = {
        id: `cart_${payload.id}`,
        userId: payload.id,
        items: []
      }
    }

    const cart = carts[payload.id]
    const currentItems = cart.items || []
    
    // Check if product already in cart
    const existingItemIndex = currentItems.findIndex(
      (item: any) => item.productId === productId
    )

    if (existingItemIndex >= 0) {
      // Update quantity
      currentItems[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      currentItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      })
    }

    cart.items = currentItems

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      cart: cart
    })

  } catch (error) {
    console.error('Cart add error:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { productId, quantity } = await request.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      )
    }

    if (quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity cannot be negative' },
        { status: 400 }
      )
    }

    // Get cart
    const cart = carts[payload.id]
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    const currentItems = cart.items || []
    
    if (quantity === 0) {
      // Remove item
      cart.items = currentItems.filter(
        (item: any) => item.productId !== productId
      )

      return NextResponse.json({
        success: true,
        message: 'Item removed from cart',
        cart: cart
      })
    } else {
      // Update quantity
      const itemIndex = currentItems.findIndex(
        (item: any) => item.productId === productId
      )

      if (itemIndex >= 0) {
        currentItems[itemIndex].quantity = quantity
        cart.items = currentItems
        
        return NextResponse.json({
          success: true,
          message: 'Cart updated',
          cart: cart
        })
      } else {
        return NextResponse.json(
          { error: 'Item not found in cart' },
          { status: 404 }
        )
      }
    }

  } catch (error) {
    console.error('Cart update error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Remove item from cart or clear cart
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const clearAll = searchParams.get('clearAll') === 'true'

    // Get cart
    const cart = carts[payload.id]
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    if (clearAll) {
      // Clear entire cart
      cart.items = []
      return NextResponse.json({
        success: true,
        message: 'Cart cleared',
        cart: cart
      })
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Remove specific item
    cart.items = (cart.items || []).filter(
      (item: any) => item.productId !== productId
    )

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
      cart: cart
    })

  } catch (error) {
    console.error('Cart delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete from cart' },
      { status: 500 }
    )
  }
}

// Helper function to calculate cart total
export function calculateCartTotal(items: any[]) {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
}

// Helper function to get cart item count
export function getCartItemCount(items: any[]) {
  return items.reduce((count, item) => {
    return count + item.quantity
  }, 0)
}