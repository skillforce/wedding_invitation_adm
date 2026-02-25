<script setup lang="ts">
import { ref, computed } from 'vue'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { Stage } from 'konva/lib/Stage'
import type { SeatingTable } from '@/stores/seating'
import { useThemeStore } from '@/stores/theme'
import {
  getKonvaThemePalette,
  tableGroupConfig,
  tableDragBoundFunc,
  selectionRingConfig,
  selectionRingRectConfig,
  tableCircleConfig,
  tableRectConfig,
  newlywedsDotConfig,
  tableNameConfig,
  tableNameRectConfig,
  connectorConfig,
  seatCircleConfig,
  guestNameConfig,
  rotationHandleConfig,
  rotationHandleLineConfig,
  ROTATION_SNAP,
} from './tableKonvaConfigs'

const props = defineProps<{
  table: SeatingTable
  isSelected: boolean
}>()

const emit = defineEmits<{
  select: [tableId: string]
  dragend: [tableId: string, x: number, y: number]
  rotate: [tableId: string, degrees: number]
}>()
const themeStore = useThemeStore()
const konvaTheme = computed(() => getKonvaThemePalette(themeStore.theme))

// ── State ─────────────────────────────────────────────────────────────────────
const isRotating = ref(false)
const stageRef = ref<Stage | null>(null)

// Disable group dragging while the rotation handle is active, so the two
// gestures can never interfere with each other.
const groupConfig = computed(() => ({
  ...tableGroupConfig(props.table),
  draggable: !isRotating.value,
  dragBoundFunc: (pos: { x: number; y: number }) => {
    const stage = stageRef.value
    if (!stage) return pos
    return tableDragBoundFunc(pos, stage as Stage)
  },
}))

// ── Group drag / cursor ───────────────────────────────────────────────────────
function onMouseEnter(e: KonvaEventObject<MouseEvent>) {
  e.target.getStage()!.container().style.cursor = 'grab'
}

function onMouseLeave(e: KonvaEventObject<MouseEvent>) {
  e.target.getStage()!.container().style.cursor = 'default'
}

function onDragStart(e: KonvaEventObject<MouseEvent>) {
  stageRef.value = e.target.getStage() as Stage
  e.target.getStage()!.container().style.cursor = 'grabbing'
}

function onDragEnd(e: KonvaEventObject<MouseEvent>) {
  e.target.getStage()!.container().style.cursor = 'grab'
  emit('dragend', props.table.id, e.target.x(), e.target.y())
}

// ── Rotation handle ───────────────────────────────────────────────────────────
function onHandleMouseEnter(e: KonvaEventObject<MouseEvent>) {
  e.cancelBubble = true
  e.target.getStage()!.container().style.cursor = 'crosshair'
}

function onHandleMouseLeave(e: KonvaEventObject<MouseEvent>) {
  e.cancelBubble = true
  e.target.getStage()!.container().style.cursor = 'default'
}

// rAF throttle: store the latest computed rotation and flush once per frame.
// This caps store updates + Vue re-renders to 60 fps regardless of pointer speed.
let rafId: number | null = null
let pendingRotation: number | null = null

function snapRotation(deg: number) {
  return Math.round(deg / ROTATION_SNAP) * ROTATION_SNAP
}

function onHandleDragStart(e: KonvaEventObject<DragEvent>) {
  e.cancelBubble = true
  isRotating.value = true
}

function onHandleDragEnd(e: KonvaEventObject<DragEvent>) {
  e.cancelBubble = true
  isRotating.value = false
  // Flush any pending rAF so the final angle is always committed
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (pendingRotation !== null) {
    emit('rotate', props.table.id, snapRotation(pendingRotation))
    pendingRotation = null
  }
}

function onHandleDragMove(e: KonvaEventObject<DragEvent>) {
  e.cancelBubble = true
  const handle = e.target
  const group = handle.getParent()!
  const absHandle = handle.getAbsolutePosition()
  const absGroup = group.getAbsolutePosition()

  const angleDeg = Math.atan2(absHandle.y - absGroup.y, absHandle.x - absGroup.x) * (180 / Math.PI)
  pendingRotation = (angleDeg + 90 + 360) % 360

  if (rafId === null) {
    rafId = requestAnimationFrame(() => {
      if (pendingRotation !== null) {
        emit('rotate', props.table.id, snapRotation(pendingRotation))
      }
      rafId = null
      pendingRotation = null
    })
  }
}

function onHandleClick(e: KonvaEventObject<MouseEvent>) {
  // Prevent click from bubbling to the group (which would trigger select)
  e.cancelBubble = true
}
</script>

<template>
  <v-group
    :config="groupConfig"
    @click="() => emit('select', table.id)"
    @tap="() => emit('select', table.id)"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <!-- ── Rect (newlyweds) table ── -->
    <template v-if="table.shape === 'rect'">
      <v-rect :config="selectionRingRectConfig(table, isSelected, konvaTheme)" />
      <v-rect :config="tableRectConfig(table, konvaTheme)" />
      <v-circle :config="newlywedsDotConfig(0, konvaTheme)" />
      <v-circle :config="newlywedsDotConfig(1, konvaTheme)" />
      <v-text :config="tableNameRectConfig(table, konvaTheme)" />

      <!-- Rotation handle — only when selected -->
      <template v-if="isSelected">
        <v-line :config="rotationHandleLineConfig(table, konvaTheme)" />
        <v-circle
          :config="rotationHandleConfig(table, konvaTheme)"
          @mouseenter="onHandleMouseEnter"
          @mouseleave="onHandleMouseLeave"
          @dragstart="onHandleDragStart"
          @dragmove="onHandleDragMove"
          @dragend="onHandleDragEnd"
          @click="onHandleClick"
          @tap="onHandleClick"
        />
      </template>
    </template>

    <!-- ── Circle table (default) ── -->
    <template v-else>
      <v-circle :config="selectionRingConfig(table, isSelected, konvaTheme)" />
      <v-circle :config="tableCircleConfig(table, konvaTheme)" />
      <v-text :config="tableNameConfig(table, konvaTheme)" />
    </template>

    <!-- ── Seats (shared for both shapes) ── -->
    <template v-for="(guest, idx) in table.guests" :key="guest.id">
      <v-line :config="connectorConfig(table, idx, konvaTheme)" />
      <v-circle :config="seatCircleConfig(table, idx, konvaTheme)" />
      <v-text :config="guestNameConfig(table, guest, idx, konvaTheme)" />
    </template>
  </v-group>
</template>
