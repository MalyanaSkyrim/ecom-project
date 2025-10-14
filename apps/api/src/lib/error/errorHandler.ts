import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

import { BaseError } from './base'
import { ERROR_CODES } from './types/types'

export const errorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  // Handle Fastify validation errors
  if ((error as FastifyError).code === 'FST_ERR_VALIDATION') {
    const response = {
      message: (error as FastifyError).message,
      code: ERROR_CODES.VALIDATION_ERROR,
    }

    return reply.code(400).send(response)
  }

  // Handle our custom BaseError instances
  if (error instanceof BaseError) {
    return reply.code(error.statusCode).send({
      message: error.message,
      code: error.code,
    })
  }

  // Handle unexpected errors
  return reply.code(500).send({
    message: 'Internal server error',
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
  })
}
