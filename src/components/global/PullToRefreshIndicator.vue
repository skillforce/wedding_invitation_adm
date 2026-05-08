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
      <div class="ptr-ring">
        <div /><div /><div /><div />
      </div>
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
  position: relative;
  width: 36px;
  height: 36px;
}

.ptr-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 30px;
  height: 30px;
  margin: 3px;
  border: 3px solid transparent;
  border-top-color: #8ec5b4;
  border-radius: 50%;
  animation: ptr-spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.ptr-ring div:nth-child(1) { animation-delay: -0.3s; }
.ptr-ring div:nth-child(2) { animation-delay: -0.2s; }
.ptr-ring div:nth-child(3) { animation-delay: -0.1s; }

@keyframes ptr-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>
