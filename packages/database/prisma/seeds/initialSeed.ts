import { PrismaClient } from '@prisma/client'

import { createSingleApiKey } from './modules/apiKey.seeder'
import { createManyProducts } from './modules/product.seeder'
import { createSingleStore } from './modules/store.seeder'
import { createSingleUser } from './modules/user.seeder'

const prisma = new PrismaClient()

/**
 * Initial seed script
 * Creates:
 * - 1 User (owner)
 * - 1 Store (with the user as owner)
 * - 1 API Key for the store
 * - 10 Products for the store
 */
async function main() {
  await prisma.product.deleteMany()
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
    console.log(`   User ID: ${user.id}\n`)

    // 2. Create a store with the user as owner
    console.log('🏪 Creating store...')
    const store = await createSingleStore({
      name: 'Demo Store',
      slug: 'demo-store',
      domain: 'demo.example.com',
      userId: user.id,
    })
    console.log(`   Store ID: ${store.id}\n`)

    // 3. Create an API key for the store
    console.log('🔑 Creating API key...')
    const apiKey = await createSingleApiKey({
      storeId: store.id,
      name: 'Production API Key',
    })
    console.log(`   API Key ID: ${apiKey.id}`)
    console.log(`   Key Prefix: ${apiKey.keyPrefix}`)
    console.log(`   Full API Key: ${apiKey.apiKey}\n`)

    // 4. Create products for the store
    console.log('📦 Creating products...')
    const products = await createManyProducts(store.id, 1000)
    console.log(`   Created ${products.length} products\n`)

    // Summary
    console.log('✅ Initial seed completed successfully!\n')
    console.log('📊 Summary:')
    console.log(`   • User: ${user.email}`)
    console.log(`   • Store: ${store.name} (${store.slug})`)
    console.log(`   • API Key: ${apiKey.keyPrefix}...`)
    console.log(`   • Products: ${products.length} items`)
    console.log('\n🔐 Credentials:')
    console.log(`   Email: ${user.email}`)
    console.log(`   Password: password123`)
    console.log(`   API Key: ${apiKey.apiKey}`)
    console.log('\n')
  } catch (error) {
    console.error('❌ Error during seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
