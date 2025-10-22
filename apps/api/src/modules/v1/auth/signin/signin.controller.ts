import { formatDuration, intervalToDuration } from 'date-fns'
import { RouteHandler } from 'fastify'

import { InvalidCredentialsError } from '../../../../lib/error'
import {
  SigninErrorOutput,
  SigninInput,
  SigninSuccessOutput,
} from './signin.schema'
import {
  generateTokens,
  getCustomerByEmail,
  verifyPassword,
} from './signin.services'

/**
 * get the current uptime in a readable format
 */
export function getReadableUptime() {
  const uptime = process.uptime()

  return formatDuration(intervalToDuration({ start: 0, end: uptime * 1000 }))
}

/**
 * @todo Add dynamic docURL and apiVersions
 */
export const signinHandler: RouteHandler<{
  Body: SigninInput
  Reply: {
    '2xx': SigninSuccessOutput
    '4xx': SigninErrorOutput
    '5xx': SigninErrorOutput
  }
}> = async (req, reply) => {
  const { email, password } = req.body
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new InvalidCredentialsError({
      message: 'Store ID is required for authentication.',
      meta: { email },
    })
  }

  const customer = await getCustomerByEmail(email, storeId)

  if (!customer || !customer.password) {
    throw new InvalidCredentialsError({
      message:
        'Invalid email or password. Please check your credentials and try again.',
      meta: { email, hasPassword: !!customer?.password },
    })
  }

  const isPasswordValid = await verifyPassword(password, customer.password)
  if (!isPasswordValid) {
    throw new InvalidCredentialsError({
      message:
        'Invalid email or password. Please check your credentials and try again.',
      meta: { email, customerId: customer.id },
    })
  }

  const { accessToken } = generateTokens(
    customer.id,
    customer.email,
    customer.storeId,
  )

  reply.code(200).send({
    user: {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      avatar: customer.avatar,
    },
    accessToken,
  })
}
