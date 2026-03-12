<script setup lang="ts">
import { Circle as VCircle, Line as VLine } from 'vue-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { SeatingTable } from '@/stores/seating'
import type { KonvaThemePalette } from '../../tableKonvaConfigs'
import { rotationHandleConfig, rotationHandleLineConfig } from '../../tableKonvaConfigs'

defineProps<{
  table: SeatingTable
  palette: KonvaThemePalette
}>()

const emit = defineEmits<{
  mouseEnter: [e: KonvaEventObject<MouseEvent>]
  mouseLeave: [e: KonvaEventObject<MouseEvent>]
  dragStart: [e: KonvaEventObject<DragEvent>]
  dragMove: [e: KonvaEventObject<DragEvent>]
  dragEnd: [e: KonvaEventObject<DragEvent>]
  click: [e: KonvaEventObject<MouseEvent>]
}>()

function onMouseEnter(e: KonvaEventObject<MouseEvent>) {
  emit('mouseEnter', e)
}

function onMouseLeave(e: KonvaEventObject<MouseEvent>) {
  emit('mouseLeave', e)
}

function onDragStart(e: KonvaEventObject<DragEvent>) {
  emit('dragStart', e)
}

function onDragMove(e: KonvaEventObject<DragEvent>) {
  emit('dragMove', e)
}

function onDragEnd(e: KonvaEventObject<DragEvent>) {
  emit('dragEnd', e)
}

function onClick(e: KonvaEventObject<MouseEvent>) {
  emit('click', e)
}
</script>

<template>
  <VLine :config="rotationHandleLineConfig(table, palette)" />
  <VCircle
    :config="rotationHandleConfig(table, palette)"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @dragstart="onDragStart"
    @dragmove="onDragMove"
    @dragend="onDragEnd"
    @click="onClick"
    @tap="onClick"
  />
</template>
