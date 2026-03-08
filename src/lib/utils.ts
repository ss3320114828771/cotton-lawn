/**
 * Utility functions without external npm packages
 */

// Simple class name merger (replacement for clsx + twMerge)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ')
}

// Format price as USD
export function formatPrice(price: number): string {
  // Handle invalid numbers
  if (typeof price !== 'number' || isNaN(price)) {
    return '$0.00'
  }

  // Format with 2 decimal places
  const formatted = price.toFixed(2)
  
  // Add commas for thousands
  const parts = formatted.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  return `$${parts.join('.')}`
}

// Format price with custom options
export function formatPriceCustom(
  price: number, 
  options?: {
    currency?: string
    locale?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
): string {
  const {
    currency = '$',
    locale = 'en-US',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options || {}

  if (typeof price !== 'number' || isNaN(price)) {
    return `${currency}0.00`
  }

  const formatted = price.toFixed(maximumFractionDigits)
  const parts = formatted.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  // Ensure minimum fraction digits
  while (parts[1] && parts[1].length < minimumFractionDigits) {
    parts[1] += '0'
  }
  
  return `${currency}${parts.join('.')}`
}

// Generate random token
export function generateToken(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  
  // Generate first part (15 chars)
  for (let i = 0; i < 15; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  
  // Add separator
  token += '_'
  
  // Generate second part (15 chars)
  for (let i = 0; i < 15; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  
  return token
}

// Generate short ID
export function generateShortId(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  
  for (let i = 0; i < length; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  
  return id
}

// Generate UUID v4 compatible format
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Format date
export function formatDate(date: Date | string | number, options?: {
  format?: 'short' | 'long' | 'full'
  includeTime?: boolean
}): string {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date'
  }
  
  const {
    format = 'short',
    includeTime = false
  } = options || {}
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  const day = d.getDate()
  const month = d.getMonth()
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  
  let dateStr = ''
  
  switch (format) {
    case 'short':
      dateStr = `${months[month]} ${day}, ${year}`
      break
    case 'long':
      dateStr = `${monthsFull[month]} ${day}, ${year}`
      break
    case 'full':
      dateStr = `${monthsFull[month]} ${day}, ${year}`
      break
  }
  
  if (includeTime) {
    dateStr += ` ${hours}:${minutes}`
  }
  
  return dateStr
}

// Truncate text
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + suffix
}

// Slugify string
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/&/g, '-and-')          // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')        // Remove all non-word chars
    .replace(/\-\-+/g, '-')          // Replace multiple - with single -
}

// Calculate discount percentage
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// Check if object is empty
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0
}

// Get nested object property safely
export function getNestedValue(obj: any, path: string, defaultValue?: any): any {
  const keys = path.split('.')
  let result = obj
  
  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object') {
      return defaultValue
    }
    result = result[key]
  }
  
  return result === undefined ? defaultValue : result
}

// Generate random color
export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number format (simple)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/
  return phoneRegex.test(phone)
}

// Capitalize first letter
export function capitalizeFirst(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Capitalize each word
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, l => l.toUpperCase())
}

// Convert string to camelCase
export function toCamelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

// Convert string to snake_case
export function toSnakeCase(str: string): string {
  return str
    .replace(/\s+/g, '_')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}

// Round to decimal places
export function roundTo(value: number, decimals: number): number {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals)
}

// Parse query string
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {}
  const pairs = queryString.replace(/^\?/, '').split('&')
  
  for (const pair of pairs) {
    if (!pair) continue
    const [key, value] = pair.split('=')
    params[decodeURIComponent(key)] = decodeURIComponent(value || '')
  }
  
  return params
}

// Build query string
export function buildQueryString(params: Record<string, any>): string {
  const pairs: string[] = []
  
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  }
  
  return pairs.length ? `?${pairs.join('&')}` : ''
}