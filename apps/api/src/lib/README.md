# Authentication System

This directory contains the core authentication utilities for the e-commerce API.

## 🔐 **API Key Authentication System**

### **Overview**

The API uses API key-based authentication where each store has one or more API keys that provide access to store-specific resources.

### **API Key Format**

- **Format**: `sk_live_<64-character-secret>`
- **Example**: `sk_live_abc123def456...`
- **Storage**: Only hashed versions are stored in the database

### **Security Features**

- ✅ **Hashed Storage**: API keys are hashed using SHA-256 before storage
- ✅ **Prefix-based Lookups**: Fast database lookups using key prefixes
- ✅ **Store Isolation**: Each API key is tied to a specific store
- ✅ **Active Status**: API keys can be activated/deactivated
- ✅ **Store Validation**: Inactive stores cannot use their API keys

## 📁 **Files**

### **`auth.ts`** - Core Authentication Utilities

Contains all the functions for API key management:

#### **Key Generation**

```typescript
generateApiKey(): string                    // Generate new API key
hashApiKey(apiKey: string): string         // Hash API key for storage
extractKeyPrefix(apiKey: string): string   // Extract prefix for lookups
isValidApiKeyFormat(apiKey: string): boolean // Validate format
```

#### **Database Operations**

```typescript
createApiKey(storeId: string, name: string)     // Create new API key
validateApiKey(apiKey: string)                  // Validate and get store info
deactivateApiKey(apiKeyId: string)              // Deactivate API key
getStoreApiKeys(storeId: string)                // Get all store API keys
```

#### **Header Processing**

```typescript
extractApiKeyFromHeader(authHeader: string)     // Extract from Authorization header
```

## 🔧 **Usage Examples**

### **Creating an API Key**

```typescript
import { createApiKey } from './lib/auth'

const { apiKey, apiKeyRecord } = await createApiKey(
  'store-id-here',
  'Production API Key',
)
console.log('New API Key:', apiKey) // sk_live_abc123...
```

### **Validating an API Key**

```typescript
import { validateApiKey } from './lib/auth'

const result = await validateApiKey('sk_live_abc123...')
if (result.isValid) {
  console.log('Store ID:', result.storeId)
  console.log('Store Name:', result.storeName)
}
```

### **Using in HTTP Requests**

```bash
# Using Bearer token format
curl -H "Authorization: Bearer sk_live_abc123..." \
     https://api.example.com/products

# Using direct token format
curl -H "Authorization: sk_live_abc123..." \
     https://api.example.com/products
```

## 🛡️ **Security Considerations**

### **API Key Lifecycle**

1. **Generation**: Random 64-character secret with `sk_live_` prefix
2. **Storage**: SHA-256 hashed version stored in database
3. **Validation**: Incoming keys are hashed and compared
4. **Deactivation**: Keys can be deactivated without deletion

### **Database Schema**

```sql
-- ApiKey table structure
model ApiKey {
  id        String  @id @default(cuid())
  storeId   String  -- Links to Store
  name      String  -- Human-readable name
  keyPrefix String  -- "sk_live_" for fast lookups
  hashedKey String  @unique -- SHA-256 hash
  isActive  Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### **Error Handling**

- **Invalid Format**: Returns 401 with `INVALID_API_KEY_FORMAT`
- **Invalid Key**: Returns 401 with `INVALID_API_KEY`
- **Inactive Key**: Returns 401 with `INACTIVE_API_KEY`
- **Inactive Store**: Returns 401 with `INACTIVE_STORE`

## 🔄 **Integration with Fastify**

The authentication system integrates with Fastify through the `identity` plugin:

1. **Pre-handler Hook**: Validates API keys before route handlers
2. **Request Augmentation**: Adds `req.user` with store information
3. **Public Routes**: Skips authentication for health checks and auth routes
4. **Error Responses**: Consistent error format across all endpoints

## 📊 **Performance Optimizations**

- **Indexed Lookups**: Database indexes on `keyPrefix` and `hashedKey`
- **Early Validation**: Format validation before database queries
- **Efficient Hashing**: SHA-256 for fast hash generation
- **Minimal Queries**: Single database query per request

## 🧪 **Testing**

The authentication system can be tested by:

1. **Creating API Keys**: Use the `/api-keys` endpoints
2. **Validating Keys**: Test with various key formats
3. **Store Isolation**: Verify keys only access their store's data
4. **Error Scenarios**: Test invalid, inactive, and missing keys

## 🚀 **Next Steps**

- **Rate Limiting**: Implement per-API-key rate limiting
- **Key Rotation**: Add functionality to rotate API keys
- **Audit Logging**: Log API key usage for security monitoring
- **Caching**: Add Redis caching for frequently used keys
