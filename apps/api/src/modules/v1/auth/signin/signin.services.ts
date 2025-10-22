import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { db } from '@ecom/database'

import { env } from '../../../../env'

export const getCustomerByEmail = (email: string, storeId: string) => {
  return db.customer.findUnique({
    where: {
      storeId_email: {
        storeId,
        email,
      },
    },
  })
}

export const verifyPassword = (password: string, userPassword: string) => {
  return bcrypt.compare(password, userPassword)
}

/**
 * Todo: add refresh token
 * @param userId
 * @param email
 */
export const generateTokens = (
  customerId: string,
  email: string,
  storeId: string,
) => {
  const accessToken = jwt.sign(
    {
      userId: customerId, // Keep as userId for backward compatibility
      customerId,
      email,
      storeId,
    },
    env.NEXTAUTH_SECRET,
    { expiresIn: '1d' },
  )

  return { accessToken }
}
