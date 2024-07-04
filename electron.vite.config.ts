import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@main': resolve(__dirname, 'src/main'),
        '@shared': resolve(__dirname, 'src/shared')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve(__dirname, 'src/shared')
      }
    }
  },
  renderer: {
    assetsInclude: ['src/renderer/assets/**', 'src/shared/assets/**'],
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src'),
        '@renderers': resolve(__dirname, 'src/renderer'),
        '@windows': resolve(__dirname, 'src/renderer/src/windows'),
        '@shared': resolve(__dirname, 'src/shared'),
        '@/asset': resolve(__dirname, 'src/renderer/assets'),
        '@/registry': resolve(__dirname, 'src/renderer/src/registry'),
        '@/components': resolve(__dirname, 'src/renderer/src/components')
      }
    },
    plugins: [react()]
  }
})
