<template>
  <span v-if="phase.timeline" class="phase-timeline">
    {{ phase.timeline }}
  </span>
  <h2 v-if="phase.name" class="phase-name">{{ phase.name }}</h2>
</template>

<script setup lang="ts">
import type { Phase } from '@/stores/checklist'

defineProps<{ phase: Phase }>()
</script>

<style scoped>
.phase-timeline {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  display: block;
  margin-bottom: 2px;
}

.phase-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-title);
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 480px) {
  .phase-name { font-size: 15px; }
}
</style>
