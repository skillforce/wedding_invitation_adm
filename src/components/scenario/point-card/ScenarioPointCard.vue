<script setup lang="ts">
import ScenarioPointCardView from './ScenarioPointCardView.vue'
import ScenarioPointCardEdit from './ScenarioPointCardEdit.vue'
import type { ScenarioPoint } from '@/types/scenario'

defineProps<{ point: ScenarioPoint; isEditing: boolean }>()
</script>

<template>
  <div class="point-card" :class="{ 'point-card--editing': isEditing }">
    <ScenarioPointCardView v-if="!isEditing" :point="point" />
    <ScenarioPointCardEdit v-else :point="point" />
  </div>
</template>

<style scoped>
.point-card {
  flex: 1;
  min-width: 0;
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 12px 14px;
  display: flex;
  gap: 12px;
  align-items: center;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.point-card--editing {
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  border-color: var(--scenario-icon-accent);
  box-shadow: 0 0 0 1px var(--scenario-icon-accent-soft);
}
</style>