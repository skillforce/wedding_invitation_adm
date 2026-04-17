<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import SummaryBar from '@/components/budget/summary/SummaryBar.vue'
import BudgetTable from '@/components/budget/BudgetTable.vue'
import AddRowMenu from '@/components/budget/AddRowMenu.vue'
import ExportExcel from "@/components/budget/ExportExcel.vue"
import ConfirmDialog from 'primevue/confirmdialog'
import { useBudgetStore } from '@/stores/budget'
import { useCurrencyStore } from '@/stores/currency'
import SelectUserPrompt from '@/components/shared/SelectUserPrompt.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useSelectedUser } from '@/composables/useSelectedUser'
import { useCurrentUser } from '@/composables/useCurrentUser'

const { t } = useI18n()
const budgetStore = useBudgetStore()
const currencyStore = useCurrencyStore()
const { selectedUserId } = useSelectedUser()
const { isSuperUser } = useCurrentUser()

const showPrompt = computed(() => isSuperUser.value && selectedUserId.value === null)

watch(selectedUserId, (userId) => {
  if (isSuperUser.value && userId === null) return
  budgetStore.fetchBudget(userId ?? undefined)
})

onMounted(() => {
  if (!isSuperUser.value || selectedUserId.value !== null) {
    budgetStore.fetchBudget(selectedUserId.value ?? undefined)
  }
  currencyStore.fetchRates()
})
</script>

<template>
  <div class="budget-page">
    <ConfirmDialog />
    <PageHeader :title="t('budget.title')" />

    <template v-if="showPrompt">
      <SelectUserPrompt />
    </template>
    <template v-else>
      <SummaryBar class="summary-bar" />

      <div class="page-body">
        <div class="main-col">
          <Card class="table-card">
            <template #content>
              <BudgetTable />
              <div class="add-row-footer">
                <AddRowMenu />
                <ExportExcel />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </template>

  </div>
</template>

<style scoped>
.budget-page {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

.table-card {
  overflow: hidden;
  box-shadow: var(--shadow-card);
  border-radius: 12px;
  background: var(--color-budget-card-bg);
}

.table-card :deep(.p-card-body),
.table-card :deep(.p-card-content) {
  padding: 0;
  overflow: hidden;
  border-radius: 0;
}

.add-row-footer {
  padding: 0.75rem 1rem;
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 1440px) {
  .page-body {
    flex-direction: column;
    align-items: stretch;
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

<style>
.p-confirmdialog {
  max-width: min(24rem, calc(100vw - 2rem));
}

.p-confirmdialog .p-dialog-content {
  word-break: break-word;
  overflow-wrap: break-word;
}
</style>
