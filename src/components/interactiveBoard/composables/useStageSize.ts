import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useStageSize(containerRef: Ref<HTMLDivElement | null>) {
  const stageWidth = ref(800)
  const stageHeight = ref(600)
  const isMobile = ref(false)

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    if (!containerRef.value) return
    stageWidth.value = containerRef.value.clientWidth
    stageHeight.value = containerRef.value.clientHeight
    isMobile.value = containerRef.value.clientWidth < 640

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        stageWidth.value = entry.contentRect.width
        stageHeight.value = entry.contentRect.height
        isMobile.value = entry.contentRect.width < 640
      }
    })
    resizeObserver.observe(containerRef.value)
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
  })

  const stageConfig = computed(() => ({
    width: stageWidth.value,
    height: stageHeight.value,
    draggable: true,
  }))

  return { stageConfig, isMobile }
}
