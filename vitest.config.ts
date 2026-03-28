import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@main': resolve(__dirname, './src/main'),
      '@shared': resolve(__dirname, './src/shared'),
      '@renderer': resolve(__dirname, './src/renderer'),
    },
  },
})
