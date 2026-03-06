<template>
  <div
    class="task-card"
    :class="{
      'task-card--done': task.completed && !isEditing,
      'task-card--priority': task.priority === 'high',
      'task-card--editing': isEditing,
    }"
  >
    <TaskRow
      :task="task"
      :is-editing="isEditing"
      :show-comment="showComment"
      @toggle="$emit('toggle')"
      @remove="$emit('remove')"
      @toggle-priority="$emit('toggle-priority')"
      @update-title="$emit('update-title', $event)"
      @update-note="$emit('update-note', $event)"
      @toggle-comment="showComment = !showComment"
    />

    <CollapseTransition :show="showComment">
      <TaskCommentPanel :task="task" :phase-id="phaseId" @close="showComment = false" />
    </CollapseTransition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CollapseTransition from '@/components/ui/CollapseTransition.vue'
import TaskRow from './taskRow/TaskRow.vue'
import TaskCommentPanel from './TaskCommentPanel.vue'
import type { Task } from '@/stores/checklist'

defineProps<{ task: Task; isEditing?: boolean; phaseId: string }>()

defineEmits<{
  toggle: []
  remove: []
  'toggle-priority': []
  'update-title': [v: string]
  'update-note': [v: string]
}>()

const showComment = ref(false)
</script>

<style scoped>
.task-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.task-card--priority { border-left: 3px solid var(--cl-done, #7aad8c); }

.task-card--done :deep(.task-title) {
  text-decoration: line-through;
  color: var(--color-text-muted);
}

.task-card--done :deep(.task-row) { opacity: 0.75; }
.task-card--done:hover :deep(.task-row) { opacity: 1; }

.task-card:hover { border-color: var(--color-border-strong); }
.task-card--editing :deep(.task-row) { cursor: default; }
</style>
