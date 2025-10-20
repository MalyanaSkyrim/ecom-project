import { faker } from '@faker-js/faker'

import { db } from '../../../src'

// Initialize faker with a seed for consistent results
faker.seed(42)

export interface CreateCategoryData {
  storeId: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  parentId?: string
  tags?: string[]
  isActive?: boolean
}

interface GeneratedCategoryData {
  name: string
  slug: string
  description?: string
  imageUrl?: string
  tags: string[]
  isActive: boolean
}

/**
 * Generate a realistic category using Faker
 */
function generateCategory(): GeneratedCategoryData {
  // Define realistic category hierarchies
  const categoryTemplates = [
    {
      name: 'Electronics',
      subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Audio', 'Gaming'],
      tags: ['tech', 'digital', 'gadgets'],
    },
    {
      name: 'Fashion',
      subcategories: [
        "Men's Clothing",
        "Women's Clothing",
        'Shoes',
        'Accessories',
        'Jewelry',
      ],
      tags: ['style', 'clothing', 'accessories'],
    },
    {
      name: 'Home & Garden',
      subcategories: ['Furniture', 'Kitchen', 'Bathroom', 'Garden', 'Decor'],
      tags: ['home', 'furniture', 'decor'],
    },
    {
      name: 'Sports & Fitness',
      subcategories: [
        'Exercise Equipment',
        'Outdoor Gear',
        'Team Sports',
        'Fitness Apparel',
      ],
      tags: ['fitness', 'sports', 'health'],
    },
    {
      name: 'Beauty & Health',
      subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Health Supplements'],
      tags: ['beauty', 'health', 'wellness'],
    },
    {
      name: 'Books & Media',
      subcategories: [
        'Fiction',
        'Non-Fiction',
        'Educational',
        'Movies',
        'Music',
      ],
      tags: ['books', 'media', 'education'],
    },
    {
      name: 'Automotive',
      subcategories: ['Car Parts', 'Tools', 'Accessories', 'Maintenance'],
      tags: ['auto', 'vehicles', 'parts'],
    },
    {
      name: 'Toys & Games',
      subcategories: [
        'Action Figures',
        'Board Games',
        'Educational Toys',
        'Video Games',
      ],
      tags: ['toys', 'games', 'entertainment'],
    },
  ]

  const template = faker.helpers.arrayElement(categoryTemplates)
  const categoryName = faker.datatype.boolean()
    ? template.name
    : faker.helpers.arrayElement(template.subcategories)

  // Generate realistic description
  const descriptions = [
    `Discover the best ${categoryName.toLowerCase()} products for your needs`,
    `High-quality ${categoryName.toLowerCase()} from top brands`,
    `Shop premium ${categoryName.toLowerCase()} with fast delivery`,
    `Find the perfect ${categoryName.toLowerCase()} for every occasion`,
  ]

  return {
    name: categoryName,
    slug: faker.helpers.slugify(categoryName.toLowerCase()),
    description: faker.helpers.arrayElement(descriptions),
    imageUrl: faker.datatype.boolean({ probability: 0.3 })
      ? faker.image.url({ width: 400, height: 300 })
      : undefined,
    tags: faker.helpers.arrayElements(template.tags, { min: 1, max: 3 }),
    isActive: faker.datatype.boolean({ probability: 0.9 }), // 90% active
  }
}

/**
 * Create a single category (idempotent)
 */
export async function createSingleCategory(
  data: CreateCategoryData,
): Promise<{ id: string; name: string; slug: string }> {
  const category = await db.category.upsert({
    where: {
      storeId_slug: {
        storeId: data.storeId,
        slug: data.slug,
      },
    },
    update: {
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      parentId: data.parentId,
      tags: data.tags || [],
      isActive: data.isActive ?? true,
    },
    create: {
      storeId: data.storeId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      imageUrl: data.imageUrl,
      parentId: data.parentId,
      tags: data.tags || [],
      isActive: data.isActive ?? true,
    },
  })

  console.log(`✓ Category ready: ${category.name} (${category.slug})`)
  return category
}

/**
 * Create multiple categories for a store with optional hierarchy
 */
export async function createManyCategories(
  storeId: string,
  size: number,
  parentId?: string,
): Promise<Array<{ id: string; name: string; slug: string }>> {
  // Generate all categories data first
  const categoriesData = []
  for (let i = 0; i < size; i++) {
    const categoryData = generateCategory()

    // Ensure unique slugs by adding a random suffix
    const baseSlug = categoryData.slug
    const uniqueSuffix = faker.string.alphanumeric({
      length: 6,
      casing: 'lower',
    })
    const finalSlug = `${baseSlug}-${uniqueSuffix}`

    categoriesData.push({
      storeId,
      name: categoryData.name,
      slug: finalSlug,
      description: categoryData.description,
      imageUrl: categoryData.imageUrl,
      parentId: parentId || null,
      tags: categoryData.tags,
      isActive: categoryData.isActive,
    })
  }

  // Bulk insert all categories
  const result = await db.category.createMany({
    data: categoriesData,
    skipDuplicates: true, // Skip if slug already exists
  })

  console.log(`✓ Created ${result.count} categories for store ${storeId}`)

  // Retrieve the created categories
  const createdCategories = await db.category.findMany({
    where: {
      storeId,
      slug: {
        in: categoriesData.map((c) => c.slug),
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  })

  return createdCategories
}

/**
 * Create a category hierarchy (parent categories with subcategories)
 */
export async function createCategoryHierarchy(
  storeId: string,
  parentCount: number = 5,
  subcategoriesPerParent: number = 3,
): Promise<{
  parents: Array<{ id: string; name: string; slug: string }>
  subcategories: Array<{ id: string; name: string; slug: string }>
}> {
  // First create parent categories
  const parents = await createManyCategories(storeId, parentCount)

  // Then create subcategories for each parent
  const allSubcategories = []
  for (const parent of parents) {
    const subcategories = await createManyCategories(
      storeId,
      subcategoriesPerParent,
      parent.id,
    )
    allSubcategories.push(...subcategories)
  }

  console.log(
    `✓ Created category hierarchy: ${parents.length} parents, ${allSubcategories.length} subcategories`,
  )

  return {
    parents,
    subcategories: allSubcategories,
  }
}
