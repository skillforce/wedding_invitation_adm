import { readonly, ref } from 'vue'

const NETWORK_PROBE_INTERVAL_MS = 15_000
const NETWORK_PROBE_TIMEOUT_MS = 4_000

const isOnlineState = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

let probeUrl = '/auth/me'
let subscriberCount = 0
let probeInterval: number | null = null

export const isOnline = readonly(isOnlineState)

export function configureNetworkStatus(baseApiUrl: string): void {
  probeUrl = `${baseApiUrl}/auth/me`
}

export function markOnline(): void {
  isOnlineState.value = true
}

export function markOffline(): void {
  isOnlineState.value = false
}

async function probeNetwork(): Promise<void> {
  if (typeof fetch === 'undefined') return

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), NETWORK_PROBE_TIMEOUT_MS)

  try {
    await fetch(probeUrl, {
      cache: 'no-store',
      credentials: 'include',
      headers: { 'Cache-Control': 'no-cache' },
      signal: controller.signal,
    })
    markOnline()
  } catch {
    markOffline()
  } finally {
    window.clearTimeout(timeoutId)
  }
}

function handleOnline(): void {
  markOnline()
  void probeNetwork()
}

function handleOffline(): void {
  markOffline()
}

export function startNetworkStatusMonitor(): void {
  if (typeof window === 'undefined') return

  subscriberCount += 1
  if (subscriberCount > 1) return

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  if (navigator.onLine) {
    void probeNetwork()
  } else {
    markOffline()
  }

  probeInterval = window.setInterval(() => {
    void probeNetwork()
  }, NETWORK_PROBE_INTERVAL_MS)
}

export function stopNetworkStatusMonitor(): void {
  if (typeof window === 'undefined' || subscriberCount === 0) return

  subscriberCount -= 1
  if (subscriberCount > 0) return

  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)

  if (probeInterval) {
    window.clearInterval(probeInterval)
    probeInterval = null
  }
}
