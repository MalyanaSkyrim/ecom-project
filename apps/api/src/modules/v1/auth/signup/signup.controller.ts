import { formatDuration, intervalToDuration } from 'date-fns'
import { RouteHandler } from 'fastify'

import { generateTokens, getUserByEmail } from '../signin/signin.services'
import {
  SignupErrorOutput,
  SignupInput,
  SignupSuccessOutput,
} from './signup.schema'
import { createUser } from './signup.services'

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

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return reply
      .code(409)
      .send({ message: 'User with this email already exists' })
  }

  const newUser = await createUser(req.body)

  const { accessToken } = generateTokens(newUser.id, newUser.email)

  reply.code(200).send({
    user: {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      avatar: newUser.avatar,
    },
    accessToken,
  })
}
