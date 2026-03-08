import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken, hashPassword, verifyPassword } from '@/lib/auth'

// GET /api/user - Get current user profile
export async function GET() {
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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user stats
    const [orderCount, cartItems] = await Promise.all([
      prisma.order.count({
        where: { userId: user.id }
      }),
      prisma.cart.findUnique({
        where: { userId: user.id },
        select: { items: true }
      })
    ])

    const cartItemCount = (cartItems?.items as any[])?.reduce(
      (sum, item) => sum + (item.quantity || 0), 
      0
    ) || 0

    return NextResponse.json({
      success: true,
      user,
      stats: {
        totalOrders: orderCount,
        cartItems: cartItemCount
      }
    })

  } catch (error) {
    console.error('User fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

// PUT /api/user - Update user profile
export async function PUT(request: Request) {
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

    // Get request body
    const body = await request.json()
    const { name, currentPassword, newPassword } = body

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    // Update name if provided
    if (name && name.trim().length >= 2) {
      updateData.name = name.trim()
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isValid = await verifyPassword(currentPassword, user.password)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      // Validate new password
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters long' },
          { status: 400 }
        )
      }

      // Hash new password
      updateData.password = await hashPassword(newPassword)
    }

    // If no updates provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: payload.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

// DELETE /api/user - Delete user account
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

    // Get password from request body for verification
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required to delete account' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Check if user has any orders
    const orderCount = await prisma.order.count({
      where: { userId: payload.id }
    })

    if (orderCount > 0) {
      // Instead of deleting, just anonymize the user
      const anonymousId = `deleted_user_${Date.now()}`
      await prisma.user.update({
        where: { id: payload.id },
        data: {
          email: `${anonymousId}@deleted.com`,
          name: 'Deleted User',
          password: 'deleted',
          role: 'deleted'
        }
      })

      // Clear auth cookie
      const response = NextResponse.json({
        success: true,
        message: 'Account deactivated successfully'
      })

      response.cookies.set({
        name: 'token',
        value: '',
        expires: new Date(0),
        path: '/'
      })

      return response
    } else {
      // Delete user if no orders
      await prisma.user.delete({
        where: { id: payload.id }
      })

      // Clear auth cookie
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
    }

  } catch (error) {
    console.error('User delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}

// PATCH /api/user - Partial update (for specific fields)
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

    // Get request body
    const body = await request.json()
    const updateData: any = {}

    // Only allow specific fields to be updated
    if (body.name && body.name.trim().length >= 2) {
      updateData.name = body.name.trim()
    }

    if (body.email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email: body.email.toLowerCase().trim() }
      })

      if (existingUser && existingUser.id !== payload.id) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        )
      }

      updateData.email = body.email.toLowerCase().trim()
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: payload.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('User patch error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}