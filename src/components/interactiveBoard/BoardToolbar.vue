<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import type { Stage } from 'konva/lib/Stage'
import { useExportData } from './composables/useExportData'
import ExportPdf from './ExportPdf.vue'

defineProps<{ isFitted: boolean; stageRef: { getNode(): Stage } | null }>()
const emit = defineEmits<{ addTable: []; fitCanvas: [] }>()
const { t } = useI18n()
const { exportData } = useExportData()
</script>

<template>
  <div class="board-toolbar">
    <Button :label="t('seating.addTable')" icon="pi pi-plus" size="small" @click="emit('addTable')" />
    <Button :label="t('seating.workspace')" icon="pi pi-expand" size="small" :disabled="isFitted" @click="emit('fitCanvas')" />
    <Button :label="t('seating.exportData')" icon="pi pi-download" size="small" severity="secondary" @click="exportData" />
    <ExportPdf :stage-ref="stageRef" />
  </div>
</template>

<style scoped>
.board-toolbar {
  position: absolute;
  top: 14px;
  left: 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--board-toolbar-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--board-toolbar-border);
  border-radius: 10px;
  padding: 8px 14px;
}

@media (max-width: 639px) {
  .board-toolbar {
    display: none;
  }
}
</style>