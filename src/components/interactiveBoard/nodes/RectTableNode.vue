<script setup lang="ts">
import { Circle as VCircle, Line as VLine, Rect as VRect, Text as VText } from 'vue-konva'
import type { SeatingTable } from '@/stores/seating'
import type { KonvaThemePalette } from '../tableKonvaConfigs'
import {
  selectionRingRectConfig,
  tableRectConfig,
  newlywedsDotConfig,
  tableNameRectConfig,
  rotationHandleConfig,
  rotationHandleLineConfig,
} from '../tableKonvaConfigs'
import SeatNodes from './SeatNodes.vue'
import type { KonvaEventObject } from "konva/lib/Node";

defineProps<{
  table: SeatingTable
  isSelected: boolean
  isDropTarget: boolean
  palette: KonvaThemePalette
}>()

const emit = defineEmits<{
  handleMouseEnter: [e: KonvaEventObject<MouseEvent>]
  handleMouseLeave: [e: KonvaEventObject<MouseEvent>]
  handleDragStart: [e: KonvaEventObject<DragEvent>]
  handleDragMove: [e: KonvaEventObject<DragEvent>]
  handleDragEnd: [e: KonvaEventObject<DragEvent>]
  handleClick: [e: KonvaEventObject<MouseEvent>]
  guestDrag: [guestId: string, pointer: { x: number; y: number }]
  guestDragEnd: []
  guestDrop: [guestId: string, pointer: { x: number; y: number }]
}>()

function onGuestDrag(id: string, pos: { x: number; y: number }) {
  emit('guestDrag', id, pos)
}

function onGuestDrop(id: string, pos: { x: number; y: number }) {
  emit('guestDrop', id, pos)
}
</script>

<template>
  <VRect :config="selectionRingRectConfig(table, isSelected || isDropTarget, palette)" />
  <VRect :config="tableRectConfig(table, palette)" />
  <VCircle :config="newlywedsDotConfig(0, palette)" />
  <VCircle :config="newlywedsDotConfig(1, palette)" />
  <VText :config="tableNameRectConfig(table, palette)" />

  <template v-if="isSelected">
    <VLine :config="rotationHandleLineConfig(table, palette)" />
    <VCircle
      :config="rotationHandleConfig(table, palette)"
      @mouseenter="(e) => emit('handleMouseEnter', e)"
      @mouseleave="(e) => emit('handleMouseLeave', e)"
      @dragstart="(e) => emit('handleDragStart', e)"
      @dragmove="(e) => emit('handleDragMove', e)"
      @dragend="(e) => emit('handleDragEnd', e)"
      @click="(e) => emit('handleClick', e)"
      @tap="(e) => emit('handleClick', e)"
    />
  </template>

  <SeatNodes
    :table="table"
    :palette="palette"
    @guest-drag="onGuestDrag"
    @guest-drag-end="emit('guestDragEnd')"
    @guest-drop="onGuestDrop"
  />
</template>
