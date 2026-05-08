import { readonly, ref } from 'vue'

const isOnlineState = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

export const isOnline = readonly(isOnlineState)

export function markOnline(): void {
  isOnlineState.value = true
}

export function markOffline(): void {
  isOnlineState.value = false
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', markOnline)
  window.addEventListener('offline', markOffline)
}