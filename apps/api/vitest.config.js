/// <reference types="vitest" />
import baseConfig from '@ecom/config/vitest/vitest-server.config'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    testTimeout: 10000,
  },
})
