<template>
  <div class="task-body">
    <input
      v-if="isEditing"
      class="task-title-input"
      :value="task.title"
      placeholder="Task title…"
      @input="$emit('update-title', ($event.target as HTMLInputElement).value)"
      @click.stop
    />
    <span v-else class="task-title">{{ task.title }}</span>

    <input
      v-if="isEditing"
      class="task-note-input"
      :value="task.note"
      placeholder="Add a note…"
      @input="$emit('update-note', ($event.target as HTMLInputElement).value)"
      @click.stop
    />
    <span v-else-if="task.note" class="task-note">{{ task.note }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/stores/checklist'

defineProps<{
  task: Task
  isEditing?: boolean
}>()

defineEmits<{
  'update-title': [v: string]
  'update-note': [v: string]
}>()
</script>

<style scoped>
.task-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.4;
  transition: color 0.2s ease;
}

.task-note {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.3;
}

.task-title-input,
.task-note-input {
  display: block;
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border);
  border-radius: 0;
  outline: none;
  color: var(--color-text-primary);
  transition: border-color 0.15s ease;
  padding: 1px 0;
  font-size: 16px;
}

.task-title-input {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
}

.task-title-input:focus { border-bottom-color: #7aad8c; }

.task-note-input {
  font-size: 16px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.task-note-input:focus { border-bottom-color: #7aad8c; }

.task-title-input::placeholder,
.task-note-input::placeholder {
  color: var(--color-text-muted);
  opacity: 0.5;
}
</style>
