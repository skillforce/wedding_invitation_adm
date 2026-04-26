import type { Plugin, ViteDevServer } from 'vite'

export const NONCE_PLACEHOLDER = 'NONCE_PLACEHOLDER'

const STATIC_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

function parseOriginsCsv(originsCsv?: string): string[] {
  if (!originsCsv) {
    return []
  }

  const origins = new Set<string>()

  for (const value of originsCsv.split(',')) {
    const trimmed = value.trim()
    if (!trimmed) {
      continue
    }

    try {
      origins.add(new URL(trimmed).origin)
    } catch {
      // Ignore malformed values to keep CSP generation resilient.
    }
  }

  return [...origins]
}

function getApiOrigin(apiUrl?: string): string | null {
  if (!apiUrl) {
    return null
  }

  try {
    return new URL(apiUrl).origin
  } catch {
    return null
  }
}

function buildCsp(nonce: string, apiUrl?: string, imgOriginsCsv?: string): string {
  const connectSrc = ["'self'"]
  const imgSrc = ["'self'", 'data:', 'blob:']
  const apiOrigin = getApiOrigin(apiUrl)
  const imgOrigins = parseOriginsCsv(imgOriginsCsv)

  if (apiOrigin) {
    connectSrc.push(apiOrigin)
  }

  for (const origin of imgOrigins) {
    imgSrc.push(origin)
  }

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'nonce-${nonce}'`,
    // inline style="..." attributes (PrimeVue overlays/tooltips set el.style.x) — can't carry a nonce
    "style-src-attr 'unsafe-inline'",
    `img-src ${imgSrc.join(' ')}`,
    "font-src 'self'",
    `connect-src ${connectSrc.join(' ')}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
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

export function securityHeadersPlugin(apiUrl?: string, imgOriginsCsv?: string): Plugin {
  const bytes = new Uint8Array(16)
  globalThis.crypto.getRandomValues(bytes)
  const devNonce = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

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

        return {
          html: injectNonce(html, NONCE_PLACEHOLDER),
          tags: [
            {
              tag: 'meta',
              attrs: {
                'http-equiv': 'Content-Security-Policy',
                // Note: frame-ancestors is intentionally omitted from meta CSP.
                // Browsers only enforce it from HTTP response headers.
                content: buildCsp(NONCE_PLACEHOLDER, apiUrl, imgOriginsCsv),
              },
              injectTo: 'head',
            },
          ],
        }
      },
    },
  }
}
