import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    ...(command === 'serve' ? [vueDevTools()] : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('preload-helper')) {
            return 'vendor-core'
          }

          if (!id.includes('node_modules')) {
            return
          }

          if (
            id.includes('/node_modules/vue/') ||
            id.includes('/node_modules/pinia/') ||
            id.includes('/node_modules/vue-router/') ||
            id.includes('/node_modules/vue-i18n/')
          ) {
            return 'vendor-core'
          }

          if (
            id.includes('/node_modules/primevue/') ||
            id.includes('/node_modules/@primeuix/')
          ) {
            return 'vendor-ui'
          }

          if (
            id.includes('/node_modules/konva/') ||
            id.includes('/node_modules/vue-konva/')
          ) {
            return 'vendor-konva'
          }

          if (
            id.includes('/node_modules/jspdf/') ||
            id.includes('/node_modules/html2canvas/')
          ) {
            return 'vendor-pdf'
          }
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
}))
