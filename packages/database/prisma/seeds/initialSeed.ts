import { db } from '../../src'
import { createConsistentApiKey } from './modules/apiKey.seeder'
import { CATEGORY_TREE, seedCategoryTree } from './modules/category.seeder'
import {
  createCustomerWithAuth,
  createManyCustomers,
} from './modules/customer.seeder'
import { PRODUCT_CATALOG, seedProductCatalog } from './modules/product.seeder'
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
    const {
      parents: parentCategories,
      all: allCategories,
      lookup: categoryLookup,
    } = await seedCategoryTree(store.id, CATEGORY_TREE)
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
    const products = await seedProductCatalog(
      store.id,
      PRODUCT_CATALOG,
      categoryLookup,
    )
    console.log(`✅ ${products.length} products created`)

    // 7. Create reviews
    console.log('⭐ Creating reviews...')
    const customerIds = allCustomers.map((c) => c.id)
    const productReviews = await createProductReviews(
      store.id,
      customerIds,
      products.slice(0, Math.min(15, products.length)).map((p) => p.id),
      3,
    ) // 3 reviews per product for the first few products
    const storeReviews = await createStoreReviews(store.id, customerIds, 20) // 20 store reviews
    const totalReviews = productReviews.length + storeReviews.length
    console.log(`✅ ${totalReviews} reviews created`)

    // Summary
    console.log('\n🎉 Seed completed successfully!')
    console.log(`📊 Store ID: ${store.id}`)
    console.log(`🔑 API Key: ${apiKey.apiKey}\n`)
    console.log(
      `🛍️ Highlighted categories: ${parentCategories
        .map((category) => category.name)
        .join(', ')}`,
    )
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
