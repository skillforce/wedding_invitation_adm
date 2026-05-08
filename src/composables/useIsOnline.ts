import { computed, ref } from 'vue'
import { useNetwork } from '@vueuse/core'

// Set to true by apiFetch when a request fails with a network/timeout error.
// Resets to false when any request succeeds.
export const apiOffline = ref(false)

export function markApiOffline(): void {
  apiOffline.value = true
}

export function markApiOnline(): void {
  apiOffline.value = false
}

/**
 * Combines the browser's online/offline events (useNetwork) with actual API
 * reachability (apiOffline). Returns false when either signal says offline —
 * covering cases where iOS PWA doesn't fire the native offline event.
 */
export function useIsOnline() {
  const { isOnline: browserOnline } = useNetwork()
  return computed(() => browserOnline.value && !apiOffline.value)
}