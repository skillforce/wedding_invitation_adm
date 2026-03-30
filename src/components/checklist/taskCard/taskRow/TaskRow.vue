<template>
  <div
    class="task-row"
    :role="isEditing ? 'listitem' : 'checkbox'"
    :aria-checked="isEditing ? undefined : task.completed"
    :tabindex="isEditing ? -1 : 0"
    @click="!isEditing && $emit('toggle')"
    @keydown.enter.prevent="!isEditing && $emit('toggle')"
    @keydown.space="onSpace"
  >
    <TaskCheckOrb :is-editing="isEditing" :completed="task.completed" />

    <TaskBody
      :task="task"
      :is-editing="isEditing"
      @update-title="$emit('update-title', $event)"
      @update-note="$emit('update-note', $event)"
    />

    <TaskCommentBtn
      :has-comment="!!task.comment"
      :show-comment="showComment"
      @toggle-comment="$emit('toggle-comment')"
    />

    <TaskRowActions
      :is-editing="isEditing"
      :priority="task.priority"
      @toggle-priority="$emit('toggle-priority')"
      @remove="$emit('remove')"
    />
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/stores/checklist'
import TaskCheckOrb from './TaskCheckOrb.vue'
import TaskBody from './TaskBody.vue'
import TaskCommentBtn from './TaskCommentBtn.vue'
import TaskRowActions from './TaskRowActions.vue'

const props = defineProps<{
  task: Task
  isEditing?: boolean
  showComment: boolean
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  'toggle-priority': []
  'update-title': [v: string]
  'update-note': [v: string]
  'toggle-comment': []
}>()

function onSpace(e: KeyboardEvent) {
  if (!props.isEditing) {
    e.preventDefault()
    emit('toggle')
  }
}
</script>

<style scoped>
.task-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  min-height: 52px;
  cursor: pointer;
}

.task-row:hover {
  background: var(--color-hover);
  border-radius: 11px;
}

.task-row:focus-visible {
  outline: 2px solid #7aad8c;
  outline-offset: 2px;
  border-radius: 12px;
}

@media (max-width: 480px) {
  .task-row { gap: 10px; padding: 10px 12px; }
}
</style>
