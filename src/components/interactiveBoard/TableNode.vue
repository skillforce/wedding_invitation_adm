<script setup lang="ts">
import { ref, computed } from 'vue'
import { Group as VGroup } from 'vue-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { Stage } from 'konva/lib/Stage'
import type { SeatingTable } from '@/stores/seating'
import { useThemeStore } from '@/stores/theme'
import { getKonvaThemePalette, tableGroupConfig, tableDragBoundFunc, ROTATION_SNAP } from './tableKonvaConfigs'
import CircleTableNode from './nodes/CircleTableNode.vue'
import RectTableNode from './nodes/RectTableNode.vue'
import PillarNode from './nodes/PillarNode.vue'

const props = defineProps<{
  table: SeatingTable
  isSelected: boolean
}>()

const emit = defineEmits<{
  select: [tableId: string]
  dragend: [tableId: string, x: number, y: number]
  rotate: [tableId: string, degrees: number]
}>()

const themeStore = useThemeStore()
const konvaTheme = computed(() => getKonvaThemePalette(themeStore.theme))

const isRotating = ref(false)
const stageRef = ref<Stage | null>(null)
const handleStartPos = ref<{ x: number; y: number } | null>(null)

const groupConfig = computed(() => ({
  ...tableGroupConfig(props.table),
  draggable: !isRotating.value,
  dragBoundFunc: (pos: { x: number; y: number }) => {
    const stage = stageRef.value
    if (!stage) return pos
    return tableDragBoundFunc(pos, stage as Stage)
  },
}))

// ── Group drag / cursor ───────────────────────────────────────────────────────
function onMouseEnter(e: KonvaEventObject<MouseEvent>) {
  e.target.getStage()!.container().style.cursor = 'grab'
}

function onMouseLeave(e: KonvaEventObject<MouseEvent>) {
  e.target.getStage()!.container().style.cursor = 'default'
}

function onDragStart(e: KonvaEventObject<MouseEvent>) {
  stageRef.value = e.target.getStage() as Stage
  e.target.getStage()!.container().style.cursor = 'grabbing'
}

function onDragEnd(e: KonvaEventObject<MouseEvent>) {
  e.target.getStage()!.container().style.cursor = 'grab'
  emit('dragend', props.table.id, e.target.x(), e.target.y())
}

// ── Rotation handle (forwarded from RectTableNode) ────────────────────────────
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
    emit('rotate', props.table.id, snapRotation(pendingRotation))
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
        emit('rotate', props.table.id, snapRotation(pendingRotation))
      }
      rafId = null
      pendingRotation = null
    })
  }
}

function onHandleClick(e: KonvaEventObject<MouseEvent>) {
  e.cancelBubble = true
}
</script>

<template>
  <VGroup
    :config="groupConfig"
    @click="() => emit('select', table.id)"
    @tap="() => emit('select', table.id)"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <PillarNode
      v-if="table.shape === 'pillar'"
      :table="table"
      :is-selected="isSelected"
      :palette="konvaTheme"
    />
    <RectTableNode
      v-else-if="table.shape === 'rect'"
      :table="table"
      :is-selected="isSelected"
      :palette="konvaTheme"
      @handle-mouse-enter="onHandleMouseEnter"
      @handle-mouse-leave="onHandleMouseLeave"
      @handle-drag-start="onHandleDragStart"
      @handle-drag-move="onHandleDragMove"
      @handle-drag-end="onHandleDragEnd"
      @handle-click="onHandleClick"
    />
    <CircleTableNode
      v-else
      :table="table"
      :is-selected="isSelected"
      :palette="konvaTheme"
    />
  </VGroup>
</template>
