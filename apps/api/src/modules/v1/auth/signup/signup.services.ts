import bcrypt from 'bcryptjs'

import { db } from '@ecom/database'

import { SignupInput } from './signup.schema'

export const createUser = async (userData: SignupInput) => {
  const { password, ...restUserData } = userData

  const hashedPassword = await bcrypt.hash(password, 12)

  return db.user.create({
    data: {
      password: hashedPassword,
      ...restUserData,
    },
  })
}
