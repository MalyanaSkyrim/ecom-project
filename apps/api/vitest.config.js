/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    watch: false,
    globals: true,
    deps: {
      inline: ['@fastify/autoload'],
    },
    testTimeout: 10000,
  },
})
