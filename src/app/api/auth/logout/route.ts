import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Create response
    const response = NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    })

    // Clear the token cookie by setting it with empty value and immediate expiration
    response.cookies.set({
      name: 'token',
      value: '',
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    // Also clear any other auth-related cookies if they exist
    response.cookies.set({
      name: 'session',
      value: '',
      expires: new Date(0),
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}

// Also handle GET requests for logout (optional)
export async function GET() {
  try {
    const cookieStore = await cookies()
    
    const response = NextResponse.redirect(new URL('/signin', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))

    response.cookies.set({
      name: 'token',
      value: '',
      expires: new Date(0),
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.redirect(new URL('/signin', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  }
}