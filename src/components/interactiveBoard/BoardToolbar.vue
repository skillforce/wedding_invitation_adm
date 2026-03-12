<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import type { Stage } from 'konva/lib/Stage'
import type { SeatingShape } from '@/stores/seating'
import { useExportData } from './composables/useExportData'
import ExportPdf from './ExportPdf.vue'
import BoardObjectPickerPopover from './BoardObjectPickerPopover.vue'

defineProps<{ isFitted: boolean; stageRef: { getNode(): Stage } | null }>()
const emit = defineEmits<{ addObject: [shape: SeatingShape]; openWorkspaceSettings: [] }>()
const { t } = useI18n()
const { exportData } = useExportData()

const popoverRef = ref<InstanceType<typeof BoardObjectPickerPopover> | null>(null)

type ToolbarAction = {
  key: string
  labelKey: string
  icon: string
  severity?: 'secondary'
  onClick: () => void
}

const toolbarActions = computed<ToolbarAction[]>(() => [
  {
    key: 'workspace-settings',
    labelKey: 'seating.workspaceSettings',
    icon: 'pi pi-sliders-h',
    severity: 'secondary',
    onClick: () => emit('openWorkspaceSettings'),
  },
  {
    key: 'export-data',
    labelKey: 'seating.exportData',
    icon: 'pi pi-download',
    severity: 'secondary',
    onClick: exportData,
  },
])

function togglePopover(event: MouseEvent) {
  popoverRef.value?.toggle(event)
}

function pickObject(shape: SeatingShape) {
  popoverRef.value?.hide()
  emit('addObject', shape)
}
</script>

<template>
  <div class="board-toolbar">
    <Button :label="t('seating.addObject')" icon="pi pi-plus" size="small" @click="togglePopover" />
    <BoardObjectPickerPopover ref="popoverRef" @pick="pickObject" />
    <Button
      v-for="action in toolbarActions"
      :key="action.key"
      :label="t(action.labelKey)"
      :icon="action.icon"
      size="small"
      :severity="action.severity"
      @click="action.onClick"
    />
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
