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
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-core',
              test: /node_modules\/(vue|pinia|vue-router|vue-i18n)\//,
            },
            {
              name: 'vendor-ui',
              test: /node_modules\/(primevue|@primeuix)\//,
            },
            {
              name: 'vendor-konva',
              test: /node_modules\/(konva|vue-konva)\//,
            },
            {
              name: 'vendor-pdf',
              test: /node_modules\/(jspdf|html2canvas)\//,
            },
          ],
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
}))
