import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

// GET /api/products/[id] - Get single product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Fetch product from database
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
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

// PUT /api/products/[id] - Update product (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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
    const { name, description, price, category, image, stock } = body

    // Validate required fields
    if (!name || !description || !price || !category || !image) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        image,
        stock: parseInt(stock) || 0
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    })

  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if product is in any orders
    const productInOrders = await prisma.orderItem.findFirst({
      where: { productId: id }
    })

    if (productInOrders) {
      // Instead of deleting, just mark as inactive or reduce stock to 0
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          stock: 0,
          name: `${existingProduct.name} (Discontinued)`
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Product marked as discontinued',
        product: updatedProduct
      })
    }

    // Delete product if not in any orders
    await prisma.product.delete({
      where: { id }
    })

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

// PATCH /api/products/[id] - Partially update product (Admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

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
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Prepare update data (only include fields that are provided)
    const updateData: any = {}
    
    if (body.name) updateData.name = body.name
    if (body.description) updateData.description = body.description
    if (body.price) updateData.price = parseFloat(body.price)
    if (body.category) updateData.category = body.category
    if (body.image) updateData.image = body.image
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock)

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    })

  } catch (error) {
    console.error('Product patch error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}