# Database Seeds

This directory contains seed scripts and modular seeders for populating the database with test data.

## Structure

```
seeds/
├── modules/              # Modular seeder functions
│   ├── user.seeder.ts    # User creation
│   ├── store.seeder.ts   # Store creation
│   ├── apiKey.seeder.ts  # API key generation
│   ├── product.seeder.ts # Product creation
│   └── index.ts          # Export all seeders
├── initialSeed.ts        # Main seed script
└── README.md             # This file
```

Each seeder module follows a consistent pattern with two main functions:

- `createSingle<Entity>()` - Creates a single entity with custom data
- `createMany<Entity>()` - Creates multiple entities with generated data

## Available Seeders

### 1. User Seeder (`user.seeder.ts`)

**Functions:**

- `createSingleUser(data)` - Create a user with specific data
- `createManyUsers(size)` - Create multiple test users

**Example:**

```typescript
import { createSingleUser, createManyUsers } from './modules/user.seeder'

// Create a single user
const user = await createSingleUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',
})

// Create 5 users
const users = await createManyUsers(5)
```

### 2. Store Seeder (`store.seeder.ts`)

**Functions:**

- `createSingleStore(data)` - Create a store with optional owner
- `createManyStores(size, userId?)` - Create multiple stores

**Example:**

```typescript
import { createSingleStore, createManyStores } from './modules/store.seeder'

// Create a single store
const store = await createSingleStore({
  name: 'My Store',
  slug: 'my-store',
  domain: 'mystore.com',
  userId: 'user-id', // Optional: assign owner
})

// Create 3 stores for a user
const stores = await createManyStores(3, 'user-id')
```

### 3. API Key Seeder (`apiKey.seeder.ts`)

**Functions:**

- `createSingleApiKey(data)` - Create an API key for a store
- `createManyApiKeys(storeId, size)` - Create multiple API keys

**Example:**

```typescript
import { createSingleApiKey, createManyApiKeys } from './modules/apiKey.seeder'

// Create a single API key
const apiKey = await createSingleApiKey({
  storeId: 'store-id',
  name: 'Production Key',
})
console.log('API Key:', apiKey.apiKey) // Save this!

// Create 2 API keys for a store
const apiKeys = await createManyApiKeys('store-id', 2)
```

⚠️ **Important:** API keys are only shown once during creation. Save them immediately!

### 4. Product Seeder (`product.seeder.ts`)

**Functions:**

- `createSingleProduct(data)` - Create a product with custom data
- `createManyProducts(storeId, size)` - Create multiple products

**Features:**

- Uses realistic sample product data (up to 10 products)
- Generates random products if more than 10 are requested
- Includes pricing, ratings, and sales data

**Example:**

```typescript
import {
  createSingleProduct,
  createManyProducts,
} from './modules/product.seeder'

// Create a single product
const product = await createSingleProduct({
  storeId: 'store-id',
  name: 'Premium Headphones',
  slug: 'premium-headphones',
  description: 'High-quality wireless headphones',
  price: 299.99,
  isFeatured: true,
  rating: 4.8,
})

// Create 20 products (uses samples + generated)
const products = await createManyProducts('store-id', 20)
```

## Initial Seed Script

The main seed script is located at `prisma/seeds/initialSeed.ts` and creates a complete starter dataset:

- 1 User (john.doe@example.com / password123)
- 1 Store (Demo Store)
- 1 API Key
- 10 Products (realistic sample data)

**Run the seed:**

```bash
# From the root of the monorepo
pnpm db:seed

# Or directly from the database package
cd packages/database
pnpm db:seed
```

## Creating Custom Seed Scripts

You can create custom seed scripts by importing the seeders:

```typescript
// custom-seed.ts
import { PrismaClient } from '@prisma/client'

import {
  createSingleUser,
  createSingleStore,
  createManyProducts,
} from './modules'

const prisma = new PrismaClient()

async function customSeed() {
  // Create your custom seed logic
  const user = await createSingleUser({
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    password: 'secure123',
  })

  const store = await createSingleStore({
    name: 'Alice Store',
    slug: 'alice-store',
    userId: user.id,
  })

  await createManyProducts(store.id, 50)

  await prisma.$disconnect()
}

customSeed()
```

## Best Practices

1. **Always disconnect Prisma** after seeding:

   ```typescript
   await prisma.$disconnect()
   ```

2. **Handle errors gracefully**:

   ```typescript
   try {
     await seedFunction()
   } catch (error) {
     console.error('Seed failed:', error)
   } finally {
     await prisma.$disconnect()
   }
   ```

3. **Save API keys immediately** - they're only shown once during creation

4. **Use realistic data** for better testing and demos

5. **Clean up** - Consider creating a cleanup script to reset the database:
   ```bash
   pnpm db:push --force-reset
   pnpm db:seed
   ```

## Notes

- All IDs use UUID format (migrated from CUID)
- Passwords are hashed with SHA-256 (use bcryptjs in production)
- Sample products include realistic pricing and ratings
- All timestamps are automatically set by Prisma
