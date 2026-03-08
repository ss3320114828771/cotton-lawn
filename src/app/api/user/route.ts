import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

// GET /api/user - Dummy user profile
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

    // ✅ DUMMY USER DATA - No database needed
    const dummyUser = {
      id: payload.id || 'user_123',
      email: payload.email || 'user@example.com',
      name: payload.name || 'Demo User',
      role: payload.role || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // ✅ DUMMY STATS
    const stats = {
      totalOrders: 5,
      cartItems: 2
    }

    return NextResponse.json({
      success: true,
      user: dummyUser,
      stats
    })

  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

// PUT /api/user - Update profile (dummy)
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

    const body = await request.json()
    
    // ✅ Always return success
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: payload.id,
        email: body.email || payload.email,
        name: body.name || payload.name,
        role: payload.role
      }
    })

  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

// DELETE /api/user - Delete account (dummy)
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

    // ✅ Always return success
    const response = NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })

    response.cookies.set({
      name: 'token',
      value: '',
      expires: new Date(0),
      path: '/'
    })

    return response

  } catch (error) {
    console.error('User delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}

// PATCH /api/user - Partial update (dummy)
export async function PATCH(request: Request) {
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

    const body = await request.json()

    // ✅ Always return success
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: payload.id,
        email: body.email || payload.email,
        name: body.name || payload.name,
        role: payload.role
      }
    })

  } catch (error) {
    console.error('User patch error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}