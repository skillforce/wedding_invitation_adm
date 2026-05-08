import { onMounted, onUnmounted, readonly, ref } from 'vue'

const isBrowserOnline = ref(true)
let activeConsumers = 0

function readBrowserOnline(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine
}

function syncBrowserOnlineStatus(): void {
  isBrowserOnline.value = readBrowserOnline()
}

export function useBrowserOnlineStatus() {
  onMounted(() => {
    syncBrowserOnlineStatus()
    if (activeConsumers === 0) {
      window.addEventListener('online', syncBrowserOnlineStatus)
      window.addEventListener('offline', syncBrowserOnlineStatus)
    }
    activeConsumers += 1
  })

  onUnmounted(() => {
    activeConsumers = Math.max(0, activeConsumers - 1)
    if (activeConsumers === 0) {
      window.removeEventListener('online', syncBrowserOnlineStatus)
      window.removeEventListener('offline', syncBrowserOnlineStatus)
    }
  })

  return {
    isOnline: readonly(isBrowserOnline),
  }
}
