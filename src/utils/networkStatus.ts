import { readonly, ref } from 'vue'

const NETWORK_PROBE_TIMEOUT_MS = 5_000

const isOnlineState = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

let probeUrl = '/auth/me'
let subscriberCount = 0

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
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => {
      controller.abort()
      reject(new Error('timeout'))
    }, NETWORK_PROBE_TIMEOUT_MS),
  )

  try {
    await Promise.race([
      fetch(probeUrl, { mode: 'no-cors', cache: 'no-store', signal: controller.signal }),
      timeout,
    ])
    markOnline()
  } catch {
    markOffline()
  }
}

function handleOnline(): void {
  // Browser online event can fire before connectivity is fully restored — probe once to confirm.
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

  if (!navigator.onLine) {
    markOffline()
  }
}

export function stopNetworkStatusMonitor(): void {
  if (typeof window === 'undefined' || subscriberCount === 0) return

  subscriberCount -= 1
  if (subscriberCount > 0) return

  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
}