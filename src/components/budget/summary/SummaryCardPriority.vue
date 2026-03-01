<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBudgetStore } from '@/stores/budget'
import SummaryCard from './SummaryCard.vue'

const store = useBudgetStore()
const { t } = useI18n()

const priorityRows = computed(() => [
  {
    key: 'must',
    label: t('budget.priority.must'),
    value: store.formatCurrency(store.totals.byPriority.must),
    icon: '!',
    iconClass: 'icon-must',
  },
  {
    key: 'want',
    label: t('budget.priority.want'),
    value: store.formatCurrency(store.totals.byPriority.want),
    icon: '♥',
    iconClass: 'icon-want',
  },
  {
    key: 'maybe',
    label: t('budget.priority.maybe'),
    value: store.formatCurrency(store.totals.byPriority.maybe),
    icon: '?',
    iconClass: 'icon-maybe',
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
        <span class="priority-value">{{ row.value }}</span>
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
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
}

.priority-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
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
}

.priority-value {
  font-size: calc(var(--summary-value-size, 1.2rem) * 0.67);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text-primary);
  white-space: nowrap;
}
</style>
