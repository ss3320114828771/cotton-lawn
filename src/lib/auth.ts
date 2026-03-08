import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Type definitions
interface TokenPayload {
  id: string
  email: string
  name: string
  role: string
  iat?: number
  exp?: number
}

// Simple hash function for development
export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error('Password is required')
  }
  return `hashed_${password}`
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  if (!password || !hashedPassword) {
    return false
  }
  return hashedPassword === `hashed_${password}`
}

// Custom JWT implementation without jsonwebtoken package
export function createToken(payload: TokenPayload): string {
  try {
    if (!payload || !payload.id || !payload.email) {
      throw new Error('Invalid payload for token creation')
    }

    // Create header
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    }

    // Add timestamps
    const iat = Math.floor(Date.now() / 1000)
    const exp = iat + (7 * 24 * 60 * 60) // 7 days

    const tokenPayload = {
      ...payload,
      iat,
      exp
    }

    // Encode header and payload
    const encodedHeader = base64UrlEncode(JSON.stringify(header))
    const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload))

    // Create signature
    const signature = createSignature(`${encodedHeader}.${encodedPayload}`)

    return `${encodedHeader}.${encodedPayload}.${signature}`
  } catch (error) {
    console.error('Token creation error:', error)
    throw new Error('Failed to create authentication token')
  }
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    if (!token) {
      return null
    }

    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const [encodedHeader, encodedPayload, signature] = parts

    // Verify signature
    const expectedSignature = createSignature(`${encodedHeader}.${encodedPayload}`)
    if (signature !== expectedSignature) {
      console.error('Invalid token signature')
      return null
    }

    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as TokenPayload

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.error('Token expired')
      return null
    }

    return payload
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export async function getSession(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) {
      return null
    }
    
    const payload = verifyToken(token)
    return payload
  } catch (error) {
    console.error('Session retrieval error:', error)
    return null
  }
}

// Helper function to check if user is admin
export function isAdmin(payload: TokenPayload | null): boolean {
  return payload?.role === 'admin'
}

// Helper function to check if user is authenticated
export function isAuthenticated(payload: TokenPayload | null): boolean {
  return payload !== null && payload.id !== undefined
}

// Helper function to get user from token
export function getUserFromToken(token: string): TokenPayload | null {
  return verifyToken(token)
}

// Helper function to clear session (logout)
export async function clearSession() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('token')
    return true
  } catch (error) {
    console.error('Session clear error:', error)
    return false
  }
}

// Base64 URL encoding (replacement for Buffer)
function base64UrlEncode(str: string): string {
  // Convert string to base64
  const base64 = btoa(unescape(encodeURIComponent(str)))
  
  // Make URL safe
  return base64
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

// Base64 URL decoding
function base64UrlDecode(str: string): string {
  // Add padding back
  let base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  
  while (base64.length % 4) {
    base64 += '='
  }
  
  // Decode
  return decodeURIComponent(escape(atob(base64)))
}

// Create HMAC SHA256 signature (simplified version)
function createSignature(data: string): string {
  // This is a simplified signature for development
  // In production, you should use a proper crypto library
  const crypto = require('crypto')
  const hmac = crypto.createHmac('sha256', JWT_SECRET)
  hmac.update(data)
  return base64UrlEncode(hmac.digest('base64'))
}

// Alternative simple signature (if crypto is not available)
function createSimpleSignature(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Combine with secret
  const combined = data + JWT_SECRET + Math.abs(hash).toString(36)
  
  // Create simple hash
  let signature = ''
  for (let i = 0; i < combined.length; i++) {
    signature += combined.charCodeAt(i).toString(16)
  }
  
  return base64UrlEncode(signature.slice(0, 32))
}

// Generate random token (alternative to JWT)
export function generateSimpleToken(payload: any): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'simple', typ: 'auth' }))
  const data = base64UrlEncode(JSON.stringify({
    ...payload,
    iat: Date.now(),
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000)
  }))
  
  const signature = createSimpleSignature(`${header}.${data}`)
  
  return `${header}.${data}.${signature}`
}

// Verify simple token
export function verifySimpleToken(token: string): any | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const [header, data, signature] = parts
    
    // Verify signature
    const expectedSignature = createSimpleSignature(`${header}.${data}`)
    if (signature !== expectedSignature) return null
    
    // Decode data
    const payload = JSON.parse(base64UrlDecode(data))
    
    // Check expiration
    if (payload.exp && payload.exp < Date.now()) return null
    
    return payload
  } catch {
    return null
  }
}

// Parse JWT without verification (for debugging)
export function parseToken(token: string): { header: any; payload: any } | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const header = JSON.parse(base64UrlDecode(parts[0]))
    const payload = JSON.parse(base64UrlDecode(parts[1]))
    
    return { header, payload }
  } catch {
    return null
  }
}

// Cookie utilities
export function setAuthCookie(token: string): void {
  if (typeof document !== 'undefined') {
    const expires = new Date()
    expires.setDate(expires.getDate() + 7) // 7 days
    
    document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  }
}

export function removeAuthCookie(): void {
  if (typeof document !== 'undefined') {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
}

export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'token') {
      return value
    }
  }
  return null
}