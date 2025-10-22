import { faker } from '@faker-js/faker'

import { db } from '../../../src'

// Initialize faker with a seed for consistent results
faker.seed(42)

export interface CreateCustomerData {
  storeId: string
  email: string
  firstName?: string
  lastName?: string
  // Auth-related fields (for next-auth)
  name?: string
  password?: string
  emailVerified?: Date
  avatar?: string
  // Newsletter subscription
  isNewsletterSubscribed?: boolean
  // Store-specific customer data
  totalSpent?: number
  orderCount?: number
}

/**
 * Create a single customer (idempotent)
 */
export async function createSingleCustomer(data: CreateCustomerData): Promise<{
  id: string
  email: string
  firstName?: string
  lastName?: string
}> {
  const customer = await db.customer.upsert({
    where: {
      storeId_email: {
        storeId: data.storeId,
        email: data.email,
      },
    },
    update: {
      firstName: data.firstName,
      lastName: data.lastName,
      // Auth-related fields
      ...(data.name && { name: data.name }),
      ...(data.password && { password: data.password }),
      ...(data.emailVerified && { emailVerified: data.emailVerified }),
      ...(data.avatar && { avatar: data.avatar }),
      // Newsletter subscription
      ...(data.isNewsletterSubscribed !== undefined && {
        isNewsletterSubscribed: data.isNewsletterSubscribed,
      }),
      // Store-specific customer data
      totalSpent: data.totalSpent ? data.totalSpent : 0,
      orderCount: data.orderCount ? data.orderCount : 0,
    },
    create: {
      storeId: data.storeId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      // Auth-related fields
      ...(data.name && { name: data.name }),
      ...(data.password && { password: data.password }),
      ...(data.emailVerified && { emailVerified: data.emailVerified }),
      ...(data.avatar && { avatar: data.avatar }),
      // Newsletter subscription
      isNewsletterSubscribed: data.isNewsletterSubscribed || false,
      // Store-specific customer data
      totalSpent: data.totalSpent ? data.totalSpent : 0,
      orderCount: data.orderCount ? data.orderCount : 0,
    },
  })

  console.log(`✓ Customer ready: ${customer.email}`)
  return {
    id: customer.id,
    email: customer.email,
    firstName: customer.firstName || undefined,
    lastName: customer.lastName || undefined,
  }
}

/**
 * Create multiple customers for a store
 */
export async function createManyCustomers(
  storeId: string,
  size: number,
): Promise<
  Array<{ id: string; email: string; firstName?: string; lastName?: string }>
> {
  const customers = []

  for (let i = 1; i <= size; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const email = faker.internet.email({ firstName, lastName })

    const customer = await createSingleCustomer({
      storeId,
      email,
      firstName,
      lastName,
      totalSpent: faker.number.int({ min: 0, max: 5000 }),
      orderCount: faker.number.int({ min: 0, max: 20 }),
    })

    customers.push(customer)
  }

  console.log(`✓ Created ${size} customers for store ${storeId}`)
  return customers
}

/**
 * Create a customer with auth credentials (for testing login)
 */
export async function createCustomerWithAuth(
  storeId: string,
  userEmail: string,
  userFirstName: string,
  userLastName?: string,
  password: string = 'password123',
): Promise<{
  id: string
  email: string
  firstName?: string
  lastName?: string
}> {
  return createSingleCustomer({
    storeId,
    email: userEmail,
    firstName: userFirstName,
    lastName: userLastName,
    name: `${userFirstName} ${userLastName || ''}`.trim(),
    password: password, // This will be hashed by the API
    emailVerified: new Date(),
    isNewsletterSubscribed: faker.datatype.boolean(),
    totalSpent: faker.number.int({ min: 0, max: 2000 }),
    orderCount: faker.number.int({ min: 0, max: 10 }),
  })
}
