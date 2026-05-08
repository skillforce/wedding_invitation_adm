import { inject, provide, ref, onMounted, onUnmounted, type InjectionKey, type Ref } from 'vue'

// Module-level state — shared between host (AuthorizedLayout) and the indicator component.
// Safe because only one authorized layout and one indicator are ever mounted simultaneously.
export const pullProgress = ref(0)  // 0 → 1
export const isRefreshing = ref(false)
export const isPulling = ref(false)

interface PullRefreshContext {
  register: (fn: () => Promise<void>) => void
  unregister: () => void
}

const CONTEXT_KEY: InjectionKey<PullRefreshContext> = Symbol('pullToRefresh')

const PULL_THRESHOLD = 64  // progress-space pixels needed to fire
const PULL_MAX = 96        // max visual travel before rubber-band clips

let _callback: (() => Promise<void>) | null = null

/**
 * Mount in AuthorizedLayout. Attaches touch listeners to the scroll container,
 * manages gesture state, and provides registration context to child views.
 */
export function usePullToRefreshHost(containerRef: Ref<HTMLElement | null>) {
  let startY = 0

  function handleTouchStart(e: TouchEvent) {
    if ((containerRef.value?.scrollTop ?? 1) > 0) return
    startY = e.touches[0].clientY
    isPulling.value = true
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isPulling.value || isRefreshing.value) return
    const delta = e.touches[0].clientY - startY
    if (delta <= 0) {
      isPulling.value = false
      return
    }
    e.preventDefault()
    pullProgress.value = Math.min(1, (delta * 0.45) / PULL_MAX)
  }

  async function handleTouchEnd() {
    if (!isPulling.value) return
    isPulling.value = false

    if (pullProgress.value * PULL_MAX >= PULL_THRESHOLD && _callback) {
      isRefreshing.value = true
      pullProgress.value = PULL_THRESHOLD / PULL_MAX
      try {
        await _callback()
      } finally {
        isRefreshing.value = false
        pullProgress.value = 0
      }
    } else {
      pullProgress.value = 0
    }
  }

  onMounted(() => {
    const el = containerRef.value
    if (!el) return
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    const el = containerRef.value
    if (!el) return
    el.removeEventListener('touchstart', handleTouchStart)
    el.removeEventListener('touchmove', handleTouchMove)
    el.removeEventListener('touchend', handleTouchEnd)
    pullProgress.value = 0
    isRefreshing.value = false
    isPulling.value = false
  })

  provide(CONTEXT_KEY, {
    register: (fn) => { _callback = fn },
    unregister: () => { _callback = null },
  })
}

/**
 * Call in any authorized view to register its data-refresh callback.
 * The callback fires when the user completes a pull gesture.
 */
export function usePullToRefresh(fn: () => Promise<void>) {
  const ctx = inject(CONTEXT_KEY)
  if (!ctx) return
  ctx.register(fn)
  onUnmounted(() => ctx.unregister())
}