<script setup lang="ts">
import { computed } from 'vue'
import { pullProgress, isRefreshing, isPulling } from '@/composables/usePullToRefresh'

const TRAVEL = 56

const style = computed(() => ({
  transform: isRefreshing.value
    ? 'translateY(0)'
    : `translateY(calc(${pullProgress.value} * ${TRAVEL}px - ${TRAVEL}px))`,
  opacity: isRefreshing.value ? '1' : String(Math.min(1, pullProgress.value * 2)),
  transition: isPulling.value ? 'none' : 'transform 0.32s ease, opacity 0.2s ease',
}))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="pullProgress > 0 || isRefreshing"
      class="ptr-wrap"
      :style="style"
      aria-hidden="true"
    >
      <div class="ptr-ring" :class="{ 'ptr-ring--spinning': isRefreshing }" />
    </div>
  </Teleport>
</template>

<style scoped>
.ptr-wrap {
  position: fixed;
  top: calc(env(safe-area-inset-top) + 3rem + 6px);
  left: 50%;
  translate: -50% 0;
  z-index: 9997;
  will-change: transform, opacity;
}

/* On desktop there's no mobile header — shift up to content edge */
@media (min-width: 1025px) {
  .ptr-wrap {
    top: 1rem;
  }
}

.ptr-ring {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid var(--color-border);
  border-top-color: #8ec5b4;
  background: var(--color-surface);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.ptr-ring--spinning {
  animation: ptr-spin 0.75s linear infinite;
}

@keyframes ptr-spin {
  to { transform: rotate(360deg); }
}
</style>
