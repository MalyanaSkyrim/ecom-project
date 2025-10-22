# E-Commerce API - Bruno Collection

This directory contains the Bruno API collection for testing the e-commerce API endpoints.

## Structure

```
api/
├── Auth/                      # Authentication endpoints
│   ├── Sign In.bru           # User sign in
│   └── Sign up.bru           # User sign up
├── API Keys/                  # API Key management
│   ├── Create API Key.bru    # Create a new API key
│   ├── List API Keys.bru     # List all API keys
│   └── Deactivate API Key.bru # Deactivate an API key
├── Products/                  # Product management
│   ├── Create Product.bru    # Create a new product
│   ├── List Products.bru     # List products (paginated)
│   ├── Get Product by ID.bru # Get single product
│   ├── Update Product.bru    # Update a product
│   ├── Delete Product.bru    # Delete a product
│   ├── List Featured Products.bru # List featured products only
│   └── Search Products.bru   # Search products by text
├── API Health.bru            # Health check endpoint
└── environments/             # Environment configurations
    ├── Dev.bru              # Local development
    ├── Staging.bru          # Staging environment
    └── PROD.bru             # Production environment
```

## Getting Started

### 1. Install Bruno

Download and install Bruno from: https://www.usebruno.com/

### 2. Open the Collection

1. Open Bruno
2. Click "Open Collection"
3. Navigate to: `tooling/bruno/api`
4. Select the folder

### 3. Configure Environment

1. Select the environment (Dev, Staging, or PROD) from the dropdown
2. Set up the `API_KEY` environment variable

#### Getting an API Key

To get an API key, you need to:

1. **Run the seed script** to create initial data:

   ```bash
   pnpm db:seed
   ```

2. **Copy the API key** from the seed output:

   ```
   🔑 Creating API key...
   ✅ API key created
   🎉 Seed completed successfully!
   📊 Store ID: [store-id]
   🔑 API Key: sk_live_abc123def456...
   ```

3. **Set the environment variable**:

   **Option A: Set system environment variable (recommended)**:

   ```bash
   export API_KEY=sk_live_abc123def456...
   ```

   **Option B: Create a .env file** in the project root:

   ```bash
   # .env
   API_KEY=sk_live_abc123def456...
   ```

   The Dev environment is configured to read `API_KEY` from the system environment variable.

### 4. Test the API

Start by testing the Health Check:

1. Select "API Health" request
2. Click "Send"
3. You should see a 200 response with `{"status":"OK"}`

## Environment Variables

Each environment file contains:

| Variable  | Description                     | Example                 |
| --------- | ------------------------------- | ----------------------- |
| `API_URL` | Base URL of the API             | `http://localhost:4000` |
| `API_KEY` | Bearer token for authentication | `sk_live_abc123...`     |

## API Endpoints

### Authentication (No API Key Required)

#### Sign Up

- **POST** `/v1/auth/signup`
- Creates a new user account
- Body: `{ "email", "password", "firstName", "lastName" }`

#### Sign In

- **POST** `/v1/auth/signin`
- Authenticates a user
- Body: `{ "email", "password" }`

### API Keys (Requires API Key)

#### Create API Key

- **POST** `/v1/api-keys`
- Creates a new API key for the store
- Body: `{ "name": "Key Name" }`

#### List API Keys

- **GET** `/v1/api-keys`
- Lists all API keys for the store

#### Deactivate API Key

- **DELETE** `/v1/api-keys/:id`
- Deactivates an API key
- Path: `id` - API key ID

### Products (Requires API Key)

#### Create Product

- **POST** `/v1/products`
- Creates a new product
- Body:
  ```json
  {
    "name": "Product Name",
    "slug": "product-slug",
    "description": "Product description",
    "price": 99.99,
    "isActive": true,
    "isFeatured": false,
    "rating": 4.5,
    "totalSales": 100
  }
  ```

#### List Products (Paginated)

- **GET** `/v1/products`
- Lists products with pagination and filters
- Query Parameters:
  - `pageSize` (number, default: 10, max: 100)
  - `pageIndex` (number, default: 0)
  - `isFeatured` (boolean, optional) - Filter by featured status
  - `searchText` (string, optional) - Search in name and description

#### Get Product by ID

- **GET** `/v1/products/:id`
- Gets a single product by ID
- Path: `id` - Product ID (UUID)

#### Update Product

- **PUT** `/v1/products/:id`
- Updates a product
- Path: `id` - Product ID (UUID)
- Body: Partial product data (any fields to update)

#### Delete Product

- **DELETE** `/v1/products/:id`
- Deletes a product
- Path: `id` - Product ID (UUID)

### Health Check

#### API Health

- **GET** `/health`
- Checks if the API is running
- Response: `{ "status": "OK" }`

## Query Parameters

### Pagination

All list endpoints support pagination:

- `pageSize` - Number of items per page (default: 10, max: 100)
- `pageIndex` - Page number (0-based)

Example: `/v1/products?pageSize=20&pageIndex=1`

### Filtering

Products can be filtered by:

- `isFeatured` - Show only featured products
- `searchText` - Search in product name and description

Example: `/v1/products?isFeatured=true&searchText=wireless`

## Authentication

Most endpoints require an API key for authentication. The API key should be passed as a Bearer token in the `Authorization` header:

```
Authorization: Bearer sk_live_abc123def456...
```

Bruno automatically adds this header when you select a request that has `auth: bearer` configured.

## Tips

1. **Use variables**: The `~` prefix in query parameters means the parameter is disabled by default. Remove `~` to enable it.

2. **Path parameters**: Replace placeholder values (e.g., `product-id-here`) with actual IDs from your database.

3. **Copy IDs**: After creating a product or API key, copy the returned ID to use in other requests.

4. **Test pagination**: Try different `pageSize` and `pageIndex` values to test pagination.

5. **Test search**: Use the Search Products request to test full-text search functionality.

## Troubleshooting

### 401 Unauthorized

- Check that you have a valid API key in the environment
- Make sure the API key is active (not deactivated)
- Verify the API key belongs to the correct store

### 404 Not Found

- Check the URL path is correct
- Verify the resource ID exists in the database
- Make sure the API is running

### 400 Bad Request

- Check the request body format
- Verify required fields are present
- Check data types match the schema

## Development Workflow

1. **Start the API**:

   ```bash
   cd apps/api
   pnpm dev
   ```

2. **Seed the database** (first time only):

   ```bash
   pnpm db:seed
   ```

3. **Copy the API key** from the seed output

4. **Set the environment variable**:

   ```bash
   export API_KEY=sk_live_your-actual-api-key-here
   ```

5. **Test endpoints** using Bruno

6. **Iterate**: Make changes to your API and test immediately in Bruno

Happy testing! 🚀
