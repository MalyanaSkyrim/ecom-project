import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

export interface CreateUserData {
  firstName: string
  lastName?: string
  email: string
  password?: string
}

/**
 * Hash password using SHA-256
 * Note: In production, use bcryptjs or argon2 for proper password hashing
 */
async function hashPassword(password: string): Promise<string> {
  return createHash('sha256').update(password).digest('hex')
}

/**
 * Create a single user
 */
export async function createSingleUser(
  data: CreateUserData,
): Promise<{ id: string; email: string; firstName: string }> {
  const hashedPassword = data.password
    ? await hashPassword(data.password)
    : undefined

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      emailVerified: new Date(), // Auto-verify for seed data
    },
  })

  console.log(`✓ Created user: ${user.email}`)
  return user
}

/**
 * Create multiple users
 */
export async function createManyUsers(
  size: number,
): Promise<Array<{ id: string; email: string; firstName: string }>> {
  const users = []

  for (let i = 1; i <= size; i++) {
    const user = await createSingleUser({
      firstName: `User${i}`,
      lastName: `Test${i}`,
      email: `user${i}@example.com`,
      password: 'password123',
    })
    users.push(user)
  }

  console.log(`✓ Created ${size} users`)
  return users
}
