import { VitePWA } from 'vite-plugin-pwa'

export function pwaPlugin() {
  return VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
    manifest: {
      name: 'Doctor Wedding ADM',
      short_name: 'Doctor Wedding',
      description: 'Doctor Wedding administration panel',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      cleanupOutdatedCaches: true,
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ttf}'],
      // Exclude the full-size source logo — only the resized PWA icons are needed
      globIgnores: ['**/logo.png'],
      navigateFallback: 'index.html',
      // Prevent SW from hijacking API-like paths with the SPA fallback
      navigateFallbackDenylist: [/^\/api\//],
      runtimeCaching: [
        {
          // Read-only API endpoints — network first, fall back to cache when offline
          urlPattern: ({ request, url }) => {
            if (request.method !== 'GET') return false
            const p = url.pathname
            return (
              p.endsWith('/guests') ||
              p.endsWith('/budget') ||
              p.endsWith('/checklist') ||
              p.endsWith('/scenario') ||
              p.endsWith('/currency/rates') ||
              p.endsWith('/seating-arrangements/tables')
            )
          },
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-read-cache',
            networkTimeoutSeconds: 5,
            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 },
            cacheableResponse: { statuses: [200] },
          },
        },
      ],
    },
    devOptions: { enabled: false },
  })
}
