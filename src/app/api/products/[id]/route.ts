import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

// GET /api/products/[id] - Get single product by ID (DUMMY DATA)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // ✅ DUMMY PRODUCTS DATA - No database needed
    const dummyProducts: any = {
      '1': {
        id: '1',
        name: 'Premium Cotton Suit - Royal Blue',
        description: 'Elegant blue cotton suit with delicate embroidery. Made from 100% organic cotton, perfect for summer occasions.',
        price: 89.99,
        category: 'Cotton',
        image: '/n1.jpeg',
        stock: 15,
        createdAt: new Date().toISOString()
      },
      '2': {
        id: '2',
        name: 'Luxury Lawn Suit - Blossom Pink',
        description: 'Beautiful pink lawn suit with traditional design. Lightweight and breathable fabric for all-day comfort.',
        price: 129.99,
        category: 'Lawn',
        image: '/n2.jpeg',
        stock: 10,
        createdAt: new Date().toISOString()
      },
      '3': {
        id: '3',
        name: 'Designer Cotton Suit - Emerald Green',
        description: 'Stylish green cotton suit with modern pattern. Features intricate thread work and comfortable fit.',
        price: 99.99,
        category: 'Cotton',
        image: '/n3.jpeg',
        stock: 20,
        createdAt: new Date().toISOString()
      },
      '4': {
        id: '4',
        name: 'Premium Lawn Suit - Royal Purple',
        description: 'Royal purple lawn suit with golden thread work. Perfect for festive occasions and celebrations.',
        price: 149.99,
        category: 'Lawn',
        image: '/n4.jpeg',
        stock: 8,
        createdAt: new Date().toISOString()
      },
      '5': {
        id: '5',
        name: 'Casual Cotton Suit - Sunshine Yellow',
        description: 'Comfortable yellow cotton suit for daily wear. Simple yet elegant design with breathable fabric.',
        price: 79.99,
        category: 'Cotton',
        image: '/n5.jpeg',
        stock: 25,
        createdAt: new Date().toISOString()
      },
      '6': {
        id: '6',
        name: 'Festival Lawn Suit - Ruby Red',
        description: 'Celebrate in style with our Festival Lawn Suit in vibrant Ruby Red. Features heavy embroidery work.',
        price: 199.99,
        category: 'Lawn',
        image: '/n6.jpeg',
        stock: 5,
        createdAt: new Date().toISOString()
      }
    }

    const product = dummyProducts[id]

    if (!product) {
      // If ID not found, return a generic product
      return NextResponse.json({
        success: true,
        product: {
          id: id,
          name: `Product ${id}`,
          description: 'This is a sample product description.',
          price: 99.99,
          category: 'Cotton',
          image: '/n1.jpeg',
          stock: 10,
          createdAt: new Date().toISOString()
        }
      })
    }

    return NextResponse.json({
      success: true,
      product
    })

  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product (Admin only) - DUMMY
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check authentication
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

    // Check if user is admin
    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    // Get request body
    const body = await request.json()

    // ✅ Return success with dummy data
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: {
        id: id,
        ...body,
        price: parseFloat(body.price) || 99.99,
        stock: parseInt(body.stock) || 10
      }
    })

  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (Admin only) - DUMMY
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check authentication
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

    // Check if user is admin
    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    // ✅ Always return success
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Product delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

// PATCH /api/products/[id] - Partially update product (Admin only) - DUMMY
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check authentication
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

    // Check if user is admin
    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      )
    }

    // Get request body
    const body = await request.json()

    // ✅ Return success with dummy data
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: {
        id: id,
        name: body.name || 'Sample Product',
        description: body.description || 'Sample description',
        price: body.price ? parseFloat(body.price) : 99.99,
        category: body.category || 'Cotton',
        image: body.image || '/n1.jpeg',
        stock: body.stock ? parseInt(body.stock) : 10
      }
    })

  } catch (error) {
    console.error('Product patch error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}