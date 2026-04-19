import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/renderer/src/POS/features/sys-settings/api/tdd_setup.ts'],
    alias: {
      '@main': resolve(__dirname, './src/main'),
      '@shared': resolve(__dirname, './src/shared'),
      '@renderer': resolve(__dirname, './src/renderer'),
      '@pos': resolve(__dirname, './src/renderer/src/POS')
    }
  }
})

