<script setup lang="ts">
import { Circle as VCircle, Text as VText } from 'vue-konva'
import type { SeatingTable } from '@/stores/seating'
import type { KonvaThemePalette } from '../tableKonvaConfigs'
import {
  selectionRingConfig,
  tableCircleConfig,
  tableNameConfig,
} from '../tableKonvaConfigs'
import SeatNodes from './SeatNodes.vue'

defineProps<{
  table: SeatingTable
  isSelected: boolean
  palette: KonvaThemePalette
}>()
</script>

<template>
  <VCircle :config="selectionRingConfig(table, isSelected, palette)" />
  <VCircle :config="tableCircleConfig(table, palette)" />
  <VText :config="tableNameConfig(table, palette)" />
  <SeatNodes :table="table" :palette="palette" />
</template>
