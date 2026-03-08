<script setup lang="ts">
import { Line as VLine, Rect as VRect, Text as VText } from 'vue-konva'
import type { SeatingTable } from '@/stores/seating'
import type { KonvaThemePalette } from '../tableKonvaConfigs'
import {
  pillarSelectionRingConfig,
  pillarSquareConfig,
  pillarRibConfigs,
  pillarNameConfig,
} from '../tableKonvaConfigs'

defineProps<{
  table: SeatingTable
  isSelected: boolean
  palette: KonvaThemePalette
}>()
</script>

<template>
  <VRect :config="pillarSelectionRingConfig(table, isSelected, palette)" />
  <VRect :config="pillarSquareConfig(table, palette)" />
  <VLine v-for="(rib, i) in pillarRibConfigs(table, palette)" :key="`rib-${i}`" :config="rib" />
  <VText :config="pillarNameConfig(table)" />
</template>
