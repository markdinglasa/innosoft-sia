import react from '@vitejs/plugin-react'
import { defineConfig } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    assetsInclude: ['src/renderer/assets/**', 'src/shared/assets/**'],
    build: {
      externalizeDeps: true
    },
    resolve: {
      alias: {
        '@main': resolve(__dirname, 'src/main'),
        '@shared': resolve(__dirname, 'src/shared')
      }
    }
  },
  preload: {
    build: {
      externalizeDeps: true
    },
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
        '@pos': resolve(__dirname, 'src/renderer/src/POS'),
        '@shared': resolve(__dirname, 'src/shared'),
        '@/asset': resolve(__dirname, 'src/renderer/assets'),
        '@/registry': resolve(__dirname, 'src/renderer/src/registry'),
        '@/components': resolve(__dirname, 'src/renderer/src/components')
      }
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        external: ['bcrypt', '@mswjs/interceptors'],
        output: {
          experimentalMinChunkSize: 80000,
          manualChunks: {
            lodash: ['lodash'],
            react: ['react-router-dom'],
            reactLib: [
              //'react-big-calendar',
              //'react-datepicker',
              'react-icons',
              'react-toastify'
            ],
            websocket: ['socket.io-client'],
            mui: [
              '@mui/material',
              '@mui/icons-material',
              '@emotion/react',
              '@emotion/styled',
              '@emotion/is-prop-valid'
            ],
            uuid: ['uuid'],
            //cache: ['localforage'],
            validator: ['zod', 'yup'],
            reactQuery: ['@tanstack/react-query'],
            mdi: ['@mdi/js', '@mdi/react'],
            echarts: ['echarts'],
            htmlPdf: ['html2canvas', 'html2pdf.js'],
            //pdf: ['@react-pdf/renderer', 'jspdf', 'react-to-pdf', 'react-pdf'],
            forms: ['formik'],
            styles: ['postcss', 'tailwind-merge', 'styled-components'],
            vendor: [
              //'aws-sdk',
              //'mock-aws-s3',
              'js-cookie',
              'clsx',
              //'jwt-decode',
              'ts-node'
            ]
          }
        }
      }
    }
  }
})
