import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { MIN_SCALE } from '@/components/interactiveBoard/tableKonvaConfigs'

const MOBILE_DRAG_DISTANCE = 10

export function useStageSize(containerRef: Ref<HTMLDivElement | null>) {
  const stageWidth = ref(800)
  const stageHeight = ref(600)
  const isMobile = ref(false)

  let resizeObserver: ResizeObserver | null = null

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  onMounted(() => {
    if (!containerRef.value) return
    stageWidth.value = containerRef.value.clientWidth
    stageHeight.value = containerRef.value.clientHeight
    isMobile.value = containerRef.value.clientWidth < 640

    resizeObserver = new ResizeObserver((entries) => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        for (const entry of entries) {
          stageWidth.value = entry.contentRect.width
          stageHeight.value = entry.contentRect.height
          isMobile.value = entry.contentRect.width < 640
        }
      }, 250)
    })
    resizeObserver.observe(containerRef.value)
  })

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    resizeObserver?.disconnect()
  })

  const stageConfig = computed(() => ({
    width: stageWidth.value,
    height: stageHeight.value,
    draggable: true,
    dragDistance: isMobile.value ? MOBILE_DRAG_DISTANCE : 0,
    scaleX: MIN_SCALE,
    scaleY: MIN_SCALE,
  }))

  return { stageConfig, isMobile }
}
