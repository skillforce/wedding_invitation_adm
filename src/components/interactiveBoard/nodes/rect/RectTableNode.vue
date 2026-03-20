<script setup lang="ts">
import { computed } from 'vue'
import { Circle as VCircle, Rect as VRect, Text as VText } from 'vue-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { SeatingTable } from '@/stores/seating'
import type { KonvaThemePalette } from '../../tableKonvaConfigs'
import {
  overcrowdedIconConfig,
  overcrowdedLabelConfig,
  overcrowdedRectConfig,
  selectionRingRectConfig,
  tableRectConfig,
  newlywedsDotConfig,
  tableNameRectConfig,
} from '../../tableKonvaConfigs'
import SeatNodes from '../SeatNodes.vue'
import RectRotationHandle from './RectRotationHandle.vue'

const props = defineProps<{
  table: SeatingTable
  isSelected: boolean
  isDropTarget: boolean
  isOvercrowded: boolean
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

const selectionRing = computed(() =>
  selectionRingRectConfig(props.table, props.isSelected || props.isDropTarget, props.palette),
)

const tableBody = computed(() =>
  props.isOvercrowded
    ? overcrowdedRectConfig(props.table)
    : tableRectConfig(props.table, props.palette),
)

const overcrowdedIcon = computed(() => overcrowdedIconConfig(props.table))
const overcrowdedLabel = computed(() => overcrowdedLabelConfig(props.table))
const dot0 = computed(() => newlywedsDotConfig(0, props.palette))
const dot1 = computed(() => newlywedsDotConfig(1, props.palette))
const nameRect = computed(() => tableNameRectConfig(props.table, props.palette))

function onGuestDrag(id: string, pos: { x: number; y: number }) {
  emit('guestDrag', id, pos)
}

function onGuestDrop(id: string, pos: { x: number; y: number }) {
  emit('guestDrop', id, pos)
}

function onHandleMouseEnter(e: KonvaEventObject<MouseEvent>) {
  emit('handleMouseEnter', e)
}

function onHandleMouseLeave(e: KonvaEventObject<MouseEvent>) {
  emit('handleMouseLeave', e)
}

function onHandleDragStart(e: KonvaEventObject<DragEvent>) {
  emit('handleDragStart', e)
}

function onHandleDragMove(e: KonvaEventObject<DragEvent>) {
  emit('handleDragMove', e)
}

function onHandleDragEnd(e: KonvaEventObject<DragEvent>) {
  emit('handleDragEnd', e)
}

function onHandleClick(e: KonvaEventObject<MouseEvent>) {
  emit('handleClick', e)
}
</script>

<template>
  <VRect :config="selectionRing" />
  <VRect :config="tableBody" />
  <template v-if="isOvercrowded">
    <VText :config="overcrowdedIcon" />
    <VText :config="overcrowdedLabel" />
  </template>
  <template v-else>
    <VCircle :config="dot0" />
    <VCircle :config="dot1" />
    <VText :config="nameRect" />
  </template>

  <RectRotationHandle
    v-if="isSelected"
    :table="table"
    :palette="palette"
    @mouse-enter="onHandleMouseEnter"
    @mouse-leave="onHandleMouseLeave"
    @drag-start="onHandleDragStart"
    @drag-move="onHandleDragMove"
    @drag-end="onHandleDragEnd"
    @click="onHandleClick"
  />

  <SeatNodes
    :table="table"
    :palette="palette"
    @guest-drag="onGuestDrag"
    @guest-drag-end="emit('guestDragEnd')"
    @guest-drop="onGuestDrop"
  />
</template>
