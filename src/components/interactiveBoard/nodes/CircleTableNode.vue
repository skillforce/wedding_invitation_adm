<script setup lang="ts">
import { computed } from 'vue'
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

const props = defineProps<{
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

const selectionRing = computed(() =>
  selectionRingConfig(props.table, props.isSelected || props.isDropTarget, props.palette),
)

const tableBody = computed(() =>
  props.isOvercrowded
    ? overcrowdedCircleConfig(props.table)
    : tableCircleConfig(props.table, props.palette),
)

const tableText = computed(() =>
  props.isOvercrowded
    ? overcrowdedIconConfig(props.table)
    : tableNameConfig(props.table, props.palette),
)

const overcrowdedLabel = computed(() => overcrowdedLabelConfig(props.table))

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
  <VCircle :config="selectionRing" />
  <VCircle :config="tableBody" />
  <VText :config="tableText" />
  <VText v-if="isOvercrowded" :config="overcrowdedLabel" />
  <SeatNodes
    :table="table"
    :palette="palette"
    @guest-drag="onGuestDrag"
    @guest-drag-end="onGuestDragEnd"
    @guest-drop="onGuestDrop"
  />
</template>
