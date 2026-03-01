<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="budget-grid table-header">
    <div />
    <div>{{ t('budget.paid') }}</div>
    <div>{{ t('budget.name') }}</div>
    <div>{{ t('budget.estimated') }}</div>
    <div>{{ t('budget.actual') }}</div>
    <div>{{ t('budget.deviation') }}</div>
    <div>{{ t('budget.priorityColumn') }}</div>
    <div />
  </div>
</template>

<style scoped>
.table-header {
  background: var(--color-surface-header, rgba(0, 0, 0, 0.04));
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-radius: 0;
  align-items: end;
}

.budget-grid.table-header {
  padding: 15px 0;
}

.table-header > :nth-child(2),
.table-header > :nth-child(7) {
  text-align: start;
}

.table-header > :nth-child(4),
.table-header > :nth-child(5),
.table-header > :nth-child(6) {
  text-align: start;
  align-self: end;
}
</style>
