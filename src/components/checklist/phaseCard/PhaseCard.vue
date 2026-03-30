<template>
  <section class="phase-block" :class="{ 'phase-block--editing': isEditing }">
    <PhaseHeader
      :phase="phase"
      :is-open="isOpen"
      :is-editing="isEditing"
      @toggle="$emit('toggle')"
      @remove="$emit('remove-phase')"
    />

    <CollapseTransition :show="isOpen">
      <div class="task-list-inner">
        <PhaseTaskList :phase="phase" :is-editing="isEditing" />
      </div>
    </CollapseTransition>

    <div v-if="isEditing" class="add-task-inner">
      <PhaseAddTask :phase-id="phase.id" />
    </div>
  </section>
</template>

<script setup lang="ts">
import CollapseTransition from '@/components/ui/CollapseTransition.vue'
import PhaseHeader from './PhaseHeader.vue'
import PhaseTaskList from './PhaseTaskList.vue'
import PhaseAddTask from './PhaseAddTask.vue'
import type { Phase } from '@/stores/checklist.ts'

defineProps<{
  phase: Phase
  isOpen: boolean
  isEditing: boolean
}>()

defineEmits<{
  toggle: []
  'remove-phase': []
}>()
</script>

<style scoped>
.phase-block {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: visible;
  box-shadow: var(--shadow-card);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.phase-block:hover { border-color: var(--color-border-strong); }
.phase-block--editing { border-color: rgba(122, 173, 140, 0.4); }

.task-list-inner {
  overflow: hidden;
  padding: 0 14px 14px;
}

.add-task-inner {
  padding: 0 14px 14px;
}

@media (max-width: 480px) {
  .task-list-inner { padding: 0 10px 10px; }
  .add-task-inner { padding: 0 10px 10px; }
}
</style>
