import { ref } from 'vue'
import type { KonvaEventObject } from 'konva/lib/Node'
import { ROTATION_SNAP } from '../tableKonvaConfigs'

export function useTableRotation(
  tableId: () => string,
  onRotate: (id: string, degrees: number) => void,
) {
  const isRotating = ref(false)
  const handleStartPos = ref<{ x: number; y: number } | null>(null)

  let rafId: number | null = null
  let pendingRotation: number | null = null

  function snapRotation(deg: number) {
    return Math.round(deg / ROTATION_SNAP) * ROTATION_SNAP
  }

  function onHandleMouseEnter(e: KonvaEventObject<MouseEvent>) {
    e.cancelBubble = true
    e.target.getStage()!.container().style.cursor = 'crosshair'
  }

  function onHandleMouseLeave(e: KonvaEventObject<MouseEvent>) {
    e.cancelBubble = true
    e.target.getStage()!.container().style.cursor = 'default'
  }

  function onHandleDragStart(e: KonvaEventObject<DragEvent>) {
    e.cancelBubble = true
    handleStartPos.value = { x: e.target.x(), y: e.target.y() }
    isRotating.value = true
  }

  function onHandleDragEnd(e: KonvaEventObject<DragEvent>) {
    e.cancelBubble = true
    if (handleStartPos.value) {
      e.target.position(handleStartPos.value)
    }
    handleStartPos.value = null
    isRotating.value = false
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    if (pendingRotation !== null) {
      onRotate(tableId(), snapRotation(pendingRotation))
      pendingRotation = null
    }
  }

  function onHandleDragMove(e: KonvaEventObject<DragEvent>) {
    e.cancelBubble = true
    const handle = e.target
    if (handleStartPos.value) {
      handle.position(handleStartPos.value)
    }
    const group = handle.getParent()!
    const pointerPos = handle.getStage()?.getPointerPosition()
    if (!pointerPos) return
    const absGroup = group.getAbsolutePosition()

    const angleDeg = Math.atan2(pointerPos.y - absGroup.y, pointerPos.x - absGroup.x) * (180 / Math.PI)
    pendingRotation = (angleDeg + 90 + 360) % 360

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (pendingRotation !== null) {
          onRotate(tableId(), snapRotation(pendingRotation))
        }
        rafId = null
        pendingRotation = null
      })
    }
  }

  function onHandleClick(e: KonvaEventObject<MouseEvent>) {
    e.cancelBubble = true
  }

  return {
    isRotating,
    onHandleMouseEnter,
    onHandleMouseLeave,
    onHandleDragStart,
    onHandleDragMove,
    onHandleDragEnd,
    onHandleClick,
  }
}
