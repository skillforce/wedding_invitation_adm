<template>
  <button
    class="comment-btn"
    :class="{ 'comment-btn--active': hasComment }"
    :title="showComment ? 'Hide comment' : 'Add / view comment'"
    @click.stop="$emit('toggle-comment')"
  >
    <i class="pi pi-comment" />
    <span v-if="hasComment" class="comment-dot" />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  hasComment: boolean
  showComment: boolean
}>()

defineEmits<{
  'toggle-comment': []
}>()
</script>

<style scoped>
.comment-btn {
  flex-shrink: 0;
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.comment-btn:hover {
  border-color: var(--color-border);
  color: var(--color-text-primary);
}

.comment-btn--active { color: #7aad8c; }

.comment-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #7aad8c;
}
</style>
