<script setup lang="ts">
import { computed } from 'vue'
import type { BudgetCurrency } from '@/types/budget'
import { useBudgetStore } from '@/stores/budget'
import { useCurrencyStore } from '@/stores/currency'

const props = defineProps<{
  byCurrency: Partial<Record<BudgetCurrency, number>>
}>()

const budgetStore = useBudgetStore()
const currencyStore = useCurrencyStore()

const entries = computed(() => {
  const base = budgetStore.currency
  return (Object.entries(props.byCurrency) as [BudgetCurrency, number][])
    .filter(([, amount]) => amount !== 0)
    .map(([cur, amount]) => ({
      currency: cur,
      formatted: budgetStore.formatCurrencyAmount(amount, cur),
      approx: cur !== base
        ? budgetStore.formatCurrency(Math.round(currencyStore.convert(amount, cur, base) ?? 0))
        : null,
    }))
})

const visible = computed(() => {
  if (entries.value.length === 0) return false
  if (entries.value.length > 1) return true
  return entries.value[0]?.approx !== null
})
</script>

<template>
  <div v-if="visible" class="currency-breakdown">
    <div v-for="entry in entries" :key="entry.currency" class="breakdown-row">
      <span class="breakdown-amount">{{ entry.formatted }}</span>
      <span v-if="entry.approx" class="breakdown-approx">(≈{{ entry.approx }})</span>
    </div>
  </div>
</template>

<style scoped>
.currency-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  margin-top: 0.15rem;
  width: fit-content;
  padding-top: 0.2rem;
  border-top: 1px solid var(--color-border, #e5e7eb);
}

.breakdown-row {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.breakdown-amount {
  font-size: calc(var(--summary-badge-size, 0.82rem) * 0.95);
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
}

.breakdown-approx {
  font-size: calc(var(--summary-badge-size, 0.82rem) * 0.9);
  color: var(--color-text-secondary, #6b7280);
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
}
</style>
