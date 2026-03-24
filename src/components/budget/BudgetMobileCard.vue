<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import type { BudgetSection } from '@/types/budget'
import { useBudgetStore } from '@/stores/budget'
import { useDragSort } from '@/composables/useDragSort'
import InputWithError from '@/components/shared/InputWithError.vue'
import DragHandle from '@/components/shared/DragHandle.vue'
import BudgetRowMobile from './BudgetTableRow/BudgetRowMobile.vue'
import AddNameDialog from './AddNameDialog.vue'
import { startBudgetItemAutoExpand, stopBudgetItemAutoExpand } from './useBudgetItemAutoExpand'
import { useBudgetConfirm } from './useBudgetConfirm'

const props = defineProps<{ section: BudgetSection; index: number }>()

const store = useBudgetStore()
const { t } = useI18n()
const { confirmDeleteSection } = useBudgetConfirm()

const items = computed(() => store.getSectionItems(props.section.id))

const total = computed(() => store.getSectionTotal(props.section.id))

const isEditingSection = ref(false)
const editSectionName = ref(props.section.name)
const sectionNameInvalid = computed(() => !editSectionName.value.trim())
const itemListRef = ref<HTMLElement | null>(null)

function commitSectionName() {
  if (editSectionName.value.trim()) {
    store.updateSection(props.section.id, { name: editSectionName.value.trim() })
  }
  isEditingSection.value = false
}

const addItemDialogRef = ref<InstanceType<typeof AddNameDialog> | null>(null)

useDragSort(
  itemListRef,
  (fromIndex, toIndex, fromEl, toEl) => {
    const fromSectionId = Number(fromEl.dataset.sectionId ?? props.section.id)
    const toSectionId = Number(toEl.dataset.sectionId ?? props.section.id)

    store.moveItem(fromSectionId, toSectionId, fromIndex, toIndex)
  },
  {
    handle: '.budget-item-drag-handle',
    ghostClass: 'budget-item-ghost',
    chosenClass: 'budget-item-chosen',
    group: 'budget-mobile-items',
    onDragStart: () => startBudgetItemAutoExpand(store),
    onDragEnd: () => stopBudgetItemAutoExpand(),
  },
)
</script>

<template>
  <div class="mobile-card" :data-budget-section-id="section.id">
    <div class="card-header">
      <DragHandle class="budget-section-drag-handle" size="sm" />

      <button
        class="collapse-btn"
        :aria-label="section.collapsed ? t('budget.expand') : t('budget.collapse')"
        @click="store.toggleCollapse(section.id)"
      >
        <i :class="['pi', section.collapsed ? 'pi-chevron-right' : 'pi-chevron-down']" />
      </button>

      <div class="section-name-group">
        <template v-if="isEditingSection">
          <InputWithError
            v-model="editSectionName"
            :invalid="sectionNameInvalid"
            :error-message="t('budget.nameRequired')"
            :show-save="true"
            :autofocus="true"
            :maxlength="50"
            class="section-name-input"
            @save="commitSectionName"
            @cancel="isEditingSection = false"
          />
        </template>
        <template v-else>
          <Button
            icon="pi pi-pencil"
            size="small"
            text
            rounded
            class="edit-btn"
            :aria-label="t('budget.editName')"
            @click="isEditingSection = true"
          />
          <span class="section-name">{{ index }}. {{ section.name }}</span>
          <span class="card-total">{{ store.formatCurrency(total) }}</span>
          <Button
            icon="pi pi-plus"
            size="small"
            severity="secondary"
            class="add-item-btn"
            :aria-label="t('budget.addItem')"
            @click="addItemDialogRef?.open()"
          />
        </template>
      </div>

      <Button
        icon="pi pi-trash"
        size="small"
        severity="danger"
        text
        rounded
        :aria-label="t('budget.deleteSection')"
        @click="confirmDeleteSection(section.id, section.name)"
      />
    </div>

    <div
      v-show="!section.collapsed"
      ref="itemListRef"
      class="mobile-item-list"
      :data-section-id="section.id"
      :data-empty-label="t('budget.empty')"
    >
      <BudgetRowMobile v-for="item in items" :key="item.id" :item="item" />
    </div>

    <AddNameDialog ref="addItemDialogRef" mode="item" :section-id="section.id" />
  </div>
</template>

<style scoped>
.mobile-card {
  border-radius: 12px;
  border: 1px solid var(--color-border, #e5e7eb);
  background: var(--color-surface, #fff);
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.75rem;
  background: var(--color-surface-section, rgba(0, 0, 0, 0.03));
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.budget-section-drag-handle {
  width: 24px;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary, #6b7280);
  padding: 0.2rem;
  border-radius: 4px;
  flex-shrink: 0;
}

.section-name-group {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
}

.section-name {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 100%;
  flex: 1;
}

.section-name-input {
  flex: 1;
  min-width: 0;
}

.section-name-input :deep(input) {
  font-weight: 600;
  padding: 0.2rem 3rem 0.2rem 0.5rem;
}

.card-total {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-primary);
  white-space: nowrap;
  flex-shrink: 0;
}

.edit-btn {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s;
}

.add-item-btn {
  flex-shrink: 0;
}

.card-header:hover .edit-btn {
  opacity: 1;
}

@media (max-width: 767px) {
  .edit-btn {
    opacity: 1;
  }
}

.mobile-item-list {
  position: relative;
}

.mobile-item-list:empty {
  min-height: 3rem;
}

.mobile-item-list:empty::before {
  content: attr(data-empty-label);
  display: block;
  padding: 1rem 0.75rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary, #9ca3af);
  font-style: italic;
}

</style>
