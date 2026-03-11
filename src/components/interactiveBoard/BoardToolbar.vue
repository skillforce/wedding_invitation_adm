<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Popover from 'primevue/popover'
import type { Stage } from 'konva/lib/Stage'
import type { SeatingShape } from '@/stores/seating'
import { useExportData } from './composables/useExportData'
import ExportPdf from './ExportPdf.vue'
import { useWorkspace } from '@/composables/useWorkspace'

defineProps<{ isFitted: boolean; stageRef: { getNode(): Stage } | null }>()
const emit = defineEmits<{ addObject: [shape: SeatingShape]; fitCanvas: [] }>()
const { t } = useI18n()
const { exportData } = useExportData()

const popoverRef = ref<InstanceType<typeof Popover> | null>(null)
const { workspaceShape, toggleShape } = useWorkspace()
const shapeIcon = computed(() => workspaceShape.value === 'rect' ? 'pi pi-circle' : 'pi pi-stop')
const shapeLabel = computed(() => t(workspaceShape.value === 'rect' ? 'seating.toCircleLayout' : 'seating.toRectLayout'))

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
    <Popover ref="popoverRef">
      <div class="object-picker">
        <p class="object-picker-title">{{ t('seating.addObjectTitle') }}</p>
        <button class="object-option" @click="pickObject('circle')">
          <span class="shape-icon shape-circle" />
          <span>{{ t('seating.shapeTable') }}</span>
        </button>
        <button class="object-option" @click="pickObject('rect')">
          <span class="shape-icon shape-rect" />
          <span>{{ t('seating.shapeNewlywedTable') }}</span>
        </button>
        <button class="object-option" @click="pickObject('pillar')">
          <span class="shape-icon shape-pillar" />
          <span>{{ t('seating.shapePillar') }}</span>
        </button>
      </div>
    </Popover>
    <Button :label="t('seating.workspace')" icon="pi pi-expand" size="small" :disabled="isFitted" @click="emit('fitCanvas')" />
    <Button :label="shapeLabel" :icon="shapeIcon" size="small" severity="secondary" @click="toggleShape" />
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

.object-picker {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 180px;
  padding: 4px 0;
}

.object-picker-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 0 0 6px 0;
  padding: 0 4px;
}

.object-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.18s ease;
  text-align: left;
}

.object-option:hover {
  background: var(--color-hover);
}

.shape-icon {
  display: block;
  flex-shrink: 0;
}

.shape-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--board-toolbar-text, #5a7a9a);
  opacity: 0.75;
}

.shape-rect {
  width: 26px;
  height: 14px;
  border-radius: 3px;
  background: var(--board-toolbar-text, #5a7a9a);
  opacity: 0.75;
}

.shape-pillar {
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid rgba(56, 69, 88, 0.45);
  background: linear-gradient(145deg, #dde3eb 0%, #a8b3c2 45%, #78859a 100%);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.5),
    inset 0 -2px 3px rgba(30, 38, 52, 0.25),
    0 2px 4px rgba(30, 38, 52, 0.25);
}

.shape-pillar::before {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 2px;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.32) 0 1px,
      rgba(255, 255, 255, 0) 1px 4px
    );
  opacity: 0.9;
}
</style>
