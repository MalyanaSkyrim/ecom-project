import { db } from '../../../src'

export interface CategorySeed {
  name: string
  slug: string
  description?: string
  imageUrl?: string
  tags?: string[]
  isActive?: boolean
  children?: CategorySeed[]
}

export interface SeededCategory {
  id: string
  name: string
  slug: string
  parentId?: string
}

export const CATEGORY_TREE: CategorySeed[] = [
  {
    name: 'Women',
    slug: 'women',
    description: 'Contemporary womenswear essentials and statement looks.',
    tags: ['women', 'apparel'],
    children: [
      {
        name: 'Dresses',
        slug: 'women-dresses',
        description: 'Occasion, cocktail, and everyday dresses.',
        tags: ['women', 'dresses'],
      },
      {
        name: 'Outerwear',
        slug: 'women-outerwear',
        description: 'Layering pieces for every season.',
        tags: ['women', 'jackets'],
      },
      {
        name: 'Footwear',
        slug: 'women-footwear',
        description: 'Heels, flats, and sneakers designed for comfort.',
        tags: ['women', 'shoes'],
      },
    ],
  },
  {
    name: 'Men',
    slug: 'men',
    description: 'Tailored menswear and elevated wardrobe staples.',
    tags: ['men', 'apparel'],
    children: [
      {
        name: 'Tops',
        slug: 'men-tops',
        description: 'Shirts, tees, and knitwear for every occasion.',
        tags: ['men', 'tops'],
      },
      {
        name: 'Bottoms',
        slug: 'men-bottoms',
        description: 'Denim, chinos, and tailored trousers.',
        tags: ['men', 'bottoms'],
      },
      {
        name: 'Sneakers',
        slug: 'men-sneakers',
        description: 'Performance and lifestyle sneakers.',
        tags: ['men', 'sneakers'],
      },
    ],
  },
  {
    name: 'Kids',
    slug: 'kids',
    description: 'Playful styles for growing imaginations.',
    tags: ['kids', 'apparel'],
    children: [
      {
        name: 'Girls',
        slug: 'kids-girls',
        description: 'Bright dresses and everyday essentials.',
        tags: ['kids', 'girls'],
      },
      {
        name: 'Boys',
        slug: 'kids-boys',
        description: 'Durable styles built for adventures.',
        tags: ['kids', 'boys'],
      },
      {
        name: 'Baby',
        slug: 'kids-baby',
        description: 'Soft sets designed for comfort.',
        tags: ['kids', 'baby'],
      },
    ],
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Thoughtful accents that elevate every room.',
    tags: ['home', 'decor'],
    children: [
      {
        name: 'Decor',
        slug: 'home-decor',
        description: 'Artful decor to style your space.',
        tags: ['home', 'decor'],
      },
      {
        name: 'Kitchen & Dining',
        slug: 'home-kitchen',
        description: 'Serveware and tools for memorable meals.',
        tags: ['home', 'kitchen'],
      },
      {
        name: 'Bath & Spa',
        slug: 'home-bath',
        description: 'Luxe textiles and spa-inspired accessories.',
        tags: ['home', 'bath'],
      },
    ],
  },
  {
    name: 'Beauty & Wellness',
    slug: 'beauty',
    description: 'Self-care rituals and clean beauty favourites.',
    tags: ['beauty', 'wellness'],
    children: [
      {
        name: 'Skincare',
        slug: 'beauty-skincare',
        description: 'Targeted treatments and daily essentials.',
        tags: ['beauty', 'skincare'],
      },
      {
        name: 'Fragrance',
        slug: 'beauty-fragrance',
        description: 'Signature scents for day and night.',
        tags: ['beauty', 'fragrance'],
      },
      {
        name: 'Wellness',
        slug: 'beauty-wellness',
        description: 'Supplements and aromatherapy basics.',
        tags: ['beauty', 'wellness'],
      },
    ],
  },
]

const toSeededCategory = (record: {
  id: string
  name: string
  slug: string
  parentId: string | null
}): SeededCategory => ({
  id: record.id,
  name: record.name,
  slug: record.slug,
  parentId: record.parentId ?? undefined,
})

export async function seedCategoryTree(
  storeId: string,
  tree: CategorySeed[] = CATEGORY_TREE,
): Promise<{
  parents: SeededCategory[]
  all: SeededCategory[]
  lookup: Map<string, SeededCategory>
}> {
  const lookup = new Map<string, SeededCategory>()
  const parents: SeededCategory[] = []

  const upsertCategory = async (
    seed: CategorySeed,
    parentId: string | null = null,
  ): Promise<SeededCategory> => {
    const category = await db.category.upsert({
      where: {
        storeId_slug: {
          storeId,
          slug: seed.slug,
        },
      },
      update: {
        name: seed.name,
        description: seed.description,
        imageUrl: seed.imageUrl,
        parentId,
        tags: seed.tags ?? [],
        isActive: seed.isActive ?? true,
      },
      create: {
        storeId,
        name: seed.name,
        slug: seed.slug,
        description: seed.description,
        imageUrl: seed.imageUrl,
        parentId,
        tags: seed.tags ?? [],
        isActive: seed.isActive ?? true,
      },
    })

    const result = toSeededCategory(category)
    lookup.set(seed.slug, result)
    return result
  }

  for (const parentSeed of tree) {
    const parent = await upsertCategory(parentSeed, null)
    parents.push(parent)

    if (parentSeed.children?.length) {
      for (const childSeed of parentSeed.children) {
        await upsertCategory(childSeed, parent.id)
      }
    }
  }

  const all = Array.from(lookup.values())
  console.log(
    `✓ Seeded category tree for store ${storeId}: ${parents.length} parents, ${all.length - parents.length} subcategories`,
  )

  return {
    parents,
    all,
    lookup,
  }
}
