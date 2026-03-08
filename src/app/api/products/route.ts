import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

// GET /api/products - Get all products with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Filtering
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')
    const inStock = searchParams.get('inStock') === 'true'

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (inStock) {
      where.stock = { gt: 0 }
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where })

    // Get products
    const products = await prisma.product.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    })

    // Get unique categories for filter
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    })

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        categories: categories.map(c => c.category)
      }
    })

  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product (Admin only)
export async function POST(request: Request) {
  try {
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
        { error: 'Not authorized. Admin access required.' },
        { status: 403 }
      )
    }

    // Get request body
    const body = await request.json()
    const { name, description, price, category, image, stock } = body

    // Validate required fields
    const errors = []

    if (!name || name.trim().length < 3) {
      errors.push('Product name must be at least 3 characters long')
    }

    if (!description || description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long')
    }

    if (!price || isNaN(price) || price <= 0) {
      errors.push('Price must be a positive number')
    }

    if (!category || category.trim().length < 2) {
      errors.push('Category is required')
    }

    if (!image) {
      errors.push('Product image is required')
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    // Generate product ID
    const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create product
    const product = await prisma.product.create({
      data: {
        id: productId,
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: category.trim(),
        image: image.trim(),
        stock: parseInt(stock) || 0
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product
    }, { status: 201 })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products - Bulk delete products (Admin only)
export async function DELETE(request: Request) {
  try {
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
        { error: 'Not authorized. Admin access required.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productIds = searchParams.get('ids')?.split(',')

    if (!productIds || productIds.length === 0) {
      return NextResponse.json(
        { error: 'No product IDs provided' },
        { status: 400 }
      )
    }

    // Check if any products are in orders
    const productsInOrders = await prisma.orderItem.findMany({
      where: {
        productId: { in: productIds }
      },
      select: { productId: true },
      distinct: ['productId']
    })

    const productsInOrdersIds = productsInOrders.map(item => item.productId)
    
    const safeToDelete = productIds.filter(id => !productsInOrdersIds.includes(id))
    const productsToDiscontinue = productIds.filter(id => productsInOrdersIds.includes(id))

    // Delete products not in orders
    if (safeToDelete.length > 0) {
      await prisma.product.deleteMany({
        where: {
          id: { in: safeToDelete }
        }
      })
    }

    // Mark products as discontinued that are in orders
    if (productsToDiscontinue.length > 0) {
      // Get products to discontinue
      const products = await prisma.product.findMany({
        where: { id: { in: productsToDiscontinue } },
        select: { id: true, name: true }
      })
      
      // Update each product individually with (Discontinued) suffix
      for (const product of products) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            stock: 0,
            name: `${product.name} (Discontinued)`
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${safeToDelete.length} products. ${productsToDiscontinue.length} products marked as discontinued.`,
      deleted: safeToDelete.length,
      discontinued: productsToDiscontinue.length
    })

  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete products' },
      { status: 500 }
    )
  }
}

// PATCH /api/products - Bulk update products (Admin only)
export async function PATCH(request: Request) {
  try {
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
        { error: 'Not authorized. Admin access required.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { productIds, updateData } = body

    if (!productIds || productIds.length === 0) {
      return NextResponse.json(
        { error: 'No product IDs provided' },
        { status: 400 }
      )
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No update data provided' },
        { status: 400 }
      )
    }

    // Handle discount separately (needs individual updates)
    if (updateData.discount) {
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true }
      })
      
      for (const product of products) {
        const discountedPrice = product.price * (1 - updateData.discount / 100)
        await prisma.product.update({
          where: { id: product.id },
          data: { price: discountedPrice }
        })
      }
      
      // Remove discount from updateData to avoid double processing
      delete updateData.discount
    }

    // Bulk update remaining fields
    if (Object.keys(updateData).length > 0) {
      const data: any = {}
      if (updateData.category) data.category = updateData.category
      if (updateData.price !== undefined) data.price = parseFloat(updateData.price)
      if (updateData.stock !== undefined) data.stock = parseInt(updateData.stock)
      if (updateData.name) data.name = updateData.name
      if (updateData.description) data.description = updateData.description
      if (updateData.image) data.image = updateData.image

      await prisma.product.updateMany({
        where: {
          id: { in: productIds }
        },
        data
      })
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${productIds.length} products successfully`,
      updatedCount: productIds.length
    })

  } catch (error) {
    console.error('Bulk update error:', error)
    return NextResponse.json(
      { error: 'Failed to update products' },
      { status: 500 }
    )
  }
}