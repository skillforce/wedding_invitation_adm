import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command }) => ({
  plugins: [
    vue(),
    ...(command === 'serve' ? [vueDevTools()] : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-bundler.js',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/node_modules\/(vue|pinia|vue-router|vue-i18n|primevue|@primeuix)\//.test(id)) {
            return 'vendor-core'
          }
          if (/node_modules\/(konva|vue-konva)\//.test(id)) {
            return 'vendor-konva'
          }
          if (/node_modules\/(jspdf|html2canvas)\//.test(id)) {
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
