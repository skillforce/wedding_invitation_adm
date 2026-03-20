<script setup lang="ts">
import type { SeatingTable } from '@/stores/seating'
import type { KonvaThemePalette } from '../tableKonvaConfigs'
import { useSeatDrag } from '../composables/useSeatDrag'
import SeatNode from './SeatNode.vue'

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
</script>

<template>
  <SeatNode
    v-for="(guest, idx) in table.guests"
    :key="guest.id"
    :table="table"
    :guest="guest"
    :index="idx"
    :palette="palette"
    :is-dragging="draggingGuestId === guest.id"
    @dragstart="onSeatDragStart"
    @dragmove="onSeatDragMove"
    @dragend="onSeatDragEnd"
  />
</template>
