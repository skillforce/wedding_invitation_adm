<script setup lang="ts">
import { computed } from 'vue'
import { Group as VGroup } from 'vue-konva'
import type { SeatingTable } from '@/stores/seating'
import { usePreferencesStore } from '@/stores/preferences'
import { getKonvaThemePalette } from './tableKonvaConfigs'
import { useTableRotation } from './composables/useTableRotation'
import { useTableDrag } from './composables/useTableDrag'
import CircleTableNode from './nodes/CircleTableNode.vue'
import RectTableNode from './nodes/rect/RectTableNode.vue'
import PillarNode from './nodes/PillarNode.vue'

const props = defineProps<{
  table: SeatingTable
  isSelected: boolean
  isDropTarget: boolean
}>()

const emit = defineEmits<{
  select: [tableId: string]
  dragend: [tableId: string, x: number, y: number]
  rotate: [tableId: string, degrees: number]
  guestDrag: [sourceTableId: string, guestId: string, pointer: { x: number; y: number }]
  guestDragEnd: []
  guestDrop: [sourceTableId: string, guestId: string, pointer: { x: number; y: number }]
}>()

const themeStore = usePreferencesStore()
const konvaTheme = computed(() => getKonvaThemePalette(themeStore.theme))

const { isRotating, onHandleMouseEnter, onHandleMouseLeave, onHandleDragStart, onHandleDragMove, onHandleDragEnd, onHandleClick } =
  useTableRotation(
    () => props.table.id,
    (id, deg) => emit('rotate', id, deg),
  )

const { groupConfig, onMouseEnter, onMouseLeave, onDragStart, onDragEnd } =
  useTableDrag(
    () => props.table,
    isRotating,
    (id, x, y) => emit('dragend', id, x, y),
  )

function onGuestDrop(guestId: string, pointer: { x: number; y: number }) {
  emit('guestDrop', props.table.id, guestId, pointer)
}

function onGuestDrag(guestId: string, pointer: { x: number; y: number }) {
  emit('guestDrag', props.table.id, guestId, pointer)
}

function onGuestDragEnd() {
  emit('guestDragEnd')
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
      :is-drop-target="isDropTarget"
      :palette="konvaTheme"
      @handle-mouse-enter="onHandleMouseEnter"
      @handle-mouse-leave="onHandleMouseLeave"
      @handle-drag-start="onHandleDragStart"
      @handle-drag-move="onHandleDragMove"
      @handle-drag-end="onHandleDragEnd"
      @handle-click="onHandleClick"
      @guest-drag="onGuestDrag"
      @guest-drag-end="onGuestDragEnd"
      @guest-drop="onGuestDrop"
    />
    <CircleTableNode
      v-else
      :table="table"
      :is-selected="isSelected"
      :is-drop-target="isDropTarget"
      :palette="konvaTheme"
      @guest-drag="onGuestDrag"
      @guest-drag-end="onGuestDragEnd"
      @guest-drop="onGuestDrop"
    />
  </VGroup>
</template>
