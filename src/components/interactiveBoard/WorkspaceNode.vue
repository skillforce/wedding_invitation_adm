<script setup lang="ts">
import { computed } from 'vue'
import { Rect as VRect, Ellipse as VEllipse, Circle as VCircle } from 'vue-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import { usePreferencesStore } from '@/stores/preferences'
import { getKonvaThemePalette } from './tableKonvaConfigs'
import { useWorkspace } from '@/composables/useWorkspace'

const props = defineProps<{ isMobile: boolean }>()

const themeStore = usePreferencesStore()
const palette = computed(() => getKonvaThemePalette(themeStore.theme))

const {
  workspaceShape,
  workspaceWidth,
  workspaceHeight,
  MIN_WIDTH,
  MAX_WIDTH,
  MIN_HEIGHT,
  MAX_HEIGHT,
  resizeWorkspace,
} = useWorkspace()

const HANDLE_RADIUS = 14

const rectConfig = computed(() => ({
  x: 0,
  y: 0,
  width: workspaceWidth.value,
  height: workspaceHeight.value,
  stroke: palette.value.canvasBorder,
  strokeWidth: 8,
  fill: 'transparent',
  listening: false,
}))

const ellipseConfig = computed(() => ({
  x: workspaceWidth.value / 2,
  y: workspaceHeight.value / 2,
  radiusX: workspaceWidth.value / 2,
  radiusY: workspaceHeight.value / 2,
  stroke: palette.value.canvasBorder,
  strokeWidth: 8,
  fill: 'transparent',
  listening: false,
}))

function makeBoundFunc(fixX: number | null, fixY: number | null) {
  return function (this: any, pos: { x: number; y: number }) {
    const stage = this.getStage()
    if (!stage) return pos
    const scale = stage.scaleX()
    const sp = stage.position()
    const cx = (pos.x - sp.x) / scale
    const cy = (pos.y - sp.y) / scale
    const clampedX = fixX !== null ? fixX : Math.max(MIN_WIDTH.value, Math.min(MAX_WIDTH.value, cx))
    const clampedY = fixY !== null ? fixY : Math.max(MIN_HEIGHT.value, Math.min(MAX_HEIGHT.value, cy))
    return { x: clampedX * scale + sp.x, y: clampedY * scale + sp.y }
  }
}

const brDragBound = makeBoundFunc(null, null)

const handleBase = computed(() => ({
  radius: HANDLE_RADIUS,
  fill: palette.value.canvasBorder,
  stroke: palette.value.selectionStroke,
  strokeWidth: 2,
  opacity: 0.9,
}))

const tlConfig = computed(() => ({ ...handleBase.value, x: 0, y: 0, listening: false }))

const brConfig = computed(() => ({
  ...handleBase.value,
  x: workspaceWidth.value,
  y: workspaceHeight.value,
  draggable: !props.isMobile,
  listening: !props.isMobile,
  dragBoundFunc: brDragBound,
}))

function onBrDragMove(e: KonvaEventObject<DragEvent>) {
  resizeWorkspace(Math.round(e.target.x()), Math.round(e.target.y()))
}

function setCursor(e: KonvaEventObject<MouseEvent>, cursor: string) {
  e.target.getStage()!.container().style.cursor = cursor
}

function onHandleMouseEnter(e: KonvaEventObject<MouseEvent>) {
  setCursor(e, 'nwse-resize')
}

function onHandleMouseLeave(e: KonvaEventObject<MouseEvent>) {
  setCursor(e, 'default')
}
</script>

<template>
  <VRect v-if="workspaceShape === 'rect'" :config="rectConfig" />
  <VEllipse v-else :config="ellipseConfig" />

  <template v-if="!isMobile">
    <VCircle :config="tlConfig" />

    <VCircle
      :config="brConfig"
      @dragmove="onBrDragMove"
      @mouseenter="onHandleMouseEnter"
      @mouseleave="onHandleMouseLeave"
    />
  </template>
</template>
