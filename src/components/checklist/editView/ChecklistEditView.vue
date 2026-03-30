<template>
  <div class="edit-view">
    <ResetButton />
    <div class="phase-list">
      <PhaseCard
        v-for="phase in phases"
        :key="phase.id"
        :phase="phase"
        :is-open="isPhaseOpen(phase)"
        :is-editing="true"
        @toggle="$emit('toggle-phase', phase.id)"
        @task-toggle="handleTaskToggle(phase.id, $event)"
        @remove-phase="store.removePhase(phase.id)"
      />
    </div>
    <AddPhaseCard @phase-added="$emit('phase-added', $event)" />
  </div>
</template>

<script setup lang="ts">
import { useChecklistStore } from '@/stores/checklist'
import PhaseCard from '../phaseCard/PhaseCard.vue'
import type { Phase } from '@/stores/checklist'
import AddPhaseCard from './AddPhaseCard.vue'
import ResetButton from './ResetButton.vue'

const { expandedPhases } = defineProps<{
  phases: Phase[]
  expandedPhases: Set<string>
}>()

defineEmits<{
  'toggle-phase': [id: string]
  'phase-added': [id: string]
}>()

const store = useChecklistStore()

function isPhaseOpen(phase: Phase): boolean {
  const allDone = phase.tasks.length > 0 && phase.tasks.every((t) => t.completed)
  if (!allDone) return true
  return expandedPhases.has(phase.id)
}

function handleTaskToggle(phaseId: string, taskId: string) {
  store.toggleTask(phaseId, taskId)
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
</style>
