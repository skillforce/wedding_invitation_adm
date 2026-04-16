<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Layer as VLayer, Stage as VStage } from 'vue-konva'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { Stage } from 'konva/lib/Stage'
import { useConfirm } from 'primevue/useconfirm'
import ConfirmDialog from 'primevue/confirmdialog'
import { useSeatingStore } from '@/stores/seating'
import { useGuestsStore } from '@/stores/guests'
import UserSwitcher from '@/components/shared/UserSwitcher.vue'
import SelectUserPrompt from '@/components/shared/SelectUserPrompt.vue'
import { useSelectedUser } from '@/composables/useSelectedUser'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { useStageSize } from '@/components/interactiveBoard/composables/useStageSize'
import { useZoom } from '@/components/interactiveBoard/composables/useZoom'
import { useGuestDrag } from '@/composables/useGuestDrag'
import BoardToolbar from '@/components/interactiveBoard/BoardToolbar.vue'
import BoardMobileMenu from '@/components/interactiveBoard/BoardMobileMenu.vue'
import TableNode from '@/components/interactiveBoard/TableNode.vue'
import TablePanel from '@/components/interactiveBoard/TablePanel.vue'
import WorkspaceNode from '@/components/interactiveBoard/WorkspaceNode.vue'
import WorkspaceSettings from '@/components/interactiveBoard/workspaceSettings/index.vue'
import AutoSeatMagicOverlay from '@/components/interactiveBoard/AutoSeatMagicOverlay.vue'

const { t } = useI18n()
const confirm = useConfirm()
const seatingStore = useSeatingStore()
const guestsStore = useGuestsStore()

const containerRef = ref<HTMLDivElement | null>(null)
const stageRef = ref<{ getNode(): Stage } | null>(null)

const { stageConfig, isMobile } = useStageSize(containerRef)
const { onWheel, fitToStage, isFitted } = useZoom(stageRef)
const { dropTargetTableId, onGuestDrag, onGuestDragEnd, onGuestDrop } = useGuestDrag(stageRef)
const { selectedUserId } = useSelectedUser()
const { isSuperUser } = useCurrentUser()

const showPrompt = computed(() => isSuperUser.value && selectedUserId.value === null)

watch(selectedUserId, async (userId) => {
  if (isSuperUser.value && userId === null) return
  await Promise.all([
    seatingStore.fetchTables(userId ?? undefined),
    guestsStore.fetchGuests(userId ?? undefined),
  ])
})

onMounted(async () => {
  if (isSuperUser.value && selectedUserId.value === null) return
  const userId = selectedUserId.value ?? undefined
  await Promise.all([
    seatingStore.fetchTables(userId),
    guestsStore.fetchGuests(userId),
  ])
  await nextTick()
  fitToStage()
})

const autoSeatAnimating = ref(false)

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


function onAddObject(shape: import('@/api/seating-arrangement').SeatingShape) {
  seatingStore.addObject(shape)
}

function openWorkspaceSettings() {
  workspaceSettingsOpen.value = true
}

async function onHandleAutoSeat (){
    autoSeatAnimating.value = true
    const minDelay = new Promise((r) => setTimeout(r, 2500))
    await Promise.all([seatingStore.autoSeat(), minDelay])
    autoSeatAnimating.value = false
}

function onAutoSeat() {
  confirm.require({
    header: t('seating.autoSeatConfirmHeader'),
    message: t('seating.autoSeatConfirmMessage'),
    acceptLabel: t('seating.autoSeatConfirmAccept'),
    rejectLabel: t('seating.autoSeatConfirmReject'),
    accept: onHandleAutoSeat,
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
      v-if="!showPrompt"
      :is-fitted="isFitted"
      :stage-ref="stageRef"
      @add-object="onAddObject"
      @open-workspace-settings="openWorkspaceSettings"
      @auto-seat="onAutoSeat"
      @fit-to-stage="fitToStage"
    />
    <BoardMobileMenu
      v-if="!showPrompt"
      :is-fitted="isFitted"
      :stage-ref="stageRef"
      @add-object="onAddObject"
      @open-workspace-settings="openWorkspaceSettings"
      @auto-seat="onAutoSeat"
      @fit-to-stage="fitToStage"
    />

    <div class="board-user-switcher">
      <UserSwitcher v-model="selectedUserId" />
    </div>

    <SelectUserPrompt v-if="showPrompt" class="board-prompt" />
    <template v-else>
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

      <TablePanel
        :table="selectedTable"
        :is-mobile="isMobile"
        @close="selectedTableId = null"
      />

      <AutoSeatMagicOverlay :visible="autoSeatAnimating" />
    </template>
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

.board-user-switcher {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  background: var(--color-surface);
  border-radius: 8px;
  padding: 0.4rem 0.75rem;
  box-shadow: var(--shadow-card);
}

.board-prompt {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 639px) {
  .board-container {
    min-height: 0;
  }
}

</style>
