import type { Plugin, ViteDevServer } from 'vite'

export const NONCE_PLACEHOLDER = 'NONCE_PLACEHOLDER'

const STATIC_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

function injectNonce(html: string, nonce: string): string {
  const meta = `    <meta name="csp-nonce" content="${nonce}">\n`

  return html
    .replace('<head>', `<head>\n${meta}`)
    .replace(/<script(\b[^>]*)>/g, (_, attrs: string) =>
      attrs.includes('nonce=') ? `<script${attrs}>` : `<script${attrs} nonce="${nonce}">`
    )
    .replace(
      /<link(\b[^>]*\brel=["'](?:stylesheet|modulepreload)["'][^>]*)(\/??>)/g,
      (_, attrs: string, close: string) =>
        attrs.includes('nonce=') ? `<link${attrs}${close}` : `<link${attrs} nonce="${nonce}"${close}`,
    )
}

export function securityHeadersPlugin(): Plugin {
  return {
    name: 'vite-security-headers',

    configureServer(server: ViteDevServer) {
      server.middlewares.use((_req, res, next) => {
        for (const [key, value] of Object.entries(STATIC_HEADERS)) {
          res.setHeader(key, value)
        }
        next()
      })
    },

    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (ctx.server) {
          return html
        }

        // CSP is enforced from HTTP response headers (Nginx).
        // Keep build-time nonce stamping for script/link + PrimeVue nonce consumption.
        return injectNonce(html, NONCE_PLACEHOLDER)
      },
    },
  }
}
