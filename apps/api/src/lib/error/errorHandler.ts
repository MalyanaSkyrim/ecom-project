import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

import { BaseError } from './base'

export const errorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  // Handle Fastify validation errors
  if ((error as FastifyError).code === 'FST_ERR_VALIDATION') {
    const validationError = error as FastifyError & {
      validation?: Array<{
        instancePath?: string
        schemaPath?: string
        keyword?: string
        params?: Record<string, unknown>
        message?: string
      }>
    }

    const validationErrors =
      validationError.validation?.map((err) => ({
        field: err.instancePath || 'unknown',
        message: err.message || 'Validation error',
      })) || []

    const response = {
      message: (error as FastifyError).message,
      code: 'VALIDATION_ERROR',
      data: validationErrors,
    }

    return reply.code(400).send(response)
  }

  // Handle our custom BaseError instances
  if (error instanceof BaseError) {
    // Prepare response with optional meta field
    const response: {
      message: string
      code: string
      meta?: Record<string, unknown>
    } = {
      message: error.message,
      code: error.code,
    }

    // Include meta in response if it exists and has content
    if (error.meta && Object.keys(error.meta).length > 0) {
      response.meta = error.meta
    }

    return reply.code(error.statusCode).send(response)
  }

  // Handle unexpected errors
  return reply.code(500).send({
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  })
}
