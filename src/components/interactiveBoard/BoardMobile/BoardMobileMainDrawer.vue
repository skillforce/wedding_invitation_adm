<script setup lang="ts">
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
  fitCanvas: []
}>()

const { t } = useI18n()
const { exportData: exportDataBase } = useExportData()

function fitCanvas() {
  emit('fitCanvas')
  emit('close')
}

function exportData() {
  exportDataBase()
  emit('close')
}
</script>

<template>
  <BottomDrawer :open="open" @close="emit('close')">
    <nav class="drawer-nav">
      <button class="action-btn" @click="emit('openObjectDrawer')">
        <i class="pi pi-plus" />
        <span>{{ t('seating.addObject') }}</span>
      </button>
      <button class="action-btn" :disabled="isFitted" @click="fitCanvas">
        <i class="pi pi-expand" />
        <span>{{ t('seating.workspace') }}</span>
      </button>
      <button class="action-btn" @click="exportData">
        <i class="pi pi-download" />
        <span>{{ t('seating.exportData') }}</span>
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
