# Product Management API

This module provides comprehensive CRUD operations for managing products in the e-commerce system.

## Endpoints

### 1. Create Product

- **POST** `/products`
- **Body**: Product creation data
- **Response**: Created product with metadata

### 2. Get Product by ID

- **GET** `/products/:id`
- **Params**: Product ID (UUID format)
- **Response**: Single product data

### 3. Update Product

- **PUT** `/products/:id`
- **Params**: Product ID (UUID format)
- **Body**: Partial product update data
- **Response**: Updated product data

### 4. Delete Product

- **DELETE** `/products/:id`
- **Params**: Product ID (UUID format)
- **Response**: 204 No Content on success

### 5. List Products (Paginated)

- **GET** `/products`
- **Query Parameters**:
  - `pageSize` (number, default: 10, max: 100)
  - `pageIndex` (number, default: 0)
  - `isFeatured` (boolean, optional) - Filter by featured status
  - `searchText` (string, optional) - Search in name and description
- **Response**: Paginated list of products with metadata

## Features

- ✅ **Pagination**: Configurable page size and index
- ✅ **Search**: Full-text search across product name and description
- ✅ **Filtering**: Filter by featured status
- ✅ **Validation**: Comprehensive input validation with Zod
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Documentation**: Auto-generated OpenAPI/Swagger docs
- ✅ **Error Handling**: Consistent error responses
- ✅ **Multi-tenant**: Store-scoped operations (ready for auth middleware)

## Data Model

Products include the following fields:

- `id`: Unique identifier (UUID)
- `storeId`: Store identifier (multi-tenant)
- `name`: Product name (required)
- `slug`: URL-friendly identifier (required, unique per store)
- `description`: Product description (optional)
- `price`: Product price (required, positive number)
- `isActive`: Active status (default: true)
- `isFeatured`: Featured status (default: false)
- `rating`: Average rating (0-5, optional)
- `totalSales`: Total quantity sold (default: 0)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Authentication

**Note**: Currently using a hardcoded storeId for development. Authentication middleware needs to be implemented to:

1. Verify JWT tokens
2. Extract user and store information
3. Set `req.user.storeId` for multi-tenant operations

## Usage Examples

### Create a Product

```bash
POST /products
{
  "name": "Premium Wireless Headphones",
  "slug": "premium-wireless-headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": 299.99,
  "isFeatured": true
}
```

### List Products with Pagination

```bash
GET /products?pageSize=10&pageIndex=0&isFeatured=true&searchText=wireless
```

### Update a Product

```bash
PUT /products/clx1234567890abcdef
{
  "price": 249.99,
  "isFeatured": false
}
```

## Testing

Run the test suite:

```bash
npm test -- product.test.ts
```

The tests cover:

- CRUD operations
- Validation scenarios
- Pagination functionality
- Search and filtering
- Error handling
