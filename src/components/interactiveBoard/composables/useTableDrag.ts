import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { Stage } from 'konva/lib/Stage'
import type { SeatingTable } from '@/stores/seating'
import { tableGroupConfig, tableDragBoundFunc } from '../tableKonvaConfigs'

export function useTableDrag(
  table: () => SeatingTable,
  isRotating: Ref<boolean>,
  onDragEnd: (id: string, x: number, y: number) => void,
) {
  let cachedStage: Stage | null = null

  function dragBoundFunc(pos: { x: number; y: number }) {
    if (!cachedStage) return pos
    return tableDragBoundFunc(pos, cachedStage)
  }

  const groupConfig = computed(() => ({
    ...tableGroupConfig(table()),
    draggable: !isRotating.value,
    dragBoundFunc,
  }))

  function onMouseEnter(e: KonvaEventObject<MouseEvent>) {
    e.target.getStage()!.container().style.cursor = 'grab'
  }

  function onMouseLeave(e: KonvaEventObject<MouseEvent>) {
    e.target.getStage()!.container().style.cursor = 'default'
  }

  function onDragStart(e: KonvaEventObject<MouseEvent>) {
    cachedStage = e.target.getStage() as Stage
    e.target.getStage()!.container().style.cursor = 'grabbing'
  }

  function onDragEndHandler(e: KonvaEventObject<MouseEvent>) {
    e.target.getStage()!.container().style.cursor = 'grab'
    onDragEnd(table().id, e.target.x(), e.target.y())
  }

  return { groupConfig, onMouseEnter, onMouseLeave, onDragStart, onDragEnd: onDragEndHandler }
}
