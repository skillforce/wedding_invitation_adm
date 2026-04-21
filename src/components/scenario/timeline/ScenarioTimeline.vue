<script setup lang="ts">
import { usePreferencesStore } from '@/stores/preferences'
import { formatTime } from '@/utils/scenario/scenario.utils'
import ScenarioPointCard from '../point-card/ScenarioPointCard.vue'
import type { ScenarioPoint } from '@/types/scenario'

defineProps<{
  points: ScenarioPoint[]
  isEditing: boolean
}>()

const prefs = usePreferencesStore()
</script>

<template>
  <div class="timeline">
    <div
      v-for="(point, index) in points"
      :key="point.id"
      class="timeline-row"
    >
      <!-- Rail: time + dot + line -->
      <div class="rail">
        <span class="rail-time">{{ formatTime(point.time, prefs.timeFormat) }}</span>
        <div class="rail-dot" />
        <div v-if="index < points.length - 1" class="rail-line" />
      </div>

      <!-- Card -->
      <ScenarioPointCard :point="point" :is-editing="isEditing" />
    </div>
  </div>
</template>



<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-row {
  display: flex;
  align-items: flex-start;
  gap: 0;
  position: relative;
}

.rail {
  flex-shrink: 0;
  width: 68px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 14px;
  position: relative;
}

.rail-time {
  font-size: 11px;
  font-weight: 700;
  color: var(--scenario-icon-accent);
  letter-spacing: 0.03em;
  margin-bottom: 6px;
  white-space: nowrap;
}

.rail-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--scenario-icon-accent);
  flex-shrink: 0;
  z-index: 1;
}

.rail-line {
  width: 2px;
  flex: 1;
  min-height: 24px;
  background: linear-gradient(
    to bottom,
    var(--scenario-icon-accent) 0%,
    var(--scenario-line-fade) 100%
  );
  opacity: 0.35;
}

/* Card occupies remaining space */
.timeline-row > :last-child {
  flex: 1;
  margin-bottom: 12px;
}
</style>