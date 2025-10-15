import glob from 'tiny-glob'
import { defineConfig } from 'tsup'

import { env } from './src/env'

export default defineConfig(async function () {
  const pluginsEntries = await glob('src/plugins/*.ts')
  const modulesEntries = await glob('src/modules/**/*.router.ts')

  return {
    entry: ['src/app.ts', ...pluginsEntries, ...modulesEntries],
    outDir: 'build',
    bundle: true,
    sourcemap: true,
    clean: true,
    minify: env.NODE_ENV === 'production',
    skipNodeModulesBundle: true,
    target: 'node22',
    format: ['esm'],
    noExternal: ['@ecom/common', '@ecom/http-client'],
  }
})
