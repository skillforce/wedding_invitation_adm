<script setup lang="ts">
import { computed } from 'vue'
import { getIconUrl } from '../icon-picker/scenarioIconOptions'
import type { ScenarioPoint } from '@/types/scenario'

const props = defineProps<{ point: ScenarioPoint }>()

const iconUrl = computed(() => getIconUrl(props.point.icon))
</script>

<template>
  <div class="card-icon-col">
    <img :src="iconUrl" :alt="point.icon" class="card-icon-img" />
  </div>
  <div class="card-body">
    <span class="card-title">{{ point.title }}</span>
    <span v-if="point.note" class="card-note">{{ point.note }}</span>
  </div>
</template>

<style scoped>
.card-icon-col {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: var(--scenario-icon-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon-img {
  width: 34px;
  height: 34px;
  object-fit: contain;
  filter: var(--scenario-icon-filter);
}

.card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-note {
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>