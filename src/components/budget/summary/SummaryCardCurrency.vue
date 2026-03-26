<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCurrencyStore } from '@/stores/currency'
import { useBudgetStore } from '@/stores/budget'
import type { BudgetCurrency } from '@/types/budget'
import SummaryCard from './SummaryCard.vue'

const currencyStore = useCurrencyStore()
const budgetStore = useBudgetStore()
const { t } = useI18n()

const ALL_CURRENCIES: BudgetCurrency[] = ['BYN', 'USD', 'RUB']

const rateRows = computed(() => {
  const base = budgetStore.currency
  if (!currencyStore.rates) return []
  return ALL_CURRENCIES
    .filter((c) => c !== base)
    .map((c) => {
      const showRub100 = c === 'RUB' || (base === 'RUB' && c !== 'USD')
      if (showRub100) {
        const target = c === 'RUB' ? base : c
        const rate = currencyStore.convert(100, 'RUB', target)
        return {
          label: `100 RUB/${target}`,
          value: rate !== null ? rate.toFixed(2) : '—',
        }
      }
      const rate = currencyStore.convert(1, c, base)
      return {
        label: `${c}/${base}`,
        value: rate !== null ? rate.toFixed(2) : '—',
      }
    })
})

const updatedAtFormatted = computed(() => {
  if (!currencyStore.rates?.updatedAt) return ''
  return new Date(currencyStore.rates.updatedAt).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<template>
  <SummaryCard
    :label="t('budget.summary.currency')"
    icon="pi pi-money-bill"
    icon-color="#f59e0b"
  >
    <template v-if="currencyStore.loading && !currencyStore.rates">
      <span class="loading-text">{{ t('budget.summary.currencyLoading') }}</span>
    </template>
    <template v-else-if="currencyStore.rates">
      <div class="rate-list">
        <div v-for="row in rateRows" :key="row.label" class="rate-row">
          <span class="rate-label">{{ row.label }}</span>
          <span class="rate-value">{{ row.value }}</span>
        </div>
      </div>
      <span class="updated-at">{{ updatedAtFormatted }}</span>
    </template>
  </SummaryCard>
</template>

<style scoped>
.rate-list {
  display: grid;
  gap: 0.25rem;
}

.rate-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.rate-label {
  font-size: calc(var(--summary-label-size, 0.8rem) * 0.9);
  color: var(--color-text-secondary, #6b7280);
}

.rate-value {
  font-size: var(--summary-value-size, 1.2rem);
  font-weight: 700;
  color: var(--color-text-primary);
}

.updated-at {
  font-size: calc(var(--summary-badge-size, 0.82rem) * 0.9);
  color: var(--color-text-secondary, #6b7280);
  margin-top: 0.15rem;
}

.loading-text {
  font-size: calc(var(--summary-label-size, 0.8rem) * 0.95);
  color: var(--color-text-secondary, #6b7280);
}
</style>