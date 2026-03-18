<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import type { Stage } from 'konva/lib/Stage'
import type { SeatingShape } from '@/stores/seating'
import BoardObjectPickerPopover from './BoardObjectPickerPopover.vue'
import BoardExportPopover from './BoardExportPopover.vue'

defineProps<{ isFitted: boolean; stageRef: { getNode(): Stage } | null }>()
const emit = defineEmits<{ addObject: [shape: SeatingShape]; openWorkspaceSettings: []; autoSeat: []; fitToStage: [] }>()
const { t } = useI18n()

const popoverRef = ref<InstanceType<typeof BoardObjectPickerPopover> | null>(null)

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
      :label="t('seating.autoSeat')"
      icon="pi pi-sparkles"
      size="small"
      class="btn-auto-seat"
      @click="emit('autoSeat')"
    />
    <Button
      :label="t('seating.workspaceSettings')"
      icon="pi pi-sliders-h"
      size="small"
      severity="secondary"
      @click="emit('openWorkspaceSettings')"
    />
    <BoardExportPopover :stage-ref="stageRef" />
    <Button
      :aria-label="t('seating.viewWorkspace')"
      icon="pi pi-expand"
      size="small"
      severity="secondary"
      :disabled="isFitted"
      @click="emit('fitToStage')"
    />
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

:deep(.btn-auto-seat.p-button) {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.45);
  transition: box-shadow 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}

:deep(.btn-auto-seat.p-button:not(:disabled):hover) {
  filter: brightness(1.12);
  box-shadow: 0 0 18px rgba(124, 58, 237, 0.7);
  transform: translateY(-1px);
  border-color: transparent;
}

:deep(.btn-auto-seat.p-button .pi-sparkles) {
  animation: sparkle-spin 2.4s ease-in-out infinite;
}

@keyframes sparkle-spin {
  0%, 100% { transform: rotate(0deg) scale(1); }
  30%       { transform: rotate(-15deg) scale(1.2); }
  60%       { transform: rotate(12deg) scale(0.9); }
}
</style>
