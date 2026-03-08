import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

// GET - Get all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Simple pagination
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Simple filters
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Build filter
    const where: any = {}
    if (category && category !== 'all') where.category = category
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }

    // Get products
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: limit }),
      prisma.product.count({ where })
    ])

    // Get categories
    const cats = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    })

    return NextResponse.json({
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      filters: { categories: cats.map((c: any) => c.category) }
    })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST - Create product (Admin only)
export async function POST(request: Request) {
  try {
    // Auth check
    const token = (await cookies()).get('token')?.value
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    
    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (payload.role !== 'admin') return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

    // Get data
    const { name, description, price, category, image, stock } = await request.json()

    // Simple validation
    if (!name || !price) return NextResponse.json({ error: 'Name and price required' }, { status: 400 })

    // Create product
    const product = await prisma.product.create({
      data: {
        id: `prod_${Date.now()}`,
        name,
        description: description || '',
        price: Number(price),
        category: category || 'General',
        image: image || '/placeholder.jpg',
        stock: Number(stock) || 0
      }
    })

    return NextResponse.json({ success: true, product }, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

// DELETE - Delete products (Admin only)
export async function DELETE(request: Request) {
  try {
    // Auth check
    const token = (await cookies()).get('token')?.value
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Not authorized' }, { status: 403 })

    // Get IDs
    const ids = new URL(request.url).searchParams.get('ids')?.split(',') || []
    if (!ids.length) return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })

    // Delete all (simplified - no order check)
    await prisma.product.deleteMany({ where: { id: { in: ids } } })

    return NextResponse.json({ success: true, message: `Deleted ${ids.length} products` })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete products' }, { status: 500 })
  }
}