<script setup lang="ts">
defineProps<{
  side: 'left' | 'right'
}>()
</script>

<template>
  <svg
    class="rail-connector"
    viewBox="0 0 60 100"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      v-if="side === 'right'"
      d="M 30 0 C 30 18 52 24 52 50 C 52 76 30 82 30 100"
      pathLength="90"
    />
    <path
      v-else
      d="M 30 0 C 30 18 8 24 8 50 C 8 76 30 82 30 100"
      pathLength="90"
    />
  </svg>
</template>

<style scoped>
.rail-connector {
  overflow: visible;
  pointer-events: none;
}

.rail-connector path {
  fill: none;
  stroke: var(--scenario-icon-accent);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 5 5;
  animation: rail-dash-flow 0.5s linear infinite;
}

@keyframes rail-dash-flow {
  to { stroke-dashoffset: -10; }
}
</style>
