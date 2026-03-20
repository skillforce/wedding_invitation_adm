<script setup lang="ts">
import { computed } from 'vue'
import type { BudgetItem, BudgetSection } from '@/types/budget'
import { useBudgetStore } from '@/stores/budget'
import { useI18n } from 'vue-i18n'
import BudgetSectionRow from './BudgetSection.vue'
import BudgetRow from './BudgetTableRow/BudgetRowDesktop.vue'
import BudgetMobileCard from './BudgetMobileCard.vue'
import BudgetTableHeader from './BudgetTableHeader.vue'

const store = useBudgetStore()
const { t } = useI18n()

const sectionNumbers = computed<Map<number, number>>(() => {
  const map = new Map<number, number>()
  let n = 1
  for (const row of store.rows) {
    if (row.type === 'section') map.set(row.id, n++)
  }
  return map
})

function getParentSection(item: BudgetItem): BudgetSection | undefined {
  return store.rows.find(
    (r): r is BudgetSection => r.type === 'section' && r.id === item.sectionId,
  )
}

function isVisible(index: number): boolean {
  const row = store.rows[index]
  if (!row || row.type !== 'item') return true
  return !getParentSection(row as BudgetItem)?.collapsed
}
</script>

<template>
  <div class="budget-table">
    <div class="desktop-view">
      <BudgetTableHeader />

      <template v-for="(row, index) in store.rows" :key="row.id">
        <template v-if="row.type === 'section'">
          <BudgetSectionRow :section="(row as BudgetSection)" :index="sectionNumbers.get(row.id)!" />
        </template>
        <template v-else-if="isVisible(index)">
          <BudgetRow :item="(row as BudgetItem)" />
        </template>
      </template>

      <div v-if="store.rows.length === 0" class="empty-state">
        {{ t('budget.empty') }}
      </div>
    </div>

    <div class="mobile-view">
      <div v-if="store.rows.length === 0" class="empty-state">
        {{ t('budget.empty') }}
      </div>
      <template v-for="row in store.rows" :key="row.id">
        <BudgetMobileCard
          v-if="row.type === 'section'"
          :section="(row as BudgetSection)"
          :index="sectionNumbers.get(row.id)!"
        />
      </template>
    </div>

  </div>
</template>

<style scoped>
.budget-table {
  --budget-grid-cols: 36px 1fr 80px 130px 130px 130px 100px 80px 36px;
  border-radius: 0;
  overflow: hidden;
}

:deep(.budget-grid) {
  display: grid;
  grid-template-columns: var(--budget-grid-cols);
  gap: 0.5rem;
  padding: 0 0.85rem;
  align-items: center;
  border-radius: 0;
}

:deep(.budget-grid > *) {
  min-width: 0;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-secondary, #9ca3af);
  font-size: 1.1rem;
}

.mobile-view {
  display: none;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
}

@media (max-width: 1144px) {
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
  }
}
</style>
