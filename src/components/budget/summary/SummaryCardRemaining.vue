<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBudgetStore } from '@/stores/budget'
import SummaryCard from './SummaryCard.vue'
import CurrencyBreakdownList from './CurrencyBreakdownList.vue'

const store = useBudgetStore()
const { t } = useI18n()

const approxPrefix = computed(() => store.multiCurrencyTotals.hasNonBaseCurrency ? '≈' : '')
</script>

<template>
  <SummaryCard
    :label="t('budget.summary.remaining')"
    :icon="store.totals.remaining < 0 ? 'pi pi-exclamation-triangle' : 'pi pi-wallet'"
    :icon-color="store.totals.remaining < 0 ? '#e8927a' : '#7aad8c'"
  >
    <span class="card-value" :class="store.totals.remaining < 0 ? 'over' : 'under'">
      {{ approxPrefix }}{{ store.formatCurrency(store.totals.remaining) }}
    </span>
    <CurrencyBreakdownList :by-currency="store.multiCurrencyTotals.remaining.byCurrency" />
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

.card-value.under { color: #7aad8c; }
.card-value.over  { color: #e8927a; }
</style>