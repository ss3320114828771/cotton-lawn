import { NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'

// In-memory user storage (temporary, will reset on server restart)
const users: any[] = [
  // Demo admin user
  {
    id: 'admin_1',
    name: 'Hafiz Sajid Syed',
    email: 'sajid.syed@gmail.com',
    password: 'hashed_demo123', // In real app, this would be hashed
    role: 'admin'
  }
]

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists (case-insensitive)
    const existingUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    )

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password (simple version)
    const hashedPassword = await hashPassword(password)

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user'
    }

    // Add to in-memory array
    users.push(newUser)

    // Return user data (without password)
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to list users (for debugging)
export async function GET() {
  // Return users without passwords
  const safeUsers = users.map(({ password, ...user }) => user)
  return NextResponse.json({ users: safeUsers })
}