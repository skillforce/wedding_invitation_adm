<template>
  <template v-if="isEditing">
    <button
      class="edit-action-btn star-btn"
      :class="{ 'star-btn--active': priority === 'high' }"
      :title="priority === 'high' ? 'Remove priority' : 'Mark as priority'"
      @click.stop="$emit('toggle-priority')"
    >
      <i class="pi pi-star-fill" />
    </button>
    <button class="edit-action-btn delete-btn" title="Remove task" @click.stop="$emit('remove')">
      <i class="pi pi-times" />
    </button>
  </template>
  <template v-else>
    <span v-if="priority === 'high'" class="priority-badge">
      <i class="pi pi-star-fill" />
    </span>
  </template>
</template>

<script setup lang="ts">
defineProps<{
  isEditing?: boolean
  priority: string
}>()

defineEmits<{
  'toggle-priority': []
  remove: []
}>()
</script>

<style scoped>
.priority-badge {
  flex-shrink: 0;
  font-size: 12px;
  color: var(--cl-priority, #e8927a);
  opacity: 0.8;
}

.edit-action-btn {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.star-btn { color: var(--color-text-muted); }

.star-btn--active {
  color: var(--cl-priority, #e8927a);
  border-color: var(--cl-priority, #e8927a);
  background: rgba(232, 146, 122, 0.1);
}

.delete-btn {
  color: var(--color-text-muted);
  margin-left: 4px;
}

.delete-btn:hover {
  color: #e08080;
  border-color: #e08080;
  background: rgba(220, 80, 80, 0.1);
}
</style>
