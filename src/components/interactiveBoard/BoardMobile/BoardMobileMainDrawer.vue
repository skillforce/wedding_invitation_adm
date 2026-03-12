<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Stage } from 'konva/lib/Stage'
import BottomDrawer from '@/components/shared/BottomDrawer.vue'
import { useExportData } from '../composables/useExportData'
import ExportPdf from '../ExportPdf.vue'

defineProps<{
  open: boolean
  isFitted: boolean
  stageRef: { getNode(): Stage } | null
}>()

const emit = defineEmits<{
  close: []
  openObjectDrawer: []
  openSettingsDrawer: []
}>()

const { t } = useI18n()
const { exportData: exportDataBase } = useExportData()

type DrawerAction = {
  key: string
  icon: string
  labelKey: string
  onClick: () => void
}

const drawerActions = computed<DrawerAction[]>(() => [
  {
    key: 'add-object',
    icon: 'pi pi-plus',
    labelKey: 'seating.addObject',
    onClick: () => emit('openObjectDrawer'),
  },
  {
    key: 'workspace-settings',
    icon: 'pi pi-sliders-h',
    labelKey: 'seating.workspaceSettings',
    onClick: () => {
      emit('openSettingsDrawer')
      emit('close')
    },
  },
  {
    key: 'export-data',
    icon: 'pi pi-download',
    labelKey: 'seating.exportData',
    onClick: exportData,
  },
])

function exportData() {
  exportDataBase()
  emit('close')
}
</script>

<template>
  <BottomDrawer :open="open" @close="emit('close')">
    <nav class="drawer-nav">
      <button
        v-for="action in drawerActions"
        :key="action.key"
        class="action-btn"
        @click="action.onClick"
      >
        <i :class="action.icon" />
        <span>{{ t(action.labelKey) }}</span>
      </button>
      <ExportPdf :stage-ref="stageRef" v-slot="{ onClick }">
        <button class="action-btn" @click="() => { onClick(); emit('close') }">
          <i class="pi pi-file-pdf" />
          <span>{{ t('seating.savePdf') }}</span>
        </button>
      </ExportPdf>
    </nav>
  </BottomDrawer>
</template>

<style scoped>
.drawer-nav {
  display: grid;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.action-btn:hover:not(:disabled) {
  background: var(--color-hover);
}

.action-btn:disabled {
  opacity: 0.45;
  cursor: default;
}

.action-btn .pi {
  font-size: 1rem;
  flex-shrink: 0;
}
</style>
