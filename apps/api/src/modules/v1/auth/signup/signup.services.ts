import bcrypt from 'bcryptjs'

import { db } from '@ecom/database'

import { SignupInput } from './signup.schema'

export const createCustomer = async (
  customerData: SignupInput,
  storeId: string,
) => {
  const { password, ...restCustomerData } = customerData

  const hashedPassword = await bcrypt.hash(password, 12)

  return db.customer.create({
    data: {
      password: hashedPassword,
      storeId,
      ...restCustomerData,
    },
  })
}
