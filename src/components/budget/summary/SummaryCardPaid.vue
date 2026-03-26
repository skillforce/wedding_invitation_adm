<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBudgetStore } from '@/stores/budget'
import SummaryCard from './SummaryCard.vue'
import CurrencyBreakdownList from './CurrencyBreakdownList.vue'

const store = useBudgetStore()
const { t } = useI18n()

const approxPrefix = computed(() => store.multiCurrencyTotals.hasNonBaseCurrency ? '≈' : '')

const depositSub = computed(() => {
  if (store.totals.deposit <= 0) return null
  return t('budget.summary.deposit', { amount: approxPrefix.value + store.formatCurrency(store.totals.deposit) })
})
</script>

<template>
  <SummaryCard :label="t('budget.summary.paid')" icon="pi pi-check-circle" icon-color="#7aad8c">
    <span class="card-value paid">{{ approxPrefix }}{{ store.formatCurrency(store.totals.paid) }}</span>
    <CurrencyBreakdownList :by-currency="store.multiCurrencyTotals.paid.byCurrency" />
    <span v-if="depositSub" class="card-sub">{{ depositSub }}</span>
    <CurrencyBreakdownList
      v-if="store.totals.deposit > 0"
      :by-currency="store.multiCurrencyTotals.deposit.byCurrency"
    />
  </SummaryCard>
</template>

<style scoped>
.card-value {
  font-size: var(--summary-value-size, 1.2rem);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.25;
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
}

.card-value.paid { color: #7aad8c; }

.card-sub {
  font-size: var(--summary-badge-size, 1rem);
  color: var(--color-text-secondary, #6b7280);
  font-weight: 700;
  line-height: 1.2;
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
}
</style>