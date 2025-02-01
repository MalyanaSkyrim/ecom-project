import { defineConfig } from 'tsup'

export default defineConfig(() => {
  return {
    entry: ['./src/index.ts'],
    outDir: 'build',
    format: ['esm', 'cjs'],
    splitting: false,
    sourcemap: false,
    bundle: true,
    clean: true,
    minify: process.env.NODE_ENV === 'production',
    skipNodeModulesBundle: true,
    target: 'node22',
  }
})
