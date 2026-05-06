<script setup lang="ts">
import { usePreferencesStore } from '@/stores/preferences'
import { formatTime } from '@/utils/scenario/scenario.utils'
import ScenarioPointCard from '../point-card/ScenarioPointCard.vue'
import ScenarioRailConnector from './ScenarioRailConnector.vue'
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
      <!-- Rail: time + dot + connector -->
      <div class="rail">
        <span class="rail-time">{{ formatTime(point.time, prefs.timeFormat) }}</span>
        <div class="rail-dot" />
        <ScenarioRailConnector
          v-if="index < points.length - 1"
          :side="index % 2 === 0 ? 'left' : 'right'"
          class="rail-line"
        />
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
  --rail-dot-center-y: 40px;
  display: flex;
  align-items: flex-start;
  gap: 0;
  position: relative;
  padding-bottom: 12px;
}

.rail {
  flex-shrink: 0;
  align-self: stretch;
  width: 68px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 14px;
  position: relative;
  overflow: visible;
}

.rail-time {
  font-size: 14px;
  font-weight: 700;
  color: var(--scenario-icon-accent);
  letter-spacing: 0.03em;
  margin-bottom: 6px;
  white-space: nowrap;
  position: relative;
  z-index: 2;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--color-bg-app, var(--p-surface-ground, transparent));
}

.rail-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--p-surface-card, #fff);
  border: 2.5px solid var(--scenario-icon-accent);
  flex-shrink: 0;
  z-index: 2;
}

.rail-line {
  position: absolute;
  top: var(--rail-dot-center-y);
  bottom: calc(-1 * var(--rail-dot-center-y));
  left: 50%;
  width: 60px;
  transform: translateX(-50%);
  z-index: 0;
}

/* Card occupies remaining space */
.timeline-row > :last-child {
  flex: 1;
}
</style>
