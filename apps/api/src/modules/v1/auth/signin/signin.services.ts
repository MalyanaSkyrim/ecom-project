import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { db } from '@ecom/database'

import { env } from '../../../../env'

export const getUserByEmail = (email: string) => {
  return db.user.findUnique({
    where: { email },
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
export const generateTokens = (userId: string, email: string) => {
  const accessToken = jwt.sign(
    {
      userId,
      email,
    },
    env.NEXTAUTH_SECRET,
    { expiresIn: '1d' },
  )

  return { accessToken }
}
