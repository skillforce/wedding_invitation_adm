<template>
  <TransitionGroup v-if="!isEditing" name="task" tag="div" class="task-list">
    <TaskCard
      v-for="(task, index) in phase.tasks"
      :key="task.id"
      :task="task"
      :phase-id="phase.id"
      :is-editing="false"
      :style="{ '--task-index': index }"
      @toggle="store.toggleTask(phase.id, task.id)"
    />
  </TransitionGroup>

  <div v-else ref="taskListRef" class="task-list" :data-phase-id="phase.id">
    <TaskCard
      v-for="task in phase.tasks"
      :key="task.id"
      :task="task"
      :phase-id="phase.id"
      :is-editing="true"
      @toggle="store.toggleTask(phase.id, task.id)"
      @remove="store.removeTask(phase.id, task.id)"
      @toggle-priority="store.togglePriority(phase.id, task.id)"
      @update-title="store.updateTaskTitle(phase.id, task.id, $event)"
      @update-note="store.updateTaskNote(phase.id, task.id, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDragSort } from '@/composables/useDragSort.ts'
import { useChecklistStore } from '@/stores/checklist.ts'
import TaskCard from '../taskCard/TaskCard.vue'
import type { Phase } from '@/stores/checklist.ts'

const props = defineProps<{
  phase: Phase
  isEditing: boolean
}>()

const store = useChecklistStore()
const taskListRef = ref<HTMLElement | null>(null)

useDragSort(
  taskListRef,
  (fromIndex, toIndex, fromEl, toEl) => {
    store.moveTask(
      fromEl.dataset.phaseId ?? props.phase.id,
      toEl.dataset.phaseId ?? props.phase.id,
      fromIndex,
      toIndex,
    )
  },
  { handle: '.drag-handle', ghostClass: 'task-ghost', chosenClass: 'task-chosen', group: 'checklist-tasks' },
)
</script>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.task-ghost) {
  opacity: 0.35;
  background: rgba(122, 173, 140, 0.12);
  border-color: #7aad8c !important;
  border-radius: 12px;
}

:deep(.task-chosen) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.task-enter-active {
  animation: taskSlideIn 0.3s ease both;
  animation-delay: calc(var(--task-index, 0) * 30ms);
}
.task-leave-active {
  animation: taskSlideIn 0.2s ease reverse both;
}
@keyframes taskSlideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>
