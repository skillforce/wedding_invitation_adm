<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBudgetStore } from '@/stores/budget'
import SummaryCard from './SummaryCard.vue'
import SummaryCardLimit from './SummaryCardLimit.vue'
import SummaryCardPlanned from './SummaryCardPlanned.vue'
import SummaryCardPriority from './SummaryCardPriority.vue'
import SummaryCardSaved from './SummaryCardSaved.vue'

const store = useBudgetStore()
const { t } = useI18n()
const limitCardHovered = ref(false)

const simpleCards = computed(() => [
  {
    key: 'paid',
    icon: 'pi pi-check-circle',
    iconColor: '#7aad8c',
    label: t('budget.summary.paid'),
    value: store.formatCurrency(store.totals.paid),
    valueClass: 'paid',
  },
  {
    key: 'remaining',
    icon: store.totals.remaining < 0 ? 'pi pi-exclamation-triangle' : 'pi pi-wallet',
    iconColor: store.totals.remaining < 0 ? '#e8927a' : '#7aad8c',
    label: t('budget.summary.remaining'),
    value: store.formatCurrency(store.totals.remaining),
    valueClass: store.totals.remaining < 0 ? 'over' : 'under',
  },
])
</script>

<template>
  <div class="summary-bar">
    <div
      class="summary-card"
      @mouseenter="limitCardHovered = true"
      @mouseleave="limitCardHovered = false"
    >
      <SummaryCardLimit :hovered="limitCardHovered" />
    </div>

    <div class="summary-card">
      <SummaryCardPlanned />
    </div>
    <div v-for="card in simpleCards" :key="card.key" class="summary-card">
      <SummaryCard :label="card.label" :icon="card.icon" :icon-color="card.iconColor">
        <span class="card-value" :class="card.valueClass">{{ card.value }}</span>
      </SummaryCard>
    </div>
    <div class="summary-card">
      <SummaryCardSaved />
    </div>
    <div class="summary-card">
      <SummaryCardPriority />
    </div>




  </div>
</template>

<style scoped>
.summary-bar {
  --summary-label-size: 0.8rem;
  --summary-value-size: 1.2rem;
  --summary-badge-size: 0.72rem;
  --summary-card-padding-y: 0.85rem;
  --summary-card-padding-x: 1rem;

  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
}

.summary-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 2px 8px var(--color-border);
  padding: var(--summary-card-padding-y) var(--summary-card-padding-x);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.45rem;
  min-height: 6.25rem;
  transition: box-shadow 0.2s ease;
}

.summary-card:hover {
  box-shadow: 0 4px 12px var(--color-border-strong);
}

.card-value {
  font-size: var(--summary-value-size, 1.2rem);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.25;
}

.card-value.paid  { color: #7aad8c; }
.card-value.under { color: #7aad8c; }
.card-value.over  { color: #e8927a; }

@media (min-width: 1025px) {
  .summary-bar {
    --summary-icon-font-size: 1.5rem;
    --summary-label-size: 1.125rem;
  }
}

@media (max-width: 1024px) {
  .summary-bar {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .summary-bar {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.4rem;
    width: 100%;
    box-sizing: border-box;
    --summary-label-size: 0.78rem;
    --summary-value-size: 1.1rem;
    --summary-badge-size: 0.68rem;
    --summary-card-padding-y: 0.6rem;
    --summary-card-padding-x: 0.7rem;
  }

  .summary-card {
    gap: 0.2rem;
    min-width: 0;
    min-height: 0;
    border-radius: 12px;
  }
}
@media (max-width: 380px) {
  .summary-bar {
    grid-template-columns: 1fr;
    --summary-card-padding-y: 0.4rem;
    --summary-card-padding-x: 0.5rem;
    --summary-value-size: 0.9rem;
  }
}

</style>
