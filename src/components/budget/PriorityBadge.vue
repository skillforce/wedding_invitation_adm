<script setup lang="ts">
import type { Priority } from '@/types/budget'

const props = defineProps<{
  priority: Priority
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const LABELS: Record<Priority, string> = {
  must: '!',
  want: '♥',
  maybe: '?',
}

const CLASSES: Record<Priority, string> = {
  must: 'badge-must',
  want: 'badge-want',
  maybe: 'badge-maybe',
}
</script>

<template>
  <button
    type="button"
    :class="['priority-badge', CLASSES[props.priority]]"
    :title="props.priority"
    @click="emit('click')"
  >
    {{ LABELS[props.priority] }}
  </button>
</template>

<style scoped>
.priority-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 700;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.priority-badge:hover {
  opacity: 0.75;
}

.badge-must {
  background-color: #fee8e4;
  color: #e8927a;
}

.badge-want {
  background-color: #eaf3ec;
  color: #7aad8c;
}

.badge-maybe {
  background-color: #e8eff7;
  color: #7a9bbf;
}
</style>