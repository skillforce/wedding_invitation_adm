<script setup lang="ts">
import { ref } from 'vue'
import { Circle as VCircle, Line as VLine, Text as VText } from 'vue-konva'
import type { SeatingTable } from '@/stores/seating'
import type { KonvaThemePalette } from '../tableKonvaConfigs'
import { connectorConfig, guestNameConfig, seatCircleConfig } from '../tableKonvaConfigs'
import { useSeatDrag } from '../composables/useSeatDrag'

const props = defineProps<{
  table: SeatingTable
  palette: KonvaThemePalette
}>()

const emit = defineEmits<{
  guestDrag: [guestId: string, pointer: { x: number; y: number }]
  guestDragEnd: []
  guestDrop: [guestId: string, pointer: { x: number; y: number }]
}>()

const { draggingGuestId, onSeatDragStart, onSeatDragMove, onSeatDragEnd } = useSeatDrag(
  () => props.table,
  (id, pointer) => emit('guestDrag', id, pointer),
  (id, pointer) => emit('guestDrop', id, pointer),
  () => emit('guestDragEnd'),
)

const hoveredGuestId = ref<string | null>(null)

const isHovered = (guestId: string) => hoveredGuestId.value === guestId
</script>

<template>
  <template v-for="(guest, idx) in table.guests" :key="guest.id">
    <VLine
      v-if="draggingGuestId !== guest.id"
      :config="connectorConfig(table, idx, palette)"
    />
    <VCircle
      :config="{ ...seatCircleConfig(table, idx, palette, isHovered(guest.id)), draggable: true, listening: true, hitStrokeWidth: 14 }"
      @dragstart="onSeatDragStart($event, guest.id, idx)"
      @dragmove="onSeatDragMove($event, guest.id)"
      @dragend="onSeatDragEnd($event, guest.id, idx)"
      @mouseenter="hoveredGuestId = guest.id"
      @mouseleave="hoveredGuestId = null"
    />
    <VText
      v-if="draggingGuestId !== guest.id"
      :config="guestNameConfig(table, guest, idx, palette,isHovered(guest.id))"
    />
  </template>
</template>
