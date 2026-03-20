<script setup lang="ts">
import { computed, ref } from 'vue'
import { Circle as VCircle, Line as VLine, Text as VText } from 'vue-konva'
import type { SeatingGuest, SeatingTable } from '@/stores/seating'
import { useSeatingStore } from '@/stores/seating'
import type { KonvaThemePalette } from '../tableKonvaConfigs'
import {
  connectorConfig,
  guestNameConfig,
  seatBadgeCircleConfig,
  seatBadgeHighlightConfig,
  seatBadgeTextConfig,
  seatCircleConfig,
} from '../tableKonvaConfigs'

const props = defineProps<{
  table: SeatingTable
  guest: SeatingGuest
  index: number
  palette: KonvaThemePalette
  isDragging: boolean
}>()

const emit = defineEmits<{
  dragstart: [e: any, guestId: string, index: number]
  dragmove: [e: any, guestId: string]
  dragend: [e: any, guestId: string, index: number]
}>()

const seatingStore = useSeatingStore()
const isHovered = ref(false)

const extra = computed(() => seatingStore.getSeatAdditionalSeats(props.guest))

const connector = computed(() => connectorConfig(props.table, props.index, props.palette))

const seatCircle = computed(() => ({
  ...seatCircleConfig(props.table, props.index, props.palette, isHovered.value),
  draggable: true,
  listening: true,
  hitStrokeWidth: 14,
}))

const nameConfig = computed(() =>
  guestNameConfig(props.table, props.guest.name, props.index, props.palette, isHovered.value),
)

const badgeCircle = computed(() => seatBadgeCircleConfig(props.table, props.index, isHovered.value))
const badgeHighlight = computed(() => seatBadgeHighlightConfig(props.table, props.index))
const badgeText = computed(() => seatBadgeTextConfig(props.table, props.index, extra.value))
</script>

<template>
  <VLine v-if="!isDragging" :config="connector" />
  <VCircle
    :config="seatCircle"
    @dragstart="emit('dragstart', $event, guest.id, index)"
    @dragmove="emit('dragmove', $event, guest.id)"
    @dragend="emit('dragend', $event, guest.id, index)"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  />
  <VText v-if="!isDragging" :config="nameConfig" />
  <template v-if="!isDragging && extra > 0">
    <VCircle :config="badgeCircle" />
    <VCircle :config="badgeHighlight" />
    <VText :config="badgeText" />
  </template>
</template>
