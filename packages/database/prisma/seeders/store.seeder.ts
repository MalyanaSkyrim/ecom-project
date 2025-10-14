import { PrismaClient, StoreRole } from '@prisma/client'

const prisma = new PrismaClient()

export interface CreateStoreData {
  name: string
  slug: string
  domain?: string
  userId?: string // Owner of the store
  userRole?: StoreRole
}

/**
 * Create a single store
 */
export async function createSingleStore(
  data: CreateStoreData,
): Promise<{ id: string; name: string; slug: string }> {
  const store = await prisma.store.create({
    data: {
      name: data.name,
      slug: data.slug,
      domain: data.domain,
      isActive: true,
      // Optionally create store-user relationship
      ...(data.userId && {
        storeUsers: {
          create: {
            userId: data.userId,
            role: data.userRole || StoreRole.OWNER,
          },
        },
      }),
    },
  })

  console.log(`✓ Created store: ${store.name} (${store.slug})`)
  return store
}

/**
 * Create multiple stores
 */
export async function createManyStores(
  size: number,
  userId?: string,
): Promise<Array<{ id: string; name: string; slug: string }>> {
  const stores = []

  for (let i = 1; i <= size; i++) {
    const store = await createSingleStore({
      name: `Test Store ${i}`,
      slug: `test-store-${i}`,
      domain: `store${i}.example.com`,
      userId,
      userRole: StoreRole.OWNER,
    })
    stores.push(store)
  }

  console.log(`✓ Created ${size} stores`)
  return stores
}
