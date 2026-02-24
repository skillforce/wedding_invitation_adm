import { onMounted, onUnmounted, nextTick } from 'vue'
import type { Ref } from 'vue'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { Stage } from 'konva/lib/Stage'
import { SCALE_BY, MIN_SCALE, MAX_SCALE } from '@/components/interactiveBoard/tableKonvaConfigs'

export function useZoom(stageRef: Ref<{ getNode(): Stage } | null>) {
  function applyZoom(stage: Stage, newScale: number, pointer: { x: number; y: number }) {
    const clampedScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE)
    const oldScale = stage.scaleX()
    const pointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }
    stage.scale({ x: clampedScale, y: clampedScale })
    stage.position({
      x: pointer.x - pointTo.x * clampedScale,
      y: pointer.y - pointTo.y * clampedScale,
    })
    stage.batchDraw()
  }

  function onWheel(e: KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault()
    const stage = e.target.getStage() as Stage
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()!
    const newScale = e.evt.deltaY > 0 ? oldScale / SCALE_BY : oldScale * SCALE_BY
    applyZoom(stage, newScale, pointer)
  }

  // ── Pinch-to-zoom ─────────────────────────────────────────────────────────
  let pinchStartDist = 0
  let pinchStartScale = 1

  function getTouchDist(touches: TouchList) {
    if (touches.length !== 2) return 0
    const touch1 = touches[0]
    const touch2 = touches[1]
    if(!touch1 || !touch2) return 0
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  function handleTouchStart(e: TouchEvent) {
    if (e.touches.length !== 2) return
    pinchStartDist = getTouchDist(e.touches)
    pinchStartScale = stageRef.value?.getNode().scaleX() ?? 1
  }

  function handleTouchMove(e: TouchEvent) {
    if (e.touches.length !== 2) return
    e.preventDefault()

    const stage = stageRef.value?.getNode()
    if (!stage) return

    const newDist = getTouchDist(e.touches)
    const newScale = pinchStartScale * (newDist / pinchStartDist)

    const box = stage.container().getBoundingClientRect()
    if(!box) return

    if(e.touches.length !== 2) return
    const touch1 = e.touches[0]
    const touch2 = e.touches[1]
    if(!touch1 || !touch2) return

    const pointer = {
      x: (touch1.clientX + touch2.clientX) / 2 - box.left,
      y: (touch1.clientY + touch2.clientY) / 2 - box.top,
    }

    applyZoom(stage, newScale, pointer)
  }

  onMounted(async () => {
    await nextTick()
    const stageNode = stageRef.value?.getNode()
    const container = stageNode?.container()
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false })
      container.addEventListener('touchmove', handleTouchMove, { passive: false })
    }
  })

  onUnmounted(() => {
    const stageNode = stageRef.value?.getNode()
    const container = stageNode?.container()
    if (container) {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
    }
  })

  function centerOn(x: number, y: number) {
    const stage = stageRef.value?.getNode()
    if (!stage) return
    const container = stage.container()
    const scale = stage.scaleX()
    stage.position({
      x: container.clientWidth / 2 - x * scale,
      y: container.clientHeight / 2 - y * scale,
    })
    stage.batchDraw()
  }

  return { onWheel, centerOn }
}
