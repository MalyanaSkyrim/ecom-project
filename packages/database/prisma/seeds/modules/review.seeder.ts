import { faker } from '@faker-js/faker'

import { db } from '../../../src'

// Initialize faker with a seed for consistent results
faker.seed(42)

export interface CreateReviewData {
  storeId: string
  customerId: string
  productId?: string // Optional - can review store or product
  content: string
  rating: number // 1.0 to 5.0
}

interface GeneratedReviewData {
  content: string
  rating: number
}

/**
 * Generate a realistic review using Faker
 */
function generateReview(isProductReview: boolean = true): GeneratedReviewData {
  const rating = Number(
    faker.number.float({ min: 1.0, max: 5.0, fractionDigits: 1 }),
  )

  // Generate content based on rating
  const positivePhrases = [
    'Excellent product!',
    'Great quality and fast shipping.',
    'Highly recommend this item.',
    'Perfect for my needs.',
    'Outstanding customer service.',
    'Love this product!',
    'Exactly as described.',
    'Fast delivery and great packaging.',
    'Will definitely buy again.',
    'Amazing value for money.',
  ]

  const neutralPhrases = [
    'Good product overall.',
    'Decent quality.',
    'Meets expectations.',
    'Average product.',
    'Nothing special but works fine.',
    'Could be better.',
    'Satisfactory purchase.',
    'Decent for the price.',
  ]

  const negativePhrases = [
    'Not what I expected.',
    'Poor quality.',
    'Disappointed with this purchase.',
    'Does not work as advertised.',
    'Slow shipping.',
    'Customer service was unhelpful.',
    'Would not recommend.',
    'Waste of money.',
  ]

  let phrases: string[]
  if (rating >= 4.0) {
    phrases = positivePhrases
  } else if (rating >= 2.5) {
    phrases = neutralPhrases
  } else {
    phrases = negativePhrases
  }

  const mainPhrase = faker.helpers.arrayElement(phrases)

  // Generate additional context
  const additionalContext = [
    `The ${isProductReview ? 'product' : 'store'} ${faker.helpers.arrayElement(['arrived quickly', 'was well packaged', 'looks great', 'works perfectly', 'exceeded expectations'])}.`,
    `I've been using this ${isProductReview ? 'item' : 'store'} for ${faker.number.int({ min: 1, max: 6 })} ${faker.helpers.arrayElement(['days', 'weeks', 'months'])} now.`,
    `The ${isProductReview ? 'quality' : 'service'} is ${faker.helpers.arrayElement(['impressive', 'good', 'decent', 'okay', 'disappointing'])}.`,
    `Would ${rating >= 3.0 ? '' : 'not '}recommend to ${faker.helpers.arrayElement(['friends', 'family', 'others', 'anyone'])}.`,
  ]

  const context = faker.datatype.boolean({ probability: 0.7 })
    ? faker.helpers.arrayElement(additionalContext)
    : ''

  const content = `${mainPhrase} ${context}`.trim()

  return {
    content,
    rating,
  }
}

/**
 * Create a single review
 */
export async function createSingleReview(
  data: CreateReviewData,
): Promise<{ id: string; content: string; rating: number }> {
  const review = await db.review.create({
    data: {
      storeId: data.storeId,
      customerId: data.customerId,
      productId: data.productId,
      content: data.content,
      rating: data.rating,
    },
  })

  console.log(
    `✓ Review created: ${data.rating}⭐ - "${data.content.substring(0, 50)}..."`,
  )
  return review
}

/**
 * Create multiple reviews for a store
 */
export async function createManyReviews(
  storeId: string,
  customerIds: string[],
  productIds?: string[],
  size: number = 50,
): Promise<Array<{ id: string; content: string; rating: number }>> {
  // Generate all reviews data first
  const reviewsData = []

  for (let i = 0; i < size; i++) {
    const isProductReview =
      productIds &&
      productIds.length > 0 &&
      faker.datatype.boolean({ probability: 0.8 })
    const reviewData = generateReview(isProductReview)

    reviewsData.push({
      storeId,
      customerId: faker.helpers.arrayElement(customerIds),
      productId: isProductReview
        ? faker.helpers.arrayElement(productIds)
        : null,
      content: reviewData.content,
      rating: reviewData.rating,
    })
  }

  // Bulk insert all reviews
  const result = await db.review.createMany({
    data: reviewsData,
    skipDuplicates: true,
  })

  console.log(`✓ Created ${result.count} reviews for store ${storeId}`)

  // Retrieve the created reviews
  const createdReviews = await db.review.findMany({
    where: {
      storeId,
      content: {
        in: reviewsData.map((r) => r.content),
      },
    },
    select: {
      id: true,
      content: true,
      rating: true,
    },
    take: result.count,
  })

  return createdReviews
}

/**
 * Create reviews for specific products
 */
export async function createProductReviews(
  storeId: string,
  customerIds: string[],
  productIds: string[],
  reviewsPerProduct: number = 5,
): Promise<Array<{ id: string; content: string; rating: number }>> {
  const allReviews = []

  for (const productId of productIds) {
    const reviews = await createManyReviews(
      storeId,
      customerIds,
      [productId],
      reviewsPerProduct,
    )
    allReviews.push(...reviews)
  }

  console.log(
    `✓ Created ${allReviews.length} product reviews across ${productIds.length} products`,
  )
  return allReviews
}

/**
 * Create store reviews (without specific products)
 */
export async function createStoreReviews(
  storeId: string,
  customerIds: string[],
  size: number = 20,
): Promise<Array<{ id: string; content: string; rating: number }>> {
  const reviews = await createManyReviews(storeId, customerIds, undefined, size)
  console.log(`✓ Created ${reviews.length} store reviews`)
  return reviews
}
