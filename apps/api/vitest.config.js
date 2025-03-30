/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

import baseConfig from '@ecom/config/vitest/vitest-server.config'

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    testTimeout: 10000,
  },
})
