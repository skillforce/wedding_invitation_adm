<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import type { BudgetSection } from '@/types/budget'
import { useBudgetStore } from '@/stores/budget'
import InputWithError from '@/components/shared/InputWithError.vue'
import AddNameDialog from './AddNameDialog.vue'

const props = defineProps<{
  section: BudgetSection
  index: number
}>()

const store = useBudgetStore()
const { t } = useI18n()

const total = computed(() => store.getSectionTotal(props.section.id))

const isEditing = ref(false)
const editName = ref(props.section.name)
const editNameInvalid = computed(() => !editName.value.trim())

function startEdit() {
  editName.value = props.section.name
  isEditing.value = true
}

function commitEdit() {
  if (editName.value.trim()) {
    store.updateSection(props.section.id, { name: editName.value.trim() })
  }
  isEditing.value = false
}

const addItemDialogRef = ref<InstanceType<typeof AddNameDialog> | null>(null)
</script>

<template>
  <div class="budget-section-row">
    <!-- Collapse arrow — sits in the collapse column (36px) -->
    <button
      class="collapse-btn"
      :aria-label="section.collapsed ? t('budget.expand') : t('budget.collapse')"
      @click="store.toggleCollapse(section.id)"
    >
      <i :class="['pi', section.collapsed ? 'pi-chevron-right' : 'pi-chevron-down']" />
    </button>



    <!-- Spacer matching the paid-checkbox column -->
    <span class="paid-spacer" />

    <!-- Name group -->
    <div class="section-name-group">
      <!-- Edit mode -->
      <template v-if="isEditing">
        <InputWithError
          v-model="editName"
          :invalid="editNameInvalid"
          :error-message="t('budget.nameRequired')"
          :show-save="true"
          :autofocus="true"
          :maxlength="100"
          class="name-input"
          @save="commitEdit"
          @cancel="isEditing = false"
        />
      </template>

      <!-- Display mode -->
      <template v-else>
        <span class="name-text">{{ index }}. {{ section.name }}</span>
        <Button
          icon="pi pi-pencil"
          size="small"
          text
          rounded
          class="edit-name-btn"
          :aria-label="t('budget.editName')"
          @click.stop="startEdit"
        />
        <Button
          icon="pi pi-plus"
          size="small"
          severity="secondary"
          class="add-item-btn"
          :aria-label="t('budget.addItem')"
          @click.stop="addItemDialogRef?.open()"
        />
      </template>
    </div>

    <span class="section-total">{{ store.formatCurrency(total) }}</span>

    <Button
      icon="pi pi-trash"
      severity="danger"
      text
      rounded
      size="small"
      :aria-label="t('budget.deleteSection')"
      @click="store.deleteSection(section.id)"
    />
  </div>

  <AddNameDialog ref="addItemDialogRef" mode="item" :section-id="section.id" />
</template>

<style scoped>
.budget-section-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.75rem;
  background: var(--color-surface-section, rgba(0, 0, 0, 0.03));
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  border-top: 1px solid var(--color-border, #e5e7eb);
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary, #6b7280);
  padding: 0.25rem;
  border-radius: 4px;
  flex-shrink: 0;
  width: 36px;
  transition: background 0.15s;
}

.collapse-btn:hover {
  background: var(--color-surface-hover, rgba(0, 0, 0, 0.05));
}

/* Mirrors the paid-checkbox column width so the name aligns with item rows */
.paid-spacer {
  display: block;
  width: 80px;
  flex-shrink: 0;
}

/* Name group — grows to fill available space */
.section-name-group {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
}

.name-text {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.edit-name-btn {
  opacity: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.budget-section-row:hover .edit-name-btn {
  opacity: 1;
}

.name-input {
  flex: 1;
}

.name-input :deep(input) {
  font-weight: 600;
  padding: 0.25rem 0.5rem;
}

@media (max-width: 767px) {
  .edit-name-btn {
    opacity: 1;
  }
}

.section-total {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-primary);
  white-space: nowrap;
  flex-shrink: 0;
}



</style>
