import { formatDuration, intervalToDuration } from 'date-fns'
import { RouteHandler } from 'fastify'

import {
  EmailAlreadyExistsError,
  UserCreationFailedError,
} from '../../../../lib/error'
import { getCustomerByEmail } from '../signin/signin.services'
import {
  SignupErrorOutput,
  SignupInput,
  SignupSuccessOutput,
} from './signup.schema'
import { createCustomer } from './signup.services'

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
export const signupHandler: RouteHandler<{
  Body: SignupInput
  Reply: {
    '2xx': SignupSuccessOutput
    '4xx': SignupErrorOutput
    '5xx': SignupErrorOutput
  }
}> = async (req, reply) => {
  const { email } = req.body
  const storeId = req.user?.storeId

  if (!storeId) {
    throw new EmailAlreadyExistsError({
      message: 'Store ID is required for account creation.',
      meta: { email },
    })
  }

  const existingCustomer = await getCustomerByEmail(email, storeId)

  if (existingCustomer) {
    throw new EmailAlreadyExistsError({
      message: `An account with the email '${email}' already exists. Please use a different email or try signing in.`,
      meta: { email, existingCustomerId: existingCustomer.id },
    })
  }

  try {
    const newCustomer = await createCustomer(req.body, storeId)

    reply.code(200).send({
      user: {
        id: newCustomer.id,
        email: newCustomer.email,
        firstName: newCustomer.firstName || '',
        lastName: newCustomer.lastName || '',
        avatar: newCustomer.avatar,
      },
    })
  } catch (error) {
    throw new UserCreationFailedError({
      message:
        'Failed to create customer account. Please try again or contact support if the issue persists.',
      meta: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        email,
        firstName: req.body.firstName,
      },
    })
  }
}
