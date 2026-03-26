<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBudgetStore } from '@/stores/budget'
import SummaryCard from './SummaryCard.vue'
import CurrencyBreakdownList from './CurrencyBreakdownList.vue'
import type { CurrencyBreakdown } from '@/types/budget'

const store = useBudgetStore()
const { t } = useI18n()

const approxPrefix = computed(() => store.multiCurrencyTotals.hasNonBaseCurrency ? '≈' : '')

const priorityRows = computed(() => [
  {
    key: 'must',
    label: t('budget.priority.must'),
    value: approxPrefix.value + store.formatCurrency(store.totals.byPriority.must),
    icon: '!',
    iconClass: 'icon-must',
    breakdown: store.multiCurrencyTotals.byPriority.must as CurrencyBreakdown,
  },
  {
    key: 'want',
    label: t('budget.priority.want'),
    value: approxPrefix.value + store.formatCurrency(store.totals.byPriority.want),
    icon: '♥',
    iconClass: 'icon-want',
    breakdown: store.multiCurrencyTotals.byPriority.want as CurrencyBreakdown,
  },
  {
    key: 'maybe',
    label: t('budget.priority.maybe'),
    value: approxPrefix.value + store.formatCurrency(store.totals.byPriority.maybe),
    icon: '?',
    iconClass: 'icon-maybe',
    breakdown: store.multiCurrencyTotals.byPriority.maybe as CurrencyBreakdown,
  },
])
</script>

<template>
  <SummaryCard :label="t('budget.sidebar.distribution')" icon="pi pi-chart-pie" icon-color="#7a9bbf">
    <div class="priority-list">
      <div v-for="row in priorityRows" :key="row.key" class="priority-row">
        <div class="priority-meta">
          <span class="priority-icon" :class="row.iconClass">{{ row.icon }}</span>
          <span class="priority-label">{{ row.label }}</span>
        </div>
        <div class="priority-values">
          <span class="priority-value">{{ row.value }}</span>
          <CurrencyBreakdownList :by-currency="row.breakdown.byCurrency" />
        </div>
      </div>
    </div>
  </SummaryCard>
</template>

<style scoped>
.priority-list {
  display: grid;
  gap: 0.3rem;
}

.priority-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.45rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.priority-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.priority-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
}

.priority-values {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
  min-width: 0;
}

.priority-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 700;
  flex-shrink: 0;
}

.icon-must  { background: #fee8e4; color: #e8927a; }
.icon-want  { background: #eaf3ec; color: #7aad8c; }
.icon-maybe { background: #e8eff7; color: #7a9bbf; }

.priority-label {
  font-size: calc(var(--summary-label-size, 0.8rem) * 0.95);
  line-height: 1.2;
  color: var(--color-text-secondary, #6b7280);
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
}

.priority-value {
  font-size: calc(var(--summary-value-size, 1.2rem) * 0.67);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text-primary);
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
  text-align: right;
}
</style>