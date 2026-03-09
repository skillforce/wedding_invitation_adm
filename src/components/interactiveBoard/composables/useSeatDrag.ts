import { ref } from 'vue'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { Stage } from 'konva/lib/Stage'
import { guestPosition } from '../tableKonvaConfigs'
import type { SeatingTable } from "../../../stores/seating"

export function useSeatDrag(
  table: () => SeatingTable,
  onGuestDrag: (guestId: string, pointer: { x: number; y: number }) => void,
  onGuestDrop: (guestId: string, pointer: { x: number; y: number }) => void,
  onGuestDragEnd: () => void,
) {
  const draggingGuestId = ref<string | null>(null)
  const dragOrigins = new Map<string, { x: number; y: number }>()

  function onSeatDragStart(e: KonvaEventObject<DragEvent>, guestId: string, index: number) {
    e.cancelBubble = true
    draggingGuestId.value = guestId
    dragOrigins.set(guestId, guestPosition(table(), index))
    const stage = e.target.getStage() as Stage
    const pointer = stage?.getPointerPosition()
    stage?.container().style.setProperty('cursor', 'grabbing')
    if (pointer) {
      onGuestDrag(guestId, pointer)
    }
  }

  function onSeatDragMove(e: KonvaEventObject<DragEvent>, guestId: string) {
    e.cancelBubble = true
    const pointer = e.target.getStage()?.getPointerPosition()
    if (pointer) {
      onGuestDrag(guestId, pointer)
    }
  }

  function onSeatDragEnd(e: KonvaEventObject<DragEvent>, guestId: string, index: number) {
    e.cancelBubble = true

    const stage = e.target.getStage()
    const pointer = stage?.getPointerPosition()
    const origin = dragOrigins.get(guestId) ?? guestPosition(table(), index)
    dragOrigins.delete(guestId)
    draggingGuestId.value = null
    e.target.position(origin)
    stage?.container().style.setProperty('cursor', 'default')

    if (pointer) {
      onGuestDrop(guestId, pointer)
    }

    onGuestDragEnd()
  }

  return { draggingGuestId, onSeatDragStart, onSeatDragMove, onSeatDragEnd }
}
