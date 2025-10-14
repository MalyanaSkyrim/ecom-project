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
  getUserByEmail,
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

  const user = await getUserByEmail(email)

  if (!user || !user.password) {
    throw new InvalidCredentialsError({
      message:
        'Invalid email or password. Please check your credentials and try again.',
      meta: { email, hasPassword: !!user?.password },
    })
  }

  const isPasswordValid = await verifyPassword(password, user.password)
  if (!isPasswordValid) {
    throw new InvalidCredentialsError({
      message:
        'Invalid email or password. Please check your credentials and try again.',
      meta: { email, userId: user.id },
    })
  }

  const { accessToken } = generateTokens(user.id, user.email)

  reply.code(200).send({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    },
    accessToken,
  })
}
