import type { Plugin, ViteDevServer } from 'vite'

export const NONCE_PLACEHOLDER = 'NONCE_PLACEHOLDER'

const STATIC_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

function buildCsp(nonce: string, dev = false): string {
  return [
    "default-src 'self'",
    // dev: Vite injects its own scripts (HMR, @vite/client) without a nonce and uses eval
    dev
      ? `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval'`
      : `script-src 'self' 'nonce-${nonce}'`,
    dev
      ? `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`
      : `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob:",
    "font-src 'self'",
    dev ? "connect-src 'self' ws:" : "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ')
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
  const bytes = new Uint8Array(16)
  globalThis.crypto.getRandomValues(bytes)
  const devNonce = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

  return {
    name: 'vite-security-headers',

    configureServer(server: ViteDevServer) {
      server.middlewares.use((_req, res, next) => {
        res.setHeader('Content-Security-Policy', buildCsp(devNonce, true))
        for (const [key, value] of Object.entries(STATIC_HEADERS)) {
          res.setHeader(key, value)
        }
        next()
      })
    },

    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        return injectNonce(html, ctx.server ? devNonce : NONCE_PLACEHOLDER)
      },
    },
  }
}