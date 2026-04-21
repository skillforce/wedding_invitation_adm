<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScenarioStore } from '@/stores/scenario'
import { SCENARIO_MAX_POINTS } from '@/constants/scenario'
import ScenarioAddPointModal from './ScenarioAddPointModal.vue'

const { t } = useI18n()
const store = useScenarioStore()
const MAX = SCENARIO_MAX_POINTS
const modalVisible = ref(false)
</script>



<template>
  <div class="add-point-wrap">
    <button
      type="button"
      class="add-btn"
      :class="{ 'add-btn--disabled': !store.canAddPoint }"
      :disabled="!store.canAddPoint"
      :title="!store.canAddPoint ? t('scenario.limitReachedHint') : undefined"
      @click="modalVisible = true"
    >
      <i class="pi pi-plus" />
      {{ t('scenario.addPoint') }}
    </button>

    <span class="counter" :class="{ 'counter--warn': store.points.length >= 35 }">
      {{ store.points.length }} / {{ MAX }}
    </span>

    <ScenarioAddPointModal v-model:visible="modalVisible" />
  </div>
</template>


<style scoped>
.add-point-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 0 0 28px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1.5px dashed var(--scenario-icon-accent);
  background: transparent;
  color: var(--scenario-icon-accent);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.add-btn:hover:not(.add-btn--disabled) {
  background: var(--scenario-icon-bg);
}

.add-btn--disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-style: solid;
}

.add-btn i {
  font-size: 12px;
}

.counter {
  font-size: 12px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.counter--warn {
  color: #e8927a;
  font-weight: 700;
}
</style>