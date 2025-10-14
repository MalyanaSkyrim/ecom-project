import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface CreateProductData {
  storeId: string
  name: string
  slug: string
  description?: string
  price: number | string
  isActive?: boolean
  isFeatured?: boolean
  rating?: number
  totalSales?: number
}

/**
 * Sample product data for seeding
 */
const SAMPLE_PRODUCTS = [
  {
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description:
      'High-quality wireless headphones with active noise cancellation and 30-hour battery life.',
    price: 299.99,
    isFeatured: true,
    rating: 4.8,
    totalSales: 152,
  },
  {
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    description:
      'Adjustable office chair with lumbar support and breathable mesh back.',
    price: 449.99,
    isFeatured: true,
    rating: 4.6,
    totalSales: 89,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    slug: 'mechanical-gaming-keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches.',
    price: 159.99,
    isFeatured: false,
    rating: 4.7,
    totalSales: 203,
  },
  {
    name: '4K Webcam Pro',
    slug: '4k-webcam-pro',
    description:
      'Professional 4K webcam with auto-focus and built-in microphone.',
    price: 199.99,
    isFeatured: false,
    rating: 4.5,
    totalSales: 67,
  },
  {
    name: 'Portable SSD 1TB',
    slug: 'portable-ssd-1tb',
    description: 'Ultra-fast portable SSD with USB-C 3.2 Gen 2 connectivity.',
    price: 129.99,
    isFeatured: true,
    rating: 4.9,
    totalSales: 421,
  },
  {
    name: 'Smart LED Desk Lamp',
    slug: 'smart-led-desk-lamp',
    description:
      'Adjustable LED desk lamp with touch controls and wireless charging.',
    price: 79.99,
    isFeatured: false,
    rating: 4.4,
    totalSales: 134,
  },
  {
    name: 'Wireless Mouse Pro',
    slug: 'wireless-mouse-pro',
    description: 'Precision wireless mouse with programmable buttons.',
    price: 59.99,
    isFeatured: false,
    rating: 4.3,
    totalSales: 289,
  },
  {
    name: 'USB-C Hub 7-in-1',
    slug: 'usb-c-hub-7-in-1',
    description:
      '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader ports.',
    price: 49.99,
    isFeatured: false,
    rating: 4.2,
    totalSales: 178,
  },
  {
    name: 'Laptop Stand Aluminum',
    slug: 'laptop-stand-aluminum',
    description:
      'Adjustable aluminum laptop stand with heat dissipation design.',
    price: 39.99,
    isFeatured: false,
    rating: 4.6,
    totalSales: 256,
  },
  {
    name: 'Noise Cancelling Earbuds',
    slug: 'noise-cancelling-earbuds',
    description:
      'True wireless earbuds with active noise cancellation and 24-hour battery.',
    price: 149.99,
    isFeatured: true,
    rating: 4.7,
    totalSales: 312,
  },
]

/**
 * Create a single product
 */
export async function createSingleProduct(
  data: CreateProductData,
): Promise<{ id: string; name: string; slug: string; price: Prisma.Decimal }> {
  const product = await prisma.product.create({
    data: {
      storeId: data.storeId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: new Prisma.Decimal(data.price),
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      rating: data.rating ?? 0,
      totalSales: data.totalSales ?? 0,
    },
  })

  console.log(`✓ Created product: ${product.name} ($${product.price})`)
  return product
}

/**
 * Create multiple products for a store
 */
export async function createManyProducts(
  storeId: string,
  size: number,
): Promise<
  Array<{ id: string; name: string; slug: string; price: Prisma.Decimal }>
> {
  const products = []

  // Use sample products if size is small enough
  if (size <= SAMPLE_PRODUCTS.length) {
    for (let i = 0; i < size; i++) {
      const sampleProduct = SAMPLE_PRODUCTS[i]
      const product = await createSingleProduct({
        storeId,
        ...sampleProduct,
      })
      products.push(product)
    }
  } else {
    // First, create all sample products
    for (const sampleProduct of SAMPLE_PRODUCTS) {
      const product = await createSingleProduct({
        storeId,
        ...sampleProduct,
      })
      products.push(product)
    }

    // Then, create additional generic products
    const remaining = size - SAMPLE_PRODUCTS.length
    for (let i = 1; i <= remaining; i++) {
      const product = await createSingleProduct({
        storeId,
        name: `Product ${i + SAMPLE_PRODUCTS.length}`,
        slug: `product-${i + SAMPLE_PRODUCTS.length}`,
        description: `Description for product ${i + SAMPLE_PRODUCTS.length}`,
        price: Math.floor(Math.random() * 500) + 20, // Random price between $20-$520
        isFeatured: Math.random() > 0.7, // 30% chance of being featured
        rating: Math.random() * 2 + 3, // Random rating between 3-5
        totalSales: Math.floor(Math.random() * 500),
      })
      products.push(product)
    }
  }

  console.log(`✓ Created ${size} products for store ${storeId}`)
  return products
}
