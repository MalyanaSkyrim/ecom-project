# Adding New Features: React Component to API Flow

This guide explains how to implement a complete feature flow from React component to API using the established patterns in this codebase.

## Architecture Overview

The flow follows this pattern:

```
React Component → tRPC Client → tRPC Server Router → Handler → HTTP Client → External API
```

## Step-by-Step Implementation

### 1. Server-Side Implementation

#### Create Handler File

Create a new handler file at `apps/web/server/router/{feature-name}/{feature-name}.handler.ts`:

```typescript
import { env } from '@/env'

import { ApiClient } from '@ecom/http-client'

// Create API client instance
const apiClient = new ApiClient(env.API_URL)

export const yourFeatureHandler = async ({
  input,
}: {
  input: YourInputType
}) => {
  try {
    // Transform input if needed
    const apiData = {
      // map your input to API format
    }

    // Call the API
    const result = await apiClient.yourApiMethod(apiData)

    return result
  } catch (error: unknown) {
    // Handle errors following the established pattern
    if (error && typeof error === 'object' && 'response' in error) {
      const responseError = error as {
        response?: { body?: { message?: string } }
      }
      if (responseError?.response?.body?.message) {
        throw new Error(responseError.response.body.message)
      }
    }
    throw error
  }
}
```

#### Create Schema File

Create `apps/web/server/router/{feature-name}/{feature-name}.schema.ts`:

```typescript
import { z } from 'zod'

// Define input validation schema
export const yourFeatureInputSchema = z.object({
  // Define your input fields
  field1: z.string(),
  field2: z.number().optional(),
})

export type YourFeatureInput = z.infer<typeof yourFeatureInputSchema>
```

#### Create Router File

Create `apps/web/server/router/{feature-name}/{feature-name}.router.ts`:

```typescript
import { procedure, router } from '@/server/trpc'
import { yourFeatureInputSchema } from './{feature-name}.schema'
import { yourFeatureHandler } from './{feature-name}.handler'

const {featureName}Router = router({
  // For queries (data fetching)
  yourQuery: procedure
    .input(yourFeatureInputSchema.optional()) // optional if no input needed
    .query(yourFeatureHandler),

  // For mutations (data modification)
  yourMutation: procedure
    .input(yourFeatureInputSchema)
    .mutation(yourFeatureHandler),
})

export default yourFeatureRouter
```

#### Update Main Router

Update `apps/web/server/router/index.ts`:

```typescript
import { router } from '../trpc'
import authRouter from './auth/auth.router'
import yourFeatureRouter from './{feature-name}/{feature-name}.router'

export const appRouter = router({
  auth: authRouter,
  yourFeature: yourFeatureRouter, // Add your router here
})

export type AppRouter = typeof appRouter
```

### 2. Client-Side Implementation

#### Update React Component

In your React component, use the tRPC client:

```typescript
'use client'

import { trpc } from '@/lib/trpc/client'

const YourComponent = () => {
  // For queries (data fetching)
  const { data, isLoading, error } = trpc.yourFeature.yourQuery.useQuery()

  // For mutations (data modification)
  const { mutateAsync, isPending } = trpc.yourFeature.yourMutation.useMutation()

  const handleSubmit = async (formData: YourInputType) => {
    try {
      await mutateAsync(formData)
      // Handle success
    } catch (error) {
      // Handle error
      console.error('Error:', error)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {/* Render your data */}
      {data && <div>{/* Your UI */}</div>}
    </div>
  )
}
```

## Available HTTP Client Methods

The `ApiClient` class provides these methods for common operations:

### Products

- `getProducts(query?: ProductListQuery)` - List products with pagination
- `getProductById(id: string)` - Get single product
- `createProduct(body: CreateProductInput)` - Create product
- `updateProduct(id: string, body: UpdateProductInput)` - Update product
- `deleteProduct(id: string)` - Delete product

### Authentication

- `signin(body: SigninInput)` - User sign in
- `signup(body: SignupInput)` - User sign up

### API Keys

- `getApiKeys()` - List API keys
- `createApiKey(body: CreateApiKeyInput)` - Create API key
- `deactivateApiKey(id: string)` - Deactivate API key

## Type Definitions

Import types from the common package:

```typescript
import type {
  CreateProductInput,
  ProductListQuery,
  ProductResponse,
  SigninInput,
  SignupInput,
  // ... other types as needed
} from '@ecom/common'
```

## Error Handling Pattern

Always follow this error handling pattern in handlers:

```typescript
try {
  const result = await apiClient.someMethod(data)
  return result
} catch (error: unknown) {
  if (error && typeof error === 'object' && 'response' in error) {
    const responseError = error as {
      response?: { body?: { message?: string } }
    }
    if (responseError?.response?.body?.message) {
      throw new Error(responseError.response.body.message)
    }
  }
  throw error
}
```

## Examples

### Example 1: New Arrivals Products Query

**Handler:**

```typescript
export const getNewArrivals = async () => {
  try {
    const result = await apiClient.getProducts({
      pageSize: 4,
      pageIndex: 0,
    })
    return result.data // Array of products
  } catch (error: unknown) {
    // ... error handling
  }
}
```

**Router:**

```typescript
const productsRouter = router({
  newArrivals: procedure.query(getNewArrivals),
})
```

**Component:**

```typescript
const NewArrivals = () => {
  const { data: products, isLoading } = trpc.products.newArrivals.useQuery()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Example 2: User Sign Up Mutation

**Handler:**

```typescript
export const signUp = async ({ input }: { input: SignUpData }) => {
  try {
    const signupData: SignupInput = {
      email: input.email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
    }
    return await apiClient.signup(signupData)
  } catch (error: unknown) {
    // ... error handling
  }
}
```

**Router:**

```typescript
const authRouter = router({
  signUp: procedure.input(baseSignUpSchema).mutation(signUp),
})
```

**Component:**

```typescript
const SignUpForm = () => {
  const { mutateAsync, isPending } = trpc.auth.signUp.useMutation()

  const onSubmit = async (data: SignUpData) => {
    try {
      await mutateAsync(data)
      // Handle success
    } catch (error) {
      // Handle error
    }
  }
  // ... rest of component
}
```

## Directory Structure

```
apps/web/
├── server/
│   └── router/
│       ├── index.ts              # Main router export
│       ├── auth/                 # Auth feature
│       │   ├── auth.handler.ts   # API calls
│       │   ├── auth.router.ts    # tRPC router
│       │   └── auth.schema.ts    # Input validation
│       └── products/             # Products feature
│           ├── products.handler.ts
│           ├── products.router.ts
│           └── products.schema.ts
└── components/
    └── YourComponent/
        └── index.tsx             # Uses trpc client
```

## Best Practices

1. **Follow Naming Conventions**: Use consistent naming across handler, router, and schema files
2. **Type Safety**: Always define proper TypeScript types for inputs and outputs
3. **Error Handling**: Use the established error handling pattern consistently
4. **Separation of Concerns**: Keep handlers focused on API calls, routers on tRPC setup, schemas on validation
5. **Client-Side Error Handling**: Handle loading and error states in React components
6. **Input Validation**: Use Zod schemas for input validation in tRPC procedures

This pattern ensures consistency, type safety, and maintainability across the entire codebase.
