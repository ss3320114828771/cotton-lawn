import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

    // Find or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: payload.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: payload.id,
          items: []
        }
      })
    }

    return NextResponse.json({
      success: true,
      cart: cart
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

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: payload.id }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: payload.id,
          items: []
        }
      })
    }

    // Parse current items
    const currentItems = (cart.items as any[]) || []
    
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

    // Update cart
    const updatedCart = await prisma.cart.update({
      where: { userId: payload.id },
      data: {
        items: currentItems
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Item added to cart',
      cart: updatedCart
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
    const cart = await prisma.cart.findUnique({
      where: { userId: payload.id }
    })

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    // Parse current items
    const currentItems = (cart.items as any[]) || []
    
    if (quantity === 0) {
      // Remove item
      const updatedItems = currentItems.filter(
        (item: any) => item.productId !== productId
      )
      
      const updatedCart = await prisma.cart.update({
        where: { userId: payload.id },
        data: {
          items: updatedItems
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Item removed from cart',
        cart: updatedCart
      })
    } else {
      // Update quantity
      const itemIndex = currentItems.findIndex(
        (item: any) => item.productId === productId
      )

      if (itemIndex >= 0) {
        currentItems[itemIndex].quantity = quantity
        
        const updatedCart = await prisma.cart.update({
          where: { userId: payload.id },
          data: {
            items: currentItems
          }
        })

        return NextResponse.json({
          success: true,
          message: 'Cart updated',
          cart: updatedCart
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
    const cart = await prisma.cart.findUnique({
      where: { userId: payload.id }
    })

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      )
    }

    if (clearAll) {
      // Clear entire cart
      const updatedCart = await prisma.cart.update({
        where: { userId: payload.id },
        data: {
          items: []
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Cart cleared',
        cart: updatedCart
      })
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Remove specific item
    const currentItems = (cart.items as any[]) || []
    const updatedItems = currentItems.filter(
      (item: any) => item.productId !== productId
    )

    const updatedCart = await prisma.cart.update({
      where: { userId: payload.id },
      data: {
        items: updatedItems
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
      cart: updatedCart
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