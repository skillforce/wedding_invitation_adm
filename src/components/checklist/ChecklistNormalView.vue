<template>
  <TransitionGroup name="phase-list" tag="div" class="phase-list">
    <PhaseCard
      v-for="phase in phases"
      :key="phase.id"
      :phase="phase"
      :is-open="expandedPhases.has(phase.id)"
      :is-editing="false"
      @toggle="$emit('toggle-phase', phase.id)"
      @task-toggle="handleTaskToggle(phase.id, $event)"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useChecklistStore } from '@/stores/checklist'
import PhaseCard from './phaseCard/PhaseCard.vue'
import type { Phase } from '@/stores/checklist'

defineProps<{
  phases: Phase[]
  expandedPhases: Set<string>
}>()

defineEmits<{
  'toggle-phase': [id: string]
}>()

const store = useChecklistStore()

function handleTaskToggle(phaseId: string, taskId: string) {
  store.toggleTask(phaseId, taskId)
}
</script>

<style scoped>
.phase-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.phase-list-enter-active {
  animation: phaseIn 0.35s ease both;
}
.phase-list-leave-active {
  animation: phaseIn 0.25s ease reverse both;
  position: absolute;
  width: 100%;
}
.phase-list-move {
  transition: transform 0.35s ease;
}
@keyframes phaseIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
