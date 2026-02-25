<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Layer as VLayer, Rect as VRect, Stage as VStage } from 'vue-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { Stage } from 'konva/lib/Stage'
import { useSeatingStore } from '@/stores/seating'
import { useThemeStore } from '@/stores/theme'
import { useStageSize } from '@/components/interactiveBoard/composables/useStageSize'
import { useZoom } from '@/components/interactiveBoard/composables/useZoom'
import { CANVAS_WORKSPACE_CONFIG } from '@/components/interactiveBoard/tableKonvaConfigs'
import BoardToolbar from '@/components/interactiveBoard/BoardToolbar.vue'
import BoardMobileMenu from '@/components/interactiveBoard/BoardMobileMenu.vue'
import TableNode from '@/components/interactiveBoard/TableNode.vue'
import TablePanel from '@/components/interactiveBoard/TablePanel.vue'
import { getThemeDefinition } from '@/themes'

const seatingStore = useSeatingStore()
const themeStore = useThemeStore()
const { t } = useI18n()

const containerRef = ref<HTMLDivElement | null>(null)
const stageRef = ref<{ getNode(): Stage } | null>(null)

const { stageConfig, isMobile } = useStageSize(containerRef)
const { onWheel, fitToStage, zoomToMin, isFitted } = useZoom(stageRef)


onMounted(async () => {
  await seatingStore.fetchTables()
  await nextTick()
  zoomToMin()
})

const boardTheme = computed(() => getThemeDefinition(themeStore.theme).board)

const selectedTableId = ref<string | null>(null)
const selectedTable = computed(
  () => seatingStore.tables.find((t) => t.id === selectedTableId.value) ?? null,
)

function onStageClick(e: KonvaEventObject<Event>) {
  if (e.target === e.target.getStage()) {
    selectedTableId.value = null
  }
}

async function exportPdf() {
  const { jsPDF } = await import('jspdf')
  const stage = stageRef.value?.getNode()
  if (!stage) return

  const pixelRatio = 2
  const sw = stage.width()
  const sh = stage.height()
  const stageDataUrl = stage.toDataURL({ pixelRatio })

  const canvas = document.createElement('canvas')
  canvas.width = sw * pixelRatio
  canvas.height = sh * pixelRatio
  const ctx = canvas.getContext('2d')!
  ctx.scale(pixelRatio, pixelRatio)

  // Background color
  ctx.fillStyle = boardTheme.value.canvasBackground
  ctx.fillRect(0, 0, sw, sh)

  // Dot grid pattern (matches board-container CSS)
  const dotSpacing = 28
  ctx.fillStyle = boardTheme.value.canvasDot
  for (let x = dotSpacing / 2; x < sw; x += dotSpacing) {
    for (let y = dotSpacing / 2; y < sh; y += dotSpacing) {
      ctx.beginPath()
      ctx.arc(x, y, 1, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Composite stage on top
  const img = new Image()
  img.onload = () => {
    ctx.drawImage(img, 0, 0, sw, sh)
    const dataUrl = canvas.toDataURL('image/png')
    const orientation = sw >= sh ? 'landscape' : 'portrait'
    const pdf = new jsPDF({ orientation, unit: 'px', format: [sw, sh] })
    pdf.addImage(dataUrl, 'PNG', 0, 0, sw, sh)
    pdf.save(t('seating.pdfFileName'))
  }
  img.src = stageDataUrl
}



const panelTransition = computed(() => (isMobile.value ? 'drawer' : 'panel'))
</script>

<template>
  <div ref="containerRef" class="board-container">
    <BoardToolbar :is-fitted="isFitted" @add-table="seatingStore.addTable()" @export-pdf="exportPdf" @fit-canvas="fitToStage()" />
    <BoardMobileMenu :is-fitted="isFitted" @add-table="seatingStore.addTable()" @export-pdf="exportPdf" @fit-canvas="fitToStage()" />

    <VStage ref="stageRef" :config="stageConfig" @wheel="onWheel" @click="onStageClick" @tap="onStageClick">
      <VLayer>
        <VRect :config="CANVAS_WORKSPACE_CONFIG" />
        <TableNode
          v-for="table in seatingStore.tables"
          :key="table.id"
          :table="table"
          :is-selected="table.id === selectedTableId"
          @select="(id) => (selectedTableId = id)"
          @dragend="(id, x, y) => seatingStore.updateTablePosition(id, x, y)"
          @rotate="(id, deg) => seatingStore.setTableRotation(id, deg)"
        />
      </VLayer>
    </VStage>

    <Transition :name="panelTransition">
      <TablePanel
        v-if="selectedTable"
        :table="selectedTable"
        @close="selectedTableId = null"
      />
    </Transition>
  </div>
</template>

<style scoped>
.board-container {
  position: relative;
  width: 100%;
  height: calc(100dvh - 20px);
  overflow: hidden;
  background-color: var(--board-bg);
  background-image: radial-gradient(circle, var(--board-dot) 1px, transparent 1px);
  background-size: 28px 28px;
  border-radius: 12px;
}

.board-hint {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  margin: 0;
  font-size: 11px;
  color: var(--board-hint);
  pointer-events: none;
  white-space: nowrap;
}

@media (max-width: 639px) {
  .board-hint {
    bottom: 68px;
  }
}

/* ── Desktop panel slide-in (from right) ──────────────────────────────────── */
.panel-enter-active,
.panel-leave-active {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.panel-enter-from,
.panel-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* ── Mobile drawer slide-up (from bottom) ─────────────────────────────────── */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.24s ease, opacity 0.24s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
