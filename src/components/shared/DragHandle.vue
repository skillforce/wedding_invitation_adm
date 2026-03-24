<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md'
}>(), {
  size: 'md',
})
</script>

<template>
  <span class="drag-handle-base" :class="`drag-handle-base--${size}`" aria-hidden="true">
    <i class="pi pi-bars" />
  </span>
</template>

<style scoped>
.drag-handle-base {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-text-muted, var(--color-text-secondary, #6b7280));
  opacity: 0.7;
  cursor: grab;
  touch-action: none;
  user-select: none;
  line-height: 1;
}

.drag-handle-base--md {
  font-size: 14px;
}

.drag-handle-base--sm {
  font-size: 12px;
}
</style>
