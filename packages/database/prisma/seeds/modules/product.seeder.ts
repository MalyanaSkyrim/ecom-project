import { Prisma } from '@prisma/client'

import { db } from '../../../src'
import type { SeededCategory } from './category.seeder'

export interface ProductSeed {
  name: string
  slug?: string
  description: string
  priceCents: number
  isActive?: boolean
  isFeatured?: boolean
  rating?: number
  totalSales?: number
  colors?: string[]
  sizes?: string[]
  categorySlug?: string
}

export interface SeededProduct {
  id: string
  name: string
  slug: string
  categoryId?: string
}

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const appendVariants = (
  description: string,
  colors?: string[],
  sizes?: string[],
) => {
  const variants: string[] = []
  if (colors?.length) {
    variants.push(`Colors: ${colors.join(', ')}`)
  }
  if (sizes?.length) {
    variants.push(`Sizes: ${sizes.join(', ')}`)
  }

  if (!variants.length) return description.trim()
  return `${description.trim()} ${variants.join(' | ')}.`
}

export const PRODUCT_CATALOG: ProductSeed[] = [
  {
    name: 'Aurora Silk Midi Dress',
    description:
      'A flowing midi dress cut from washable silk with a subtle high-low hem and removable waist tie.',
    priceCents: 18900,
    isFeatured: true,
    rating: 4.7,
    totalSales: 320,
    colors: ['Blush Pink', 'Emerald', 'Ivory'],
    sizes: ['XS', 'S', 'M', 'L'],
    categorySlug: 'women-dresses',
  },
  {
    name: 'Solstice Linen Blazer',
    description:
      'Relaxed linen tailoring with a soft shoulder, horn buttons, and breathable half lining.',
    priceCents: 22500,
    rating: 4.5,
    totalSales: 210,
    colors: ['Natural', 'Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    categorySlug: 'women-outerwear',
  },
  {
    name: 'Horizon Leather Slingback',
    description:
      'Pointed-toe slingbacks crafted in Naples from Italian nappa leather with memory foam cushioning.',
    priceCents: 16500,
    rating: 4.6,
    totalSales: 275,
    colors: ['Black', 'Warm Taupe'],
    sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10'],
    categorySlug: 'women-footwear',
  },
  {
    name: 'Atlas Oxford Shirt',
    description:
      'Classic button-down woven on heritage looms with a softly structured collar and reinforced seams.',
    priceCents: 9800,
    rating: 4.8,
    totalSales: 410,
    colors: ['Sky Blue', 'White', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    categorySlug: 'men-tops',
  },
  {
    name: 'Harbor Selvedge Denim',
    description:
      '12.5oz Japanese selvedge denim with a tailored taper, antique copper hardware, and chain-stitched hems.',
    priceCents: 13500,
    rating: 4.6,
    totalSales: 365,
    colors: ['Indigo'],
    sizes: ['29', '30', '31', '32', '33', '34', '36'],
    categorySlug: 'men-bottoms',
  },
  {
    name: 'Velocity Knit Runner',
    description:
      'Responsive knit sneaker with algae-based cushioning and recycled rubber outsoles.',
    priceCents: 14800,
    isFeatured: true,
    rating: 4.9,
    totalSales: 520,
    colors: ['Graphite', 'Arctic White', 'Olive'],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    categorySlug: 'men-sneakers',
  },
  {
    name: 'Starlit Tiered Dress',
    description:
      'Soft cotton voile dress with flutter sleeves, hidden pockets, and hand-embroidered stars.',
    priceCents: 6200,
    rating: 4.7,
    totalSales: 195,
    colors: ['Rose', 'Midnight'],
    sizes: ['2T', '3T', '4T', '5T', '6'],
    categorySlug: 'kids-girls',
  },
  {
    name: 'Trailblazer Cargo Jacket',
    description:
      'Water-resistant cotton jacket with insulated lining, reflective trims, and expandable pockets.',
    priceCents: 7800,
    rating: 4.5,
    totalSales: 160,
    colors: ['Forest', 'Slate'],
    sizes: ['XS', 'S', 'M', 'L'],
    categorySlug: 'kids-boys',
  },
  {
    name: 'Cloudsoft Knit Set',
    description:
      'Organic cotton knit two-piece with envelope neckline and fold-over cuffs for newborn comfort.',
    priceCents: 5400,
    rating: 4.9,
    totalSales: 240,
    colors: ['Oat', 'Dusty Blue'],
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
    categorySlug: 'kids-baby',
  },
  {
    name: 'Cascade Marble Candle',
    description:
      'Hand-poured soy candle housed in reclaimed Carrara marble with reusable vessel.',
    priceCents: 3800,
    rating: 4.4,
    totalSales: 310,
    colors: ['White Marble'],
    sizes: ['12 oz'],
    categorySlug: 'home-decor',
  },
  {
    name: 'Stoneware Dinner Collection',
    description:
      'Twelve-piece reactive glaze stoneware set fired at high temperatures for exceptional durability.',
    priceCents: 16800,
    rating: 4.8,
    totalSales: 150,
    colors: ['Charcoal', 'Sea Mist'],
    sizes: ['Service for 4'],
    categorySlug: 'home-kitchen',
  },
  {
    name: 'Spa-Loom Towel Set',
    description:
      'Long-staple Turkish cotton towels with zero-twist loops and double-needle hems.',
    priceCents: 11200,
    rating: 4.7,
    totalSales: 280,
    colors: ['Cloud', 'Sand'],
    sizes: ['Bath', 'Hand', 'Wash'],
    categorySlug: 'home-bath',
  },
  {
    name: 'Enzyme Renewal Serum',
    description:
      'Daily resurfacing serum blending fruit enzymes, niacinamide, and hyaluronic acid.',
    priceCents: 7200,
    isFeatured: true,
    rating: 4.9,
    totalSales: 460,
    colors: ['Translucent'],
    sizes: ['30 ml'],
    categorySlug: 'beauty-skincare',
  },
  {
    name: 'Cedar Atlas Eau de Parfum',
    description:
      'Unisex fragrance layering cedar atlas, bergamot, and smoked vanilla with 18-hour wear.',
    priceCents: 9800,
    rating: 4.6,
    totalSales: 190,
    colors: ['Amber'],
    sizes: ['50 ml', '100 ml'],
    categorySlug: 'beauty-fragrance',
  },
  {
    name: 'Calm Focus Adaptogen Powder',
    description:
      'A daily adaptogenic blend of lion’s mane, ashwagandha, and cacao to support clarity.',
    priceCents: 5800,
    rating: 4.5,
    totalSales: 170,
    colors: ['Cacao'],
    sizes: ['150 g'],
    categorySlug: 'beauty-wellness',
  },
  {
    name: 'Midnight Merino Cardigan',
    description:
      'Fine-gauge merino cardigan with corozo buttons and tubular stitching for a clean finish.',
    priceCents: 12800,
    rating: 4.7,
    totalSales: 230,
    colors: ['Midnight', 'Heather Grey'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    categorySlug: 'women-outerwear',
  },
  {
    name: 'Lumen Pleated Trouser',
    description:
      'High-rise trouser featuring double pleats, pressed seams, and a cropped ankle length.',
    priceCents: 14200,
    rating: 4.6,
    totalSales: 185,
    colors: ['Stone', 'Black'],
    sizes: ['0', '2', '4', '6', '8', '10', '12'],
    categorySlug: 'women-dresses',
  },
  {
    name: 'Summit Quilted Vest',
    description:
      'Recycled nylon vest with PrimaLoft insulation, weather-ready coating, and interior media pocket.',
    priceCents: 11500,
    rating: 4.5,
    totalSales: 205,
    colors: ['Pine', 'Navy', 'Charcoal'],
    sizes: ['S', 'M', 'L', 'XL'],
    categorySlug: 'men-outerwear',
  },
  {
    name: 'Heritage Cashmere Crew',
    description:
      'Grade-A Mongolian cashmere knit with fully fashioned construction and rib trims.',
    priceCents: 19800,
    rating: 4.9,
    totalSales: 260,
    colors: ['Camel', 'Charcoal', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    categorySlug: 'men-tops',
  },
  {
    name: 'Coastal Canvas Sneaker',
    description:
      'Low-profile sneaker with natural rubber foxing, cork footbed, and organic cotton canvas.',
    priceCents: 8900,
    rating: 4.4,
    totalSales: 310,
    colors: ['Seafoam', 'Natural'],
    sizes: ['US 5', 'US 6', 'US 7', 'US 8', 'US 9', 'US 10'],
    categorySlug: 'women-footwear',
  },
  {
    name: 'Echo Studio Monitor',
    description:
      'Wireless speaker engineered with walnut veneer housing, dual tweeters, and room calibration.',
    priceCents: 26500,
    rating: 4.3,
    totalSales: 145,
    colors: ['Walnut'],
    sizes: ['One Size'],
    categorySlug: 'home-decor',
  },
  {
    name: 'Artisan Coffee Brewer',
    description:
      'Precision pour-over brewer with copper coil temperature control and handblown glass carafe.',
    priceCents: 15800,
    rating: 4.7,
    totalSales: 225,
    colors: ['Matte Black', 'Brushed Steel'],
    sizes: ['1.2 L'],
    categorySlug: 'home-kitchen',
  },
  {
    name: 'Botanical Bath Elixir',
    description:
      'Concentrated bath oil with eucalyptus, neroli, and vitamin E to restore and hydrate.',
    priceCents: 4800,
    rating: 4.6,
    totalSales: 140,
    colors: ['Golden'],
    sizes: ['200 ml'],
    categorySlug: 'home-bath',
  },
  {
    name: 'Radiant Glow Moisturizer',
    description:
      'Lightweight daily moisturizer with vitamin C, squalane, and mineral SPF 30 protection.',
    priceCents: 6800,
    rating: 4.8,
    totalSales: 330,
    colors: ['Pearl'],
    sizes: ['50 ml'],
    categorySlug: 'beauty-skincare',
  },
]

export async function seedProductCatalog(
  storeId: string,
  seeds: ProductSeed[] = PRODUCT_CATALOG,
  categoryLookup?: Map<string, SeededCategory>,
): Promise<SeededProduct[]> {
  const seeded: SeededProduct[] = []

  for (const seed of seeds) {
    const slug = seed.slug ? normalizeSlug(seed.slug) : normalizeSlug(seed.name)
    const categoryId = seed.categorySlug
      ? (categoryLookup?.get(seed.categorySlug)?.id ?? null)
      : null

    const description = appendVariants(
      seed.description,
      seed.colors,
      seed.sizes,
    )

    const product = await db.product.upsert({
      where: {
        storeId_slug: {
          storeId,
          slug,
        },
      },
      update: {
        name: seed.name,
        description,
        price: new Prisma.Decimal(seed.priceCents),
        isActive: seed.isActive ?? true,
        isFeatured: seed.isFeatured ?? false,
        rating: seed.rating ?? 0,
        totalSales: seed.totalSales ?? 0,
        categoryId,
      },
      create: {
        storeId,
        name: seed.name,
        slug,
        description,
        price: new Prisma.Decimal(seed.priceCents),
        isActive: seed.isActive ?? true,
        isFeatured: seed.isFeatured ?? false,
        rating: seed.rating ?? 0,
        totalSales: seed.totalSales ?? 0,
        categoryId,
      },
    })

    seeded.push({
      id: product.id,
      name: product.name,
      slug: product.slug,
      categoryId: product.categoryId ?? undefined,
    })
  }

  console.log(`✓ Seeded ${seeded.length} products for store ${storeId}`)
  return seeded
}
