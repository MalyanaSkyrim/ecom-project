import { faker } from '@faker-js/faker'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Initialize faker with a seed for consistent results
faker.seed(42)

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

interface GeneratedProductData {
  name: string
  slug: string
  description?: string
  price: number
  isActive?: boolean
  isFeatured?: boolean
  rating?: number
  totalSales?: number
}

/**
 * Generate a realistic product using Faker
 */
function generateProduct(): GeneratedProductData {
  // Define realistic product categories with specific types
  const productTypes = [
    {
      category: 'Electronics',
      types: ['Smartphone', 'Laptop', 'Tablet', 'Smartwatch', 'Headphones'],
    },
    {
      category: 'Home & Garden',
      types: ['Coffee Maker', 'Blender', 'Vacuum Cleaner', 'Air Purifier'],
    },
    {
      category: 'Fashion',
      types: ['T-Shirt', 'Jeans', 'Sneakers', 'Jacket', 'Dress'],
    },
    {
      category: 'Sports',
      types: ['Running Shoes', 'Yoga Mat', 'Dumbbells', 'Bicycle'],
    },
    {
      category: 'Beauty',
      types: ['Skincare Set', 'Shampoo', 'Perfume', 'Makeup Kit'],
    },
    {
      category: 'Books',
      types: ['Novel', 'Textbook', 'Cookbook', 'Biography'],
    },
    {
      category: 'Gaming',
      types: [
        'Gaming Mouse',
        'Mechanical Keyboard',
        'Gaming Chair',
        'Controller',
      ],
    },
    {
      category: 'Office',
      types: ['Desk Lamp', 'Monitor', 'Office Chair', 'Notebook'],
    },
  ]

  const selectedCategory = faker.helpers.arrayElement(productTypes)
  const productType = faker.helpers.arrayElement(selectedCategory.types)
  const brand = faker.company.name()

  // Create a more realistic product name
  const adjectives = [
    'Professional',
    'Premium',
    'Advanced',
    'Elite',
    'Smart',
    'Wireless',
    'Heavy Duty',
    'Compact',
  ]
  const adjective = faker.helpers.arrayElement(adjectives)
  const productName = faker.datatype.boolean()
    ? `${brand} ${adjective} ${productType}`
    : `${brand} ${productType}`

  // Generate price in cents (minimum $0.99, maximum $1999.99)
  const price = faker.number.int({ min: 99, max: 199999 })

  return {
    name: productName,
    slug: faker.helpers.slugify(productName.toLowerCase()),
    description: `${faker.commerce.productDescription()} Perfect for ${faker.helpers.arrayElement(['home use', 'professional', 'daily activities', 'gift giving', 'personal use'])}.`,
    price,
    isFeatured: faker.datatype.boolean({ probability: 0.25 }),
    rating: Number(faker.number.float({ min: 2.5, max: 5, fractionDigits: 1 })),
    totalSales: faker.number.int({ min: 0, max: 2000 }),
  }
}

/**
 * Create a single product (idempotent)
 */
export async function createSingleProduct(
  data: CreateProductData,
): Promise<{ id: string; name: string; slug: string; price: Prisma.Decimal }> {
  const product = await prisma.product.upsert({
    where: {
      storeId_slug: {
        storeId: data.storeId,
        slug: data.slug,
      },
    },
    update: {
      name: data.name,
      description: data.description,
      price: new Prisma.Decimal(data.price),
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      rating: data.rating ?? 0,
      totalSales: data.totalSales ?? 0,
    },
    create: {
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

  console.log(
    `✓ Product ready: ${product.name} ($${(Number(product.price) / 100).toFixed(2)})`,
  )
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
  // Generate all products data first
  const productsData = []
  for (let i = 0; i < size; i++) {
    const productData = generateProduct()

    // Ensure unique slugs by adding a random suffix
    const baseSlug = productData.slug
    const uniqueSuffix = faker.string.alphanumeric({
      length: 8,
      casing: 'lower',
    })
    const finalSlug = `${baseSlug}-${uniqueSuffix}`

    productsData.push({
      storeId,
      name: productData.name,
      slug: finalSlug,
      description: productData.description,
      price: new Prisma.Decimal(productData.price),
      isActive: true,
      isFeatured: productData.isFeatured ?? false,
      rating: productData.rating ?? 0,
      totalSales: productData.totalSales ?? 0,
    })
  }

  // Bulk insert all products
  const result = await prisma.product.createMany({
    data: productsData,
    skipDuplicates: true, // Skip if slug already exists
  })

  console.log(`✓ Created ${result.count} products for store ${storeId}`)

  // Optionally retrieve the created products if needed
  // Note: createMany doesn't return the created records
  const createdProducts = await prisma.product.findMany({
    where: {
      storeId,
      slug: {
        in: productsData.map((p) => p.slug),
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
    },
  })

  return createdProducts
}
