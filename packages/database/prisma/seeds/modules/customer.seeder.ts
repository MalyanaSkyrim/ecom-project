import { faker } from '@faker-js/faker'

import { db } from '../../../src'

// Initialize faker with a seed for consistent results
faker.seed(42)

export interface CreateCustomerData {
  storeId: string
  userId?: string // Optional - link to authenticated user
  email: string
  firstName?: string
  lastName?: string
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
      totalSpent: data.totalSpent ? data.totalSpent : 0,
      orderCount: data.orderCount ? data.orderCount : 0,
    },
    create: {
      storeId: data.storeId,
      userId: data.userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
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
 * Create a customer linked to an existing user
 */
export async function createCustomerFromUser(
  storeId: string,
  userId: string,
  userEmail: string,
  userFirstName: string,
  userLastName?: string,
): Promise<{
  id: string
  email: string
  firstName?: string
  lastName?: string
}> {
  return createSingleCustomer({
    storeId,
    userId,
    email: userEmail,
    firstName: userFirstName,
    lastName: userLastName,
    totalSpent: faker.number.int({ min: 0, max: 2000 }),
    orderCount: faker.number.int({ min: 0, max: 10 }),
  })
}
