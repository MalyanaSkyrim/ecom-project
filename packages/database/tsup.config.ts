import dotenv from 'dotenv'
import { defineConfig } from 'tsup'

dotenv.config()

export default defineConfig(() => {
  return {
    entry: ['./src/index.ts'],
    outDir: 'build',
    splitting: false,
    sourcemap: false,
    bundle: true,
    clean: true,
    minify: process.env.NODE_ENV === 'production',
    skipNodeModulesBundle: true,
    target: 'node22',
  }
})
