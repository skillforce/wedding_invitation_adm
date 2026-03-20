<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Layer as VLayer, Stage as VStage } from 'vue-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { Stage } from 'konva/lib/Stage'
import { useConfirm } from 'primevue/useconfirm'
import ConfirmDialog from 'primevue/confirmdialog'
import { useSeatingStore } from '@/stores/seating'
import { useGuestsStore } from '@/stores/guests'
import { useStageSize } from '@/components/interactiveBoard/composables/useStageSize'
import { useZoom } from '@/components/interactiveBoard/composables/useZoom'
import { useGuestDrag } from '@/composables/useGuestDrag'
import BoardToolbar from '@/components/interactiveBoard/BoardToolbar.vue'
import BoardMobileMenu from '@/components/interactiveBoard/BoardMobileMenu.vue'
import TableNode from '@/components/interactiveBoard/TableNode.vue'
import TablePanel from '@/components/interactiveBoard/TablePanel.vue'
import WorkspaceNode from '@/components/interactiveBoard/WorkspaceNode.vue'
import WorkspaceSettings from '@/components/interactiveBoard/workspaceSettings/index.vue'

const { t } = useI18n()
const confirm = useConfirm()
const seatingStore = useSeatingStore()
const guestsStore = useGuestsStore()

const containerRef = ref<HTMLDivElement | null>(null)
const stageRef = ref<{ getNode(): Stage } | null>(null)

const { stageConfig, isMobile } = useStageSize(containerRef)
const { onWheel, fitToStage, isFitted } = useZoom(stageRef)
const { dropTargetTableId, onGuestDrag, onGuestDragEnd, onGuestDrop } = useGuestDrag(stageRef)

onMounted(async () => {
  await Promise.all([
    seatingStore.fetchTables(),
    guestsStore.guests.length ? Promise.resolve() : guestsStore.fetchGuests(),
  ])
  await nextTick()
  fitToStage()
})

const selectedTableId = ref<string | null>(null)
const workspaceSettingsOpen = ref(false)
const selectedTable = computed(
  () => seatingStore.tables.find((t) => t.id === selectedTableId.value) ?? null,
)

function onStageClick(e: KonvaEventObject<Event>) {
  if (e.target === e.target.getStage()) {
    selectedTableId.value = null
  }
}

const panelTransition = computed(() => (isMobile.value ? 'drawer' : 'panel'))

function onAddObject(shape: import('@/api/seating-arrangement').SeatingShape) {
  seatingStore.addObject(shape)
}

function openWorkspaceSettings() {
  workspaceSettingsOpen.value = true
}

function onAutoSeat() {
  confirm.require({
    header: t('seating.autoSeatConfirmHeader'),
    message: t('seating.autoSeatConfirmMessage'),
    acceptLabel: t('seating.autoSeatConfirmAccept'),
    rejectLabel: t('seating.autoSeatConfirmReject'),
    accept: () => seatingStore.autoSeat(),
  })
}

function onSelectTable(id: string) {
  selectedTableId.value = id
}

function onTableDragEnd(id: string, x: number, y: number) {
  seatingStore.updateTablePosition(id, x, y)
}

function onTableRotate(id: string, deg: number) {
  seatingStore.setTableRotation(id, deg)
}
</script>

<template>
  <div ref="containerRef" class="board-container">
    <ConfirmDialog :breakpoints="{'640px': '70vw'}" />
    <BoardToolbar
      :is-fitted="isFitted"
      :stage-ref="stageRef"
      @add-object="onAddObject"
      @open-workspace-settings="openWorkspaceSettings"
      @auto-seat="onAutoSeat"
      @fit-to-stage="fitToStage"
    />
    <BoardMobileMenu
      :is-fitted="isFitted"
      :stage-ref="stageRef"
      @add-object="onAddObject"
      @open-workspace-settings="openWorkspaceSettings"
      @auto-seat="onAutoSeat"
      @fit-to-stage="fitToStage"
    />

    <WorkspaceSettings
      :open="workspaceSettingsOpen"
      :is-mobile="isMobile"
      @close="workspaceSettingsOpen = false"
    />

    <VStage ref="stageRef" :config="stageConfig" @wheel="onWheel" @click="onStageClick" @tap="onStageClick">
      <VLayer>
        <WorkspaceNode :is-mobile="isMobile" />
        <TableNode
          v-for="table in seatingStore.tables"
          :key="table.id"
          :table="table"
          :is-selected="table.id === selectedTableId"
          :is-drop-target="table.id === dropTargetTableId"
          @select="onSelectTable"
          @dragend="onTableDragEnd"
          @rotate="onTableRotate"
          @guest-drag="onGuestDrag"
          @guest-drag-end="onGuestDragEnd"
          @guest-drop="onGuestDrop"
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
  height: 100%;
  overflow: hidden;
  background-color: var(--board-bg);
  background-image: radial-gradient(circle, var(--board-dot) 1px, transparent 1px);
  background-size: 28px 28px;
  border-radius: 12px;
  box-shadow: var(--shadow-card);
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
  :global(.authorized-content) {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    overflow-y: hidden;
    overscroll-behavior-y: none;
  }

  .board-container {
    min-height: 0;
  }


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
