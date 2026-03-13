<script setup lang="ts">
import { Circle as VCircle, Text as VText } from 'vue-konva'
import type { SeatingTable } from '@/stores/seating'
import type { KonvaThemePalette } from '../tableKonvaConfigs'
import {
  overcrowdedCircleConfig,
  overcrowdedIconConfig,
  overcrowdedLabelConfig,
  selectionRingConfig,
  tableCircleConfig,
  tableNameConfig,
} from '../tableKonvaConfigs'
import SeatNodes from './SeatNodes.vue'

defineProps<{
  table: SeatingTable
  isSelected: boolean
  isDropTarget: boolean
  isOvercrowded: boolean
  palette: KonvaThemePalette
}>()

const emit = defineEmits<{
  guestDrag: [guestId: string, pointer: { x: number; y: number }]
  guestDragEnd: []
  guestDrop: [guestId: string, pointer: { x: number; y: number }]
}>()

function onGuestDrag(guestId: string, pointer: { x: number; y: number }) {
  emit('guestDrag', guestId, pointer)
}

function onGuestDragEnd() {
  emit('guestDragEnd')
}

function onGuestDrop(guestId: string, pointer: { x: number; y: number }) {
  emit('guestDrop', guestId, pointer)
}
</script>

<template>
  <VCircle :config="selectionRingConfig(table, isSelected || isDropTarget, palette)" />
  <VCircle :config="isOvercrowded ? overcrowdedCircleConfig(table) : tableCircleConfig(table, palette)" />
  <VText :config="isOvercrowded ? overcrowdedIconConfig(table) : tableNameConfig(table, palette)" />
  <VText v-if="isOvercrowded" :config="overcrowdedLabelConfig(table)" />
  <SeatNodes
    :table="table"
    :palette="palette"
    @guest-drag="onGuestDrag"
    @guest-drag-end="onGuestDragEnd"
    @guest-drop="onGuestDrop"
  />
</template>
