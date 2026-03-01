<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useBudgetStore } from '@/stores/budget'
import SummaryCard from './SummaryCard.vue'

const store = useBudgetStore()
const { t } = useI18n()
</script>

<template>
  <SummaryCard :label="t('budget.summary.planned')" icon="pi pi-chart-bar" icon-color="#818cf8">

    <span class="card-value" :class="{ over: store.totals.planned > store.budgetLimit }">
      {{ store.formatCurrency(store.totals.planned) }}
    </span>
    <div class="progress-track">
      <div
        class="progress-fill"
        :class="store.totals.percentUsed > 100 ? 'fill-over' : 'fill-normal'"
        :style="{ width: Math.min(store.totals.percentUsed, 100) + '%' }"
      />
    </div>
  </SummaryCard>
</template>

<style scoped>


.badge-normal { background: color-mix(in srgb, #818cf8 15%, transparent); color: #818cf8; }
.badge-over   { background: color-mix(in srgb, #e8927a 15%, transparent); color: #e8927a; }

.card-value {
  font-size: var(--summary-value-size, 1.2rem);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.25;
}

.card-value.over { color: #e8927a; }

.progress-track {
  height: 5px;
  border-radius: 999px;
  background: var(--color-border, #e5e7eb);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.fill-normal { background: #818cf8; }
.fill-over   { background: #e8927a; }
</style>
