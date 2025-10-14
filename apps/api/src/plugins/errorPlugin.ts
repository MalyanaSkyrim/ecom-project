import fp from 'fastify-plugin'

import { errorHandler } from '../lib/error/errorHandler'

export default fp(
  async (fastify) => {
    console.log('🔧 Error plugin loading...')

    // Set global error handler - this will catch all errors except validation errors
    fastify.setErrorHandler(errorHandler)

    console.log('✅ Error handler registered successfully')
    fastify.log.info('Error handler registered successfully')

    // // Set validation error formatter to return our custom response format directly
    // fastify.setSchemaErrorFormatter((errors, dataVar) => {
    //   console.log(
    //     '🚨 Schema validation error formatter called!',
    //     errors.length,
    //     'errors',
    //   )
    //   fastify.log.info(
    //     {
    //       errorCount: errors.length,
    //       errors: errors.map((err) => ({
    //         instancePath: err.instancePath,
    //         message: err.message,
    //       })),
    //     },
    //     'Schema validation error formatter called',
    //   )

    //   // Create a custom error with our response format
    //   const validationError = new Error('Validation error')

    //   // Set properties that will be used in the response
    //   Object.assign(validationError, {
    //     statusCode: 400,
    //     code: 'VALIDATION_ERROR',
    //     message: 'Validation error',
    //     data: errors.map((err) => ({
    //       field: err.instancePath || 'unknown',
    //       message: err.message || 'Validation error',
    //     })),
    //   })

    //   fastify.log.info(
    //     {
    //       name: validationError.name,
    //       message: validationError.message,
    //       statusCode: (validationError as any).statusCode,
    //       code: (validationError as any).code,
    //       validationCount: errors.length,
    //     },
    //     'Created validation error',
    //   )

    //   return validationError
    // })

    console.log('✅ Schema error formatter registered successfully')
    fastify.log.info('Schema error formatter registered successfully')
  },
  {
    name: 'error-handler',
    fastify: '5.x',
  },
)
