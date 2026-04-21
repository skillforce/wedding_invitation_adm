<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SCENARIO_ICONS } from './scenarioIconOptions'
import type { ScenarioPointIcon } from '@/types/scenario'

const { t } = useI18n()

defineProps<{ modelValue: ScenarioPointIcon }>()
defineEmits<{ select: [value: ScenarioPointIcon] }>()
</script>

<template>
  <div class="scenario-icon-palette" @click.stop>
    <div class="icon-grid">
      <button
        v-for="icon in SCENARIO_ICONS"
        :key="icon.value"
        type="button"
        class="icon-opt"
        :class="{ 'icon-opt--active': modelValue === icon.value }"
        :title="t(icon.labelKey)"
        @click="$emit('select', icon.value)"
      >
        <img :src="icon.url" :alt="t(icon.labelKey)" class="icon-img" />
      </button>
    </div>
  </div>
</template>



<style scoped>
.scenario-icon-palette {
  width: min(260px, calc(100vw - 32px));
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(10px);
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 6px;
}

.icon-opt {
  aspect-ratio: 1;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  transition: all 0.15s ease;
}

.icon-opt:hover {
  background: var(--color-hover);
}

.icon-opt--active {
  background: var(--scenario-icon-bg-active);
  border-color: var(--scenario-icon-accent);
}

.icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: var(--scenario-icon-filter);
  opacity: 0.7;
  transition: opacity 0.15s;
}

.icon-opt:hover .icon-img,
.icon-opt--active .icon-img {
  opacity: 1;
}
</style>