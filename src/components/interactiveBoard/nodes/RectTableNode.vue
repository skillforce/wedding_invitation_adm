<script setup lang="ts">
import { Circle as VCircle, Line as VLine, Rect as VRect, Text as VText } from 'vue-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
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

defineProps<{
  table: SeatingTable
  isSelected: boolean
  palette: KonvaThemePalette
}>()

const emit = defineEmits<{
  handleMouseEnter: [e: KonvaEventObject<MouseEvent>]
  handleMouseLeave: [e: KonvaEventObject<MouseEvent>]
  handleDragStart: [e: KonvaEventObject<DragEvent>]
  handleDragMove: [e: KonvaEventObject<DragEvent>]
  handleDragEnd: [e: KonvaEventObject<DragEvent>]
  handleClick: [e: KonvaEventObject<MouseEvent>]
}>()
</script>

<template>
  <VRect :config="selectionRingRectConfig(table, isSelected, palette)" />
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

  <SeatNodes :table="table" :palette="palette" />
</template>
