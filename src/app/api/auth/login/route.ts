import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyPassword, createToken } from '@/lib/auth'

// In-memory users (same as signup)
const users: any[] = [
  {
    id: 'admin_1',
    name: 'Hafiz Sajid Syed',
    email: 'sajid.syed@gmail.com',
    password: 'hashed_demo123', // This matches verifyPassword function
    role: 'admin'
  }
]

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user in memory (case-insensitive)
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    )

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create simple token
    const token = createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    })

    // Set cookie in response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

    // Set cookie on the response object
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // 'strict' se 'lax' better hai redirect ke liye
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to check login status
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  
  if (!token) {
    return NextResponse.json({ authenticated: false })
  }
  
  // Simple token verification (optional)
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role
      }
    })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}