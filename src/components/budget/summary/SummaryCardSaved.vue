<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBudgetStore } from '@/stores/budget'
import SummaryCard from './SummaryCard.vue'

const store = useBudgetStore()
const { t } = useI18n()

const savedAmount = computed(() => store.totals.planned - store.totals.paid)
const isOverBudgetVsPlan = computed(() => savedAmount.value < 0)
</script>

<template>
  <SummaryCard
    :label="t('budget.summary.saved')"
    icon="pi pi-dollar"
    :icon-color="isOverBudgetVsPlan ? '#e8927a' : '#7aad8c'"
  >
    <span class="card-value" :class="{ over: isOverBudgetVsPlan, saved: !isOverBudgetVsPlan }">
      {{ store.formatCurrency(savedAmount) }}
    </span>

    <div class="compare-list">
      <div class="compare-row">
        <span class="compare-label">{{ t('budget.estimated') }}</span>
        <span class="compare-value">{{ store.formatCurrency(store.totals.planned) }}</span>
      </div>
      <div class="compare-row">
        <span class="compare-label">{{ t('budget.actual') }}</span>
        <span class="compare-value">{{ store.formatCurrency(store.totals.paid) }}</span>
      </div>
    </div>
  </SummaryCard>
</template>

<style scoped>
.card-value {
  font-size: var(--summary-value-size, 1.2rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text-primary);
}

.card-value.saved { color: #7aad8c; }
.card-value.over { color: #e8927a; }

.compare-list {
  display: grid;
  gap: 0.2rem;
}

.compare-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem;
}

.compare-label {
  font-size: calc(var(--summary-label-size, 0.8rem) * 0.9);
  color: var(--color-text-secondary, #6b7280);
}

.compare-value {
  font-size: calc(var(--summary-value-size, 1.2rem) * 0.62);
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
}
</style>
