// electron.vite.config.ts
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
var __electron_vite_injected_dirname = 'C:\\Users\\ryanm\\Desktop\\MW\\innosoft-mw'
var electron_vite_config_default = defineConfig({
  main: {
    assetsInclude: ['src/renderer/assets/**', 'src/shared/assets/**'],
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@main': resolve(__electron_vite_injected_dirname, 'src/main'),
        '@shared': resolve(__electron_vite_injected_dirname, 'src/shared')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve(__electron_vite_injected_dirname, 'src/shared')
      }
    }
  },
  renderer: {
    assetsInclude: ['src/renderer/assets/**', 'src/shared/assets/**'],
    resolve: {
      alias: {
        '@renderer': resolve(__electron_vite_injected_dirname, 'src/renderer/src'),
        '@renderers': resolve(__electron_vite_injected_dirname, 'src/renderer'),
        '@windows': resolve(__electron_vite_injected_dirname, 'src/renderer/src/windows'),
        '@shared': resolve(__electron_vite_injected_dirname, 'src/shared'),
        '@/asset': resolve(__electron_vite_injected_dirname, 'src/renderer/assets'),
        '@/registry': resolve(__electron_vite_injected_dirname, 'src/renderer/src/registry'),
        '@/components': resolve(__electron_vite_injected_dirname, 'src/renderer/src/components')
      }
    },
    plugins: [react()]
  }
})
export { electron_vite_config_default as default }
