import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    assetsInclude: ['src/renderer/assets/**', 'src/shared/assets/**'],
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
          react: ['react-router-dom', 'react-to-print', 'react-use'],
          reactLib: [
            'react-big-calendar',
            'react-datepicker',
            'react-icons',
            'react-toastify',
          ],
          websocket: ['socket.io-client'],
          mui: [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
            '@emotion/is-prop-valid',
          ],
          uuid: ['uuid'],
          cache: ['localforage'],
          validator: ['zod', 'yup'],
          reactQuery: ['@tanstack/react-query'],
          mdi: ['@mdi/js', '@mdi/react'],
          echarts: ['echarts'],
          htmlPdf: ['html2canvas', 'html2pdf.js'],
          pdf: ['@react-pdf/renderer', 'jspdf', 'react-to-pdf', 'react-pdf'],
          forms: ['formik'],
          styles: ['postcss', 'tailwind-merge', 'styled-components'],
          vendor: [
            'aws-sdk',
            'mock-aws-s3',
            'js-cookie',
            'autoprefixer',
            'axios',
            'clsx',
            'jwt-decode',
            'ts-node',
          ],
        },
      },
    },
            // if (id.includes('node_modules')) {
            //   // High-volume chart libraries
            //   if (id.includes('echarts') || id.includes('zrender') || id.includes('recharts')) {
            //     return 'charts'
            //   }
            //   // Material UI and styling engine
            //   if (id.includes('@mui') || id.includes('@emotion')) {
            //     return 'mui'
            //   }
            //   // Group React and other core vendors into a single chunk to avoid circular cycles
            //   // (e.g. react-vendor needing vendor, and vendor needing react-vendor)
            //   return 'vendor'
            // }
            // return undefined
          }
  }
})
