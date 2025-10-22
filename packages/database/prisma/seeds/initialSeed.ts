import { db } from '../../src'
import { createConsistentApiKey } from './modules/apiKey.seeder'
import { createCategoryHierarchy } from './modules/category.seeder'
import {
  createCustomerWithAuth,
  createManyCustomers,
} from './modules/customer.seeder'
import { createManyProducts } from './modules/product.seeder'
import {
  createProductReviews,
  createStoreReviews,
} from './modules/review.seeder'
import { createSingleStore } from './modules/store.seeder'
import { createSingleUser } from './modules/user.seeder'

/**
 * Initial seed script
 * Creates:
 * - 1 User (owner)
 * - 1 Store (with the user as owner)
 * - 1 API Key for the store
 * - 15 Categories (with hierarchy)
 * - 20 Customers (including the owner as a customer)
 * - 100 Products for the store (some with categories)
 * - 150 Reviews (product and store reviews)
 */
async function main() {
  // Clean up existing data
  await db.review.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.customer.deleteMany()
  console.log('🌱 Starting initial seed...\n')

  try {
    // 1. Create a user
    console.log('📝 Creating user...')
    const user = await createSingleUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    })
    console.log('✅ User created')

    // 2. Create a store with the user as owner
    console.log('🏪 Creating store...')
    const store = await createSingleStore({
      name: 'Demo Store',
      slug: 'demo-store',
      domain: 'demo.example.com',
      userId: user.id,
    })
    console.log('✅ Store created')

    // 3. Create an API key for the store
    console.log('🔑 Creating API key...')
    const apiKey = await createConsistentApiKey({
      storeId: store.id,
      name: 'Production API Key',
    })
    console.log('✅ API key created')

    // 4. Create categories for the store
    console.log('📂 Creating categories...')
    const { parents, subcategories } = await createCategoryHierarchy(
      store.id,
      5,
      3,
    )
    const allCategories = [...parents, ...subcategories]
    console.log(`✅ ${allCategories.length} categories created`)

    // 5. Create customers for the store
    console.log('👥 Creating customers...')
    const customers = await createManyCustomers(store.id, 19) // 19 additional customers
    const ownerCustomer = await createCustomerWithAuth(
      store.id,
      user.email,
      user.firstName,
      user.lastName || undefined,
      'password123',
    )
    const allCustomers = [...customers, ownerCustomer]
    console.log(`✅ ${allCustomers.length} customers created`)

    // 6. Create products for the store
    console.log('📦 Creating products...')
    const products = await createManyProducts(store.id, 100)
    console.log(`✅ ${products.length} products created`)

    // 7. Assign some products to categories
    console.log('🔗 Assigning products to categories...')
    const categoryIds = allCategories.map((c) => c.id)
    const productIds = products.map((p) => p.id)

    // Assign 60% of products to random categories
    const productsToCategorize = Math.floor(productIds.length * 0.6)
    for (let i = 0; i < productsToCategorize; i++) {
      const productId = productIds[i]
      const categoryId =
        categoryIds[Math.floor(Math.random() * categoryIds.length)]

      await db.product.update({
        where: { id: productId },
        data: { categoryId },
      })
    }
    console.log(`✅ ${productsToCategorize} products categorized`)

    // 8. Create reviews
    console.log('⭐ Creating reviews...')
    const customerIds = allCustomers.map((c) => c.id)
    const productReviews = await createProductReviews(
      store.id,
      customerIds,
      productIds.slice(0, 50),
      3,
    ) // 3 reviews per product for first 50 products
    const storeReviews = await createStoreReviews(store.id, customerIds, 20) // 20 store reviews
    const totalReviews = productReviews.length + storeReviews.length
    console.log(`✅ ${totalReviews} reviews created`)

    // Summary
    console.log('\n🎉 Seed completed successfully!')
    console.log(`📊 Store ID: ${store.id}`)
    console.log(`🔑 API Key: ${apiKey.apiKey}\n`)
  } catch (error) {
    console.error('❌ Error during seed:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
