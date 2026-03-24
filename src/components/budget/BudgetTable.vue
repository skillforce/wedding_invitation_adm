<script setup lang="ts">
import { computed, ref } from 'vue'
import { BudgetRowType, type BudgetSection } from '@/types/budget'
import { useBudgetStore } from '@/stores/budget'
import { useI18n } from 'vue-i18n'
import { useDragSort } from '@/composables/useDragSort'
import BudgetSectionRow from './BudgetSection.vue'
import BudgetMobileCard from './BudgetMobileCard.vue'
import BudgetTableHeader from './BudgetTableHeader.vue'

const store = useBudgetStore()
const { t } = useI18n()
const desktopSectionsRef = ref<HTMLElement | null>(null)
const mobileSectionsRef = ref<HTMLElement | null>(null)

const sections = computed(() =>
  store.rows.filter((row): row is BudgetSection => row.type === BudgetRowType.Section),
)

const sectionNumbers = computed<Map<number, number>>(() => {
  const map = new Map<number, number>()
  let n = 1
  for (const section of sections.value) {
    map.set(section.id, n++)
  }
  return map
})

useDragSort(
  desktopSectionsRef,
  (fromIndex, toIndex) => {
    store.moveSection(fromIndex, toIndex)
  },
  {
    handle: '.budget-section-drag-handle',
    ghostClass: 'budget-section-ghost',
    chosenClass: 'budget-section-chosen',
  },
)

useDragSort(
  mobileSectionsRef,
  (fromIndex, toIndex) => {
    store.moveSection(fromIndex, toIndex)
  },
  {
    handle: '.budget-section-drag-handle',
    ghostClass: 'budget-section-ghost',
    chosenClass: 'budget-section-chosen',
  },
)
</script>

<template>
  <div class="budget-table">
    <div class="desktop-view">
      <BudgetTableHeader />

      <div ref="desktopSectionsRef" class="desktop-sections">
        <BudgetSectionRow
          v-for="section in sections"
          :key="section.id"
          :section="section"
          :index="sectionNumbers.get(section.id)!"
        />
      </div>

      <div v-if="sections.length === 0" class="empty-state">
        {{ t('budget.empty') }}
      </div>
    </div>

    <div class="mobile-view">
      <div v-if="sections.length === 0" class="empty-state">
        {{ t('budget.empty') }}
      </div>
      <div v-else ref="mobileSectionsRef" class="mobile-sections">
        <BudgetMobileCard
          v-for="section in sections"
          :key="section.id"
          :section="section"
          :index="sectionNumbers.get(section.id)!"
        />
      </div>
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

.desktop-sections,
.mobile-sections {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.mobile-view {
  display: none;
  padding: 0.75rem;
}

:deep(.budget-section-ghost) {
  opacity: 0.55;
}

:deep(.budget-section-chosen) {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
}

:deep(.budget-item-ghost) {
  opacity: 0.35;
  background: rgba(122, 173, 140, 0.12);
  border-color: #7aad8c !important;
}

:deep(.budget-item-chosen) {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14);
}

@media (max-width: 1144px) {
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: flex;
    padding: 0.5rem;
  }

  .mobile-sections {
    gap: 0.5rem;
  }
}
</style>
