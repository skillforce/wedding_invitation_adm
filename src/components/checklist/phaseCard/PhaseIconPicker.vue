<template>
  <div
    class="phase-icon-wrap"
    :class="{ 'phase-icon-wrap--editable': isEditing }"
    @click.stop="isEditing && (showIconPicker = !showIconPicker)"
  >
    <i :class="icon" class="phase-icon" />
    <i v-if="isEditing" class="pi pi-pencil icon-edit-hint" />

    <Transition name="picker-drop">
      <div v-if="showIconPicker" class="icon-picker-shell">
        <PhaseIconPalette :model-value="icon" @select="selectIcon" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChecklistStore } from '@/stores/checklist'
import PhaseIconPalette from './PhaseIconPalette.vue'

const props = defineProps<{
  phaseId: string
  icon: string
  isEditing: boolean
}>()

const store = useChecklistStore()
const showIconPicker = ref(false)

function selectIcon(icon: string) {
  store.updatePhaseIcon(props.phaseId, icon)
  showIconPicker.value = false
}
</script>

<style scoped>
.phase-icon-wrap {
  flex-shrink: 0;
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(122, 173, 140, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.phase-icon-wrap--editable {
  cursor: pointer;
  border: 1px dashed rgba(122, 173, 140, 0.5);
}

.phase-icon-wrap--editable:hover { background: rgba(122, 173, 140, 0.25); }
.phase-icon-wrap--editable:hover .phase-icon { opacity: 0.3; }
.phase-icon-wrap--editable:hover .icon-edit-hint { opacity: 1; }

.phase-icon {
  font-size: 18px;
  color: #7aad8c;
  transition: opacity 0.15s ease;
}

.icon-edit-hint {
  position: absolute;
  font-size: 13px;
  color: #7aad8c;
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
}

.icon-picker-shell {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 50;
}

.picker-drop-enter-active { animation: pickerIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.picker-drop-leave-active { animation: pickerIn 0.15s ease reverse; }
@keyframes pickerIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
}

@media (max-width: 480px) {
  .phase-icon-wrap { width: 36px; height: 36px; }
}
</style>
