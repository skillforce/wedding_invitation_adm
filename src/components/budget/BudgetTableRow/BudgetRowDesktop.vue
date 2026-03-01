<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Checkbox from 'primevue/checkbox'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import type { BudgetItem } from '@/types/budget'
import PriorityBadge from '../PriorityBadge.vue'
import InputWithError from '@/components/shared/InputWithError.vue'
import { useBudgetItem } from './useBudgetItem'

const props = defineProps<{ item: BudgetItem }>()

const { t } = useI18n()
const { store, isEditing, editName, editNameInvalid, startEdit, commitName, deviation } =
  useBudgetItem(() => props.item)

const paidModel = computed({
  get: () => props.item.paid,
  set: (val: boolean) => store.updateItem(props.item.id, { paid: val }),
})

const estimatedDraft = ref<number | null>(props.item.estimatedCost)
const actualDraft = ref<number | null>(props.item.actualCost)

watch(() => props.item.estimatedCost, (v) => { estimatedDraft.value = v })
watch(() => props.item.actualCost, (v) => { actualDraft.value = v })

function onEstimatedChange(val: number | null) {
  estimatedDraft.value = val
  store.updateItem(props.item.id, { estimatedCost: val ?? 0 })
}

function onActualChange(val: number | null) {
  actualDraft.value = val
  store.updateItem(props.item.id, { actualCost: val })
}
</script>

<template>
  <div class="budget-row budget-grid">
    <!-- Spacer: aligns with section collapse button column -->
    <div />

    <!-- Paid -->
    <div class="cell-center">
      <Checkbox v-model="paidModel" :binary="true" :aria-label="t('budget.paid')" />
    </div>

    <!-- Name -->
    <div class="col-name">
      <template v-if="isEditing">
        <InputWithError
          v-model="editName"
          :invalid="editNameInvalid"
          :error-message="t('budget.nameRequired')"
          :show-save="true"
          :autofocus="true"
          :maxlength="120"
          class="row-input"
          @save="commitName"
          @cancel="isEditing = false"
        />
      </template>
      <template v-else>
        <span class="name-display" :class="{ placeholder: !item.name }">
          {{ item.name || t('budget.itemNamePlaceholder') }}
        </span>
        <Button
          icon="pi pi-pencil"
          size="small"
          text
          rounded
          class="edit-name-btn"
          :aria-label="t('budget.editName')"
          @click="startEdit"
        />
      </template>
    </div>

    <!-- Estimated -->
    <div class="col-estimated">
      <InputNumber
        v-model="estimatedDraft"
        :min="0"
        :max-fraction-digits="0"
        class="row-input"
        @update:model-value="onEstimatedChange"
      />
    </div>

    <!-- Actual -->
    <div class="col-actual">
      <InputNumber
        v-model="actualDraft"
        :min="0"
        :max-fraction-digits="0"
        :placeholder="t('budget.notKnownYet')"
        class="row-input"
        @update:model-value="onActualChange"
      />
    </div>

    <!-- Deviation -->
    <div class="col-deviation">
      <span
        v-if="deviation !== null"
        :class="['deviation', deviation > 0 ? 'over' : deviation < 0 ? 'under' : '']"
      >
        {{ deviation > 0 ? '+' : '' }}{{ store.formatCurrency(deviation) }}
      </span>
      <span v-else class="deviation-empty">—</span>
    </div>

    <!-- Priority -->
    <div class="cell-center">
      <PriorityBadge :priority="item.priority" @click="store.cyclePriority(item.id)" />
    </div>

    <!-- Delete -->
    <div class="cell-center">
      <Button
        icon="pi pi-trash"
        severity="danger"
        text
        rounded
        size="small"
        :aria-label="t('budget.deleteItem')"
        @click="store.deleteItem(item.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.budget-row {
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  transition: background 0.15s;
}

.budget-row:hover {
  background: var(--color-surface-hover, rgba(0, 0, 0, 0.02));
}

.cell-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-input {
  width: 100%;
}

.row-input :deep(input) {
  padding: 0.25rem 0.5rem;
  width: 100%;
}

.col-name {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  padding: 5px 0;
}

.col-name .row-input {
  flex: 1;
}

.col-name .row-input :deep(input) {
  height: auto;
  line-height: 1.4;
}

.name-display {
  flex: 1;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name-display.placeholder {
  color: var(--color-text-secondary, #9ca3af);
  font-style: italic;
}

.edit-name-btn {
  opacity: 0;
  flex-shrink: 0;
  transition: opacity 0.15s;
}

.budget-row:hover .edit-name-btn {
  opacity: 1;
}

.deviation {
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.deviation.over { color: #e8927a; }
.deviation.under { color: #7aad8c; }

.deviation-empty {
  color: var(--color-text-secondary, #9ca3af);
  font-size: 0.85rem;
}

.col-deviation {
  text-align: center;
}
</style>