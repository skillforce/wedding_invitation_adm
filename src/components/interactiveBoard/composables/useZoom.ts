import { onMounted, onUnmounted, nextTick, ref } from 'vue'
import type { Ref } from 'vue'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { Stage } from 'konva/lib/Stage'
import {
  SCALE_BY,
  MIN_SCALE,
  MAX_SCALE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '@/components/interactiveBoard/tableKonvaConfigs'

const MOBILE_BREAKPOINT = 640
const MIN_SCALE_MOBILE = 0.2

function getMinScale() {
  return window.innerWidth < MOBILE_BREAKPOINT ? MIN_SCALE_MOBILE : MIN_SCALE
}


export function useZoom(stageRef: Ref<{ getNode(): Stage } | null>) {
  const isFitted = ref(true)

  // ── Clamp helpers ─────────────────────────────────────────────────────────
  function clampPosition(stage: Stage) {
    const scale = stage.scaleX()
    const vw = stage.width()
    const vh = stage.height()
    const scaledW = CANVAS_WIDTH * scale
    const scaledH = CANVAS_HEIGHT * scale

    const x =
      scaledW <= vw
        ? (vw - scaledW) / 2
        : Math.max(vw - scaledW, Math.min(0, stage.x()))

    const y =
      scaledH <= vh
        ? (vh - scaledH) / 2
        : Math.max(vh - scaledH, Math.min(0, stage.y()))

    stage.position({ x, y })
  }

  // ── Zoom ──────────────────────────────────────────────────────────────────
  function applyZoom(stage: Stage, newScale: number, pointer: { x: number; y: number }) {
    const clampedScale = Math.min(Math.max(newScale, getMinScale()), MAX_SCALE)
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
    isFitted.value = false
    clampPosition(stage)
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
  let lastPinchDist = 0

  function getTouchDist(touches: TouchList) {
    if (touches.length !== 2) return 0
    const touch1 = touches[0]
    const touch2 = touches[1]
    if (!touch1 || !touch2) return 0
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  function handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      lastPinchDist = getTouchDist(e.touches)
    } else {
      lastPinchDist = 0
    }
  }

  function handleTouchEnd(e: TouchEvent) {
    if (e.touches.length < 2) lastPinchDist = 0
  }

  function handleTouchMove(e: TouchEvent) {
    if (e.touches.length !== 2) return
    e.preventDefault()

    const stage = stageRef.value?.getNode()
    if (!stage || lastPinchDist === 0) return

    const newDist = getTouchDist(e.touches)
    if (newDist === 0) return

    const touch1 = e.touches[0]
    const touch2 = e.touches[1]
    if (!touch1 || !touch2) return

    const box = stage.container().getBoundingClientRect()
    const pointer = {
      x: (touch1.clientX + touch2.clientX) / 2 - box.left,
      y: (touch1.clientY + touch2.clientY) / 2 - box.top,
    }

    // Incremental: scale by ratio of current dist to last dist — no stale start state
    const newScale = stage.scaleX() * (newDist / lastPinchDist)
    lastPinchDist = newDist

    applyZoom(stage, newScale, pointer)
  }

  // ── Fit-to-screen ─────────────────────────────────────────────────────────
  function fitToStage(
    x = 0,
    y = 0,
    contentWidth = CANVAS_WIDTH,
    contentHeight = CANVAS_HEIGHT,
  ) {
    const stage = stageRef.value?.getNode()
    if (!stage) return

    const sw = stage.width()
    const sh = stage.height()
    const isMobileView = sw < 640

    const scaleX = sw / contentWidth
    const scaleY = sh / contentHeight
    const fitScale = Math.min(scaleX, scaleY)
    const scale = Math.min(
      Math.max(isMobileView ? fitScale : Math.min(1, fitScale), getMinScale()),
      MAX_SCALE,
    )

    const offsetX = (sw - contentWidth * scale) / 2 - x * scale
    const offsetY = (sh - contentHeight * scale) / 2 - y * scale

    stage.scale({ x: scale, y: scale })
    stage.position({ x: offsetX, y: offsetY })
    isFitted.value = true
    clampPosition(stage)
    stage.batchDraw()
  }

  function handleResize() { fitToStage() }

  onMounted(async () => {
    await nextTick()
    const stageNode = stageRef.value?.getNode()
    const container = stageNode?.container()
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false })
      container.addEventListener('touchmove', handleTouchMove, { passive: false })
      container.addEventListener('touchend', handleTouchEnd, { passive: true })
    }
    stageNode?.on('dragmove', () => { isFitted.value = false })
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    const stageNode = stageRef.value?.getNode()
    const container = stageNode?.container()
    if (container) {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
    window.removeEventListener('resize', handleResize)
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

  function zoomToMin() {
    const stage = stageRef.value?.getNode()
    if (!stage) return
    const scale = getMinScale()
    const sw = stage.width()
    const sh = stage.height()
    stage.scale({ x: scale, y: scale })
    stage.position({
      x: (sw - CANVAS_WIDTH * scale) / 2,
      y: (sh - CANVAS_HEIGHT * scale) / 2,
    })
    isFitted.value = true
    clampPosition(stage)
    stage.batchDraw()
  }

  return { onWheel, fitToStage, centerOn, zoomToMin, isFitted }
}
