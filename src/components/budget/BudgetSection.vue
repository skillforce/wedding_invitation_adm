<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import type { BudgetSection } from '@/types/budget'
import { useBudgetStore } from '@/stores/budget'
import InputWithError from '@/components/shared/InputWithError.vue'
import AddNameDialog from './AddNameDialog.vue'
import { useBudgetConfirm } from './useBudgetConfirm'

const props = defineProps<{
  section: BudgetSection
  index: number
}>()

const store = useBudgetStore()
const { t } = useI18n()
const { confirmDeleteSection } = useBudgetConfirm()

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
    <button
      class="collapse-btn"
      :aria-label="section.collapsed ? t('budget.expand') : t('budget.collapse')"
      @click="store.toggleCollapse(section.id)"
    >
      <i :class="['pi', section.collapsed ? 'pi-chevron-right' : 'pi-chevron-down']" />
    </button>

    <div class="section-name-group">
      <template v-if="isEditing">
        <InputWithError
          v-model="editName"
          :invalid="editNameInvalid"
          :error-message="t('budget.nameRequired')"
          :show-save="true"
          :autofocus="true"
          :maxlength="50"
          class="name-input"
          @save="commitEdit"
          @cancel="isEditing = false"
        />
      </template>

      <template v-else>
        <Button
          icon="pi pi-plus"
          size="small"
          severity="secondary"
          class="add-item-btn"
          :aria-label="t('budget.addItem')"
          @click.stop="addItemDialogRef?.open()"
        />
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

      </template>
    </div>

          <span class="section-total"><span class="section-total-label">{{ t('budget.summary.total') }}:</span> {{ store.formatCurrency(total) }}</span>

    <Button
      icon="pi pi-trash"
      severity="danger"
      text
      rounded
      size="small"
      :aria-label="t('budget.deleteSection')"
      @click="confirmDeleteSection(section.id, section.name)"
    />
  </div>

  <AddNameDialog ref="addItemDialogRef" mode="item" :section-id="section.id" />
</template>

<style scoped>
.budget-section-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem;
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

.section-total-label {
  font-weight: 400;
  color: var(--color-text-secondary, #6b7280);
}



</style>
