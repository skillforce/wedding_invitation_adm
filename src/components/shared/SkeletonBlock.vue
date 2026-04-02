<script setup lang="ts">
withDefaults(defineProps<{
  height?: string
  width?: string
  borderRadius?: string
}>(), {
  height: '38px',
  width: '100%',
  borderRadius: '6px',
})
</script>

<template>
  <div
    class="skeleton-block"
    :style="{ height, width, borderRadius }"
  />
</template>

<style scoped>
.skeleton-block {
  background: linear-gradient(
    90deg,
    var(--color-surface-soft) 25%,
    var(--color-hover) 50%,
    var(--color-surface-soft) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  flex-shrink: 0;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>