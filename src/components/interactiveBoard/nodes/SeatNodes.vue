<script setup lang="ts">
import { Circle as VCircle, Line as VLine, Text as VText } from 'vue-konva'
import type { SeatingTable } from '@/stores/seating'
import type { KonvaThemePalette } from '../tableKonvaConfigs'
import { connectorConfig, seatCircleConfig, guestNameConfig } from '../tableKonvaConfigs'

defineProps<{
  table: SeatingTable
  palette: KonvaThemePalette
}>()
</script>

<template>
  <template v-for="(guest, idx) in table.guests" :key="guest.id">
    <VLine :config="connectorConfig(table, idx, palette)" />
    <VCircle :config="seatCircleConfig(table, idx, palette)" />
    <VText :config="guestNameConfig(table, guest, idx, palette)" />
  </template>
</template>
