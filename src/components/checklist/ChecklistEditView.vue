<template>
  <div class="edit-view">
    <div class="phase-list">
      <PhaseCard
        v-for="phase in phases"
        :key="phase.id"
        :phase="phase"
        :is-open="expandedPhases.has(phase.id)"
        :is-editing="true"
        @toggle="$emit('toggle-phase', phase.id)"
        @task-toggle="handleTaskToggle(phase.id, $event)"
        @remove-phase="store.removePhase(phase.id)"
      />
    </div>

    <div class="add-phase-card">
      <div class="add-phase-row">
        <div class="add-phase-icon-btn" @click="showIconPicker = !showIconPicker">
          <i :class="newIcon" />
          <i class="pi pi-chevron-down chevron" />

          <Transition name="picker-drop">
            <div v-if="showIconPicker" class="icon-picker-shell">
              <PhaseIconPalette :model-value="newIcon" @select="selectNewIcon" />
            </div>
          </Transition>
        </div>

        <input
          v-model="newName"
          class="add-phase-input"
          placeholder="New section name…"
          @keydown.enter.prevent="submit"
        />

        <button class="add-phase-submit" :disabled="!newName.trim()" @click="submit">
          <i class="pi pi-plus" />
          Add section
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChecklistStore } from '@/stores/checklist'
import PhaseCard from './phaseCard/PhaseCard.vue'
import type { Phase } from '@/stores/checklist'
import PhaseIconPalette from './phaseCard/PhaseIconPalette.vue'

defineProps<{
  phases: Phase[]
  expandedPhases: Set<string>
}>()

const emit = defineEmits<{
  'toggle-phase': [id: string]
  'phase-added': [id: string]
}>()

const store = useChecklistStore()

const newName = ref('')
const newIcon = ref('pi pi-sparkles')
const showIconPicker = ref(false)

function handleTaskToggle(phaseId: string, taskId: string) {
  store.toggleTask(phaseId, taskId)
}

function selectNewIcon(icon: string) {
  newIcon.value = icon
  showIconPicker.value = false
}

function submit() {
  const name = newName.value.trim()
  if (!name) return
  store.addPhase(name, newIcon.value)
  const added = store.phases[store.phases.length - 1]
  if (!added) return
  emit('phase-added', added.id)
  newName.value = ''
  newIcon.value = 'pi pi-sparkles'
}
</script>

<style scoped>
.edit-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.phase-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.add-phase-card {
  background: var(--color-surface);
  border: 1.5px dashed rgba(122, 173, 140, 0.4);
  border-radius: 16px;
  padding: 16px 18px;
  transition: border-color 0.2s ease;
}

.add-phase-card:hover {
  border-color: rgba(122, 173, 140, 0.7);
}

.add-phase-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.add-phase-icon-btn {
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  padding: 0 10px;
  border-radius: 10px;
  background: rgba(122, 173, 140, 0.12);
  border: 1px dashed rgba(122, 173, 140, 0.5);
  color: #7aad8c;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.add-phase-icon-btn:hover {
  background: rgba(122, 173, 140, 0.2);
}

.chevron {
  font-size: 10px;
  opacity: 0.7;
}

.icon-picker-shell {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 50;
}

.picker-drop-enter-active {
  animation: pickerIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.picker-drop-leave-active {
  animation: pickerIn 0.15s ease reverse;
}
@keyframes pickerIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.add-phase-input {
  flex: 1;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(122, 173, 140, 0.35);
  background: rgba(122, 173, 140, 0.06);
  color: var(--color-text-primary);
  font-size: 16px;
  font-weight: 600;
  outline: none;
  transition: border-color 0.2s ease;
}

.add-phase-input::placeholder {
  color: var(--color-text-muted);
  font-weight: 400;
}

.add-phase-input:focus {
  border-color: #7aad8c;
}

.add-phase-submit {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: none;
  background: #7aad8c;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
  white-space: nowrap;
}

.add-phase-submit:disabled {
  opacity: 0.4;
  cursor: default;
}

.add-phase-submit:not(:disabled):hover {
  opacity: 0.85;
}

@media (max-width: 480px) {
  .add-phase-row {
    flex-wrap: wrap;
  }

  .add-phase-input {
    flex: 1 1 0;
    min-width: 0;
  }

  .add-phase-submit {
    flex: 1 1 100%;
    justify-content: center;
  }
}
</style>
