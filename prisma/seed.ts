import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simple hash function (for development only - in production use proper bcrypt)
async function simpleHash(password: string): Promise<string> {
  // This is a simple hash for development
  // In production, you should use bcrypt
  return `hashed_${password}_${Date.now()}`
}

async function main() {
  console.log('Starting seeding...')

  // Get admin details from environment or use defaults
  const adminEmail = process.env.ADMIN_EMAIL || 'sajid.syed@gmail.com'
  const adminName = process.env.ADMIN_NAME || 'Hafiz Sajid Syed'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456'
  
  // Simple hash for development
  const hashedPassword = await simpleHash(adminPassword)

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      role: 'admin'
    }
  })

  console.log('Admin user created:', admin.email)

  // Sample products with detailed descriptions
  const products = [
    {
      name: 'Premium Cotton Suit - Royal Blue',
      description: `Experience the epitome of comfort and style with our Premium Cotton Suit in Royal Blue. 
      
      Features:
      • 100% organic cotton fabric
      • Delicate embroidery on neckline
      • Breathable and lightweight
      • Perfect for summer occasions
      • Easy care and maintenance
      
      Care Instructions: Gentle machine wash cold, do not bleach, iron on medium heat.`,
      price: 89.99,
      category: 'Cotton',
      image: '/n1.jpeg',
      stock: 15
    },
    {
      name: 'Luxury Lawn Suit - Blossom Pink',
      description: `Elevate your wardrobe with our Luxury Lawn Suit in Blossom Pink. This exquisite piece combines traditional craftsmanship with modern design.
      
      Features:
      • Premium quality lawn fabric
      • Intricate thread work
      • Lightweight and airy
      • Ideal for all-day wear
      • Fade-resistant colors
      
      Care Instructions: Dry clean recommended, or gentle hand wash.`,
      price: 129.99,
      category: 'Lawn',
      image: '/n2.jpeg',
      stock: 10
    },
    {
      name: 'Designer Cotton Suit - Emerald Green',
      description: `Make a statement with our Designer Cotton Suit in stunning Emerald Green. A perfect blend of tradition and contemporary style.
      
      Features:
      • High-quality cotton fabric
      • Modern geometric patterns
      • Comfortable fit
      • Versatile styling options
      • Durable construction
      
      Care Instructions: Machine wash cold with similar colors.`,
      price: 99.99,
      category: 'Cotton',
      image: '/n3.jpeg',
      stock: 20
    },
    {
      name: 'Premium Lawn Suit - Royal Purple',
      description: `Indulge in luxury with our Premium Lawn Suit in Royal Purple. This masterpiece features intricate golden thread work and premium fabric.
      
      Features:
      • Superfine lawn fabric
      • Golden thread embroidery
      • Rich, deep color
      • Perfect for weddings
      • Includes dupatta
      
      Care Instructions: Dry clean only to preserve embroidery.`,
      price: 149.99,
      category: 'Lawn',
      image: '/n4.jpeg',
      stock: 8
    },
    {
      name: 'Casual Cotton Suit - Sunshine Yellow',
      description: `Brighten your day with our Casual Cotton Suit in cheerful Sunshine Yellow. Perfect for everyday wear with exceptional comfort.
      
      Features:
      • Soft cotton fabric
      • Minimalist design
      • Breathable material
      • Easy to style
      • Low maintenance
      
      Care Instructions: Machine wash warm, tumble dry low.`,
      price: 79.99,
      category: 'Cotton',
      image: '/n5.jpeg',
      stock: 25
    },
    {
      name: 'Festival Lawn Suit - Ruby Red',
      description: `Celebrate in style with our Festival Lawn Suit in vibrant Ruby Red. This festive piece combines traditional elegance with contemporary flair.
      
      Features:
      • Premium quality lawn
      • Heavy embroidery work
      • Vibrant color
      • Festival special design
      • Complete 3-piece suit
      
      Care Instructions: Dry clean recommended.`,
      price: 199.99,
      category: 'Lawn',
      image: '/n6.jpeg',
      stock: 5
    }
  ]

  // Create products
  for (const product of products) {
    const productId = `product_${product.name.toLowerCase().replace(/\s+/g, '_')}`
    
    await prisma.product.upsert({
      where: { id: productId },
      update: product,
      create: {
        id: productId,
        ...product
      }
    })
  }

  console.log(`Created ${products.length} products`)

  // Create a sample cart for admin (optional)
  await prisma.cart.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      items: []
    }
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })