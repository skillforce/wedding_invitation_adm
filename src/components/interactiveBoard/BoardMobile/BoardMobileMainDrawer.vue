<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Stage } from 'konva/lib/Stage'
import BottomDrawer from '@/components/shared/BottomDrawer.vue'
import { useExportData } from '../composables/useExportData'
import ExportPdf from '../ExportPdf.vue'

const props = defineProps<{
  open: boolean
  isFitted: boolean
  stageRef: { getNode(): Stage } | null
}>()

const emit = defineEmits<{
  close: []
  openObjectDrawer: []
  openSettingsDrawer: []
  autoSeat: []
}>()

const { t } = useI18n()
const { exportData: exportDataBase } = useExportData()

type DrawerAction = {
  key: string
  icon: string
  labelKey: string
  special?: boolean
  primary?: boolean
  disabled?: boolean
  onClick: () => void
}

const drawerActions = computed<DrawerAction[]>(() => [
  {
    key: 'add-object',
    icon: 'pi pi-plus',
    labelKey: 'seating.addObject',
    primary: true,
    onClick: () => emit('openObjectDrawer'),
  },
  {
    key: 'auto-seat',
    icon: 'pi pi-sparkles',
    labelKey: 'seating.autoSeat',
    special: true,
    onClick: () => {
      emit('autoSeat')
      emit('close')
    },
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
        :class="['action-btn', action.special && 'action-btn--special', action.primary && 'action-btn--primary']"
        :disabled="action.disabled"
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

.action-btn--primary {
  background: var(--p-primary-500);
  color: #fff;
  box-shadow: 0 0 10px color-mix(in srgb, var(--p-primary-500) 45%, transparent);
  transition: background 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.action-btn--primary:hover:not(:disabled) {
  background: var(--p-primary-600);
  box-shadow: 0 0 18px color-mix(in srgb, var(--p-primary-500) 65%, transparent);
  filter: brightness(1.06);
}

.action-btn--special {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  color: #fff;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.35);
}

.action-btn--special:hover:not(:disabled) {
  filter: brightness(1.12);
  box-shadow: 0 0 18px rgba(124, 58, 237, 0.6);
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
}

.action-btn--special .pi {
  animation: sparkle-spin 2.4s ease-in-out infinite;
}

@keyframes sparkle-spin {
  0%, 100% { transform: rotate(0deg) scale(1); }
  30%       { transform: rotate(-15deg) scale(1.2); }
  60%       { transform: rotate(12deg) scale(0.9); }
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
