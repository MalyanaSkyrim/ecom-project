import { formatDuration, intervalToDuration } from 'date-fns'
import { RouteHandler } from 'fastify'

import type { HealthOutputType } from './health.schema'

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
export const healthHandler: RouteHandler<{
  Reply: HealthOutputType
}> = async (_, reply) => {
  reply.code(200).send({
    status: 'OK',
    uptime: getReadableUptime(),
    docURL: 'https://internal-docs.pragma-project.dev/',
    apiVersions: '1',
  })
}
