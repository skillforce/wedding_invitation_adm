import { ref } from 'vue'
import type { Stage } from 'konva/lib/Stage'
import { useSeatingStore, type SeatingTable } from '@/stores/seating'
import { RECT_H, RECT_W } from '@/components/interactiveBoard/tableKonvaConfigs'

const DROP_TARGET_PADDING = 10

export function useGuestDrag(stageRef: { value: { getNode(): Stage } | null }) {
  const seatingStore = useSeatingStore()
  const dropTargetTableId = ref<string | null>(null)

  function stagePointToCanvas(point: { x: number; y: number }) {
    const stage = stageRef.value?.getNode()
    if (!stage) return point

    const scaleX = stage.scaleX() || 1
    const scaleY = stage.scaleY() || 1
    const stagePos = stage.position()

    return {
      x: (point.x - stagePos.x) / scaleX,
      y: (point.y - stagePos.y) / scaleY,
    }
  }

  function isInsideTableDropArea(table: SeatingTable, point: { x: number; y: number }) {
    if (table.shape === 'pillar') return false

    if (table.shape === 'circle') {
      const dx = point.x - table.x
      const dy = point.y - table.y
      const maxDistance = table.radius + DROP_TARGET_PADDING
      return dx * dx + dy * dy <= maxDistance * maxDistance
    }

    const width = table.radius * RECT_W + DROP_TARGET_PADDING * 2
    const height = table.radius * RECT_H + DROP_TARGET_PADDING * 2
    const angle = -((table.rotation ?? 0) * Math.PI) / 180
    const dx = point.x - table.x
    const dy = point.y - table.y

    const localX = dx * Math.cos(angle) - dy * Math.sin(angle)
    const localY = dx * Math.sin(angle) + dy * Math.cos(angle)

    return Math.abs(localX) <= width / 2 && Math.abs(localY) <= height / 2
  }

  function findDropTargetTable(sourceTableId: string, stagePoint: { x: number; y: number }) {
    const canvasPoint = stagePointToCanvas(stagePoint)
    return seatingStore.tables.find((table) => (
      table.id !== sourceTableId && isInsideTableDropArea(table, canvasPoint)
    )) ?? null
  }

  function onGuestDrag(sourceTableId: string, _guestId: string, stagePoint: { x: number; y: number }) {
    const targetTable = findDropTargetTable(sourceTableId, stagePoint)
    dropTargetTableId.value = targetTable?.id ?? null
  }

  function onGuestDragEnd() {
    dropTargetTableId.value = null
  }

  function onGuestDrop(sourceTableId: string, guestId: string, stagePoint: { x: number; y: number }) {
    const targetTable = findDropTargetTable(sourceTableId, stagePoint)
    dropTargetTableId.value = null

    if (!targetTable) return
    seatingStore.moveGuestBetweenTables(sourceTableId, targetTable.id, guestId)
  }

  return { dropTargetTableId, onGuestDrag, onGuestDragEnd, onGuestDrop }
}
