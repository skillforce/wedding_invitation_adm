<template>
  <div class="phase-progress-track">
    <div class="phase-progress-fill" :style="{ width: pct + '%' }" />
  </div>
  <span class="phase-count">{{ done }}/{{ total }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  done: number
  total: number
}>()

const pct = computed(() => props.total ? Math.round((props.done / props.total) * 100) : 0)
</script>

<style scoped>
.phase-progress-track {
  height: 6px;
  background: rgba(122, 173, 140, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.phase-progress-fill {
  height: 100%;
  background: #7aad8c;
  border-radius: 3px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.phase-count { font-size: 11px; color: var(--color-text-muted); }
</style>
