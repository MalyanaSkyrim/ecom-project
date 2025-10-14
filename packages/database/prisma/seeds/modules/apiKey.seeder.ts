import { PrismaClient } from '@prisma/client'
import { createHash, randomBytes } from 'crypto'

const prisma = new PrismaClient()

export interface CreateApiKeyData {
  storeId: string
  name: string
}

/**
 * Generate an API key
 */
function generateApiKey(): string {
  const secret = randomBytes(32).toString('hex')
  return `sk_live_${secret}`
}

/**
 * Hash the API key
 */
function hashApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex')
}

/**
 * Extract the prefix from the API key (first 16 characters)
 */
function extractKeyPrefix(apiKey: string): string {
  return apiKey.substring(0, 16)
}

/**
 * Create a single API key (idempotent)
 * Note: This will regenerate the API key each time for seed consistency
 */
export async function createSingleApiKey(
  data: CreateApiKeyData,
): Promise<{ id: string; name: string; apiKey: string; keyPrefix: string }> {
  const apiKey = generateApiKey()
  const hashedKey = hashApiKey(apiKey)
  const keyPrefix = extractKeyPrefix(apiKey)

  // First, delete any existing API key with this name for this store
  await prisma.apiKey.deleteMany({
    where: {
      storeId: data.storeId,
      name: data.name,
    },
  })

  // Then create the new one
  const createdKey = await prisma.apiKey.create({
    data: {
      storeId: data.storeId,
      name: data.name,
      keyPrefix,
      hashedKey,
      isActive: true,
    },
  })

  console.log(`✓ API key ready: ${createdKey.name} (${keyPrefix}...)`)
  console.log(`  🔑 API Key: ${apiKey}`)

  return {
    id: createdKey.id,
    name: createdKey.name,
    apiKey, // Always return the plain text key for seed scripts
    keyPrefix: createdKey.keyPrefix,
  }
}

/**
 * Create multiple API keys for a store
 */
export async function createManyApiKeys(
  storeId: string,
  size: number,
): Promise<
  Array<{ id: string; name: string; apiKey: string; keyPrefix: string }>
> {
  const apiKeys = []

  for (let i = 1; i <= size; i++) {
    const apiKey = await createSingleApiKey({
      storeId,
      name: `API Key ${i}`,
    })
    apiKeys.push(apiKey)
  }

  console.log(`✓ Created ${size} API keys for store ${storeId}`)
  return apiKeys
}
