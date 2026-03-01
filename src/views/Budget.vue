<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import SummaryBar from '@/components/budget/summary/SummaryBar.vue'
import BudgetTable from '@/components/budget/BudgetTable.vue'
import AddRowMenu from '@/components/budget/AddRowMenu.vue'
import ExportExcel from '@/components/budget/ExportExcel.vue'

const { t } = useI18n()
</script>

<template>
  <div class="budget-page">
    <div class="page-header">
      <h1 class="page-title">{{ t('budget.title') }}</h1>
      <ExportExcel />
    </div>

    <SummaryBar class="summary-bar" />

    <div class="page-body">
      <div class="main-col">
        <Card class="table-card">
          <template #content>
            <BudgetTable />
            <div class="add-row-footer">
              <AddRowMenu />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.budget-page {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.summary-bar {
  width: 100%;
}

.page-body {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;

}

.main-col {
  flex: 1;
  min-width: 0;
}

.table-card :deep(.p-card-body),
.table-card :deep(.p-card) {
  border-radius: 10px;
  overflow: hidden;
}

.table-card :deep(.p-card-body),
.table-card :deep(.p-card-content) {
  padding: 0;
  overflow: hidden;
  border-radius: 0;
}

.add-row-footer {
  padding: 0.75rem 1rem;
}

.sidebar-col {
  flex-shrink: 0;
}

@media (max-width: 1440px) {
  .page-body {
    flex-direction: column;
    align-items: stretch;
  }

  .sidebar-col {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .budget-page {
    padding: 0.4rem;
    gap: 0.75rem;
  }

  .add-row-footer {
    padding: 0.5rem 0.6rem;
  }
}
</style>
