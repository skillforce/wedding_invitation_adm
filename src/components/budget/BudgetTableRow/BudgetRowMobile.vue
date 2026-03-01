<script setup lang="ts">
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
</script>

<template>
  <div class="card-item">
    <!-- Row 1: checkbox + name + priority + delete -->
    <div class="item-main">
      <Checkbox
        :model-value="item.paid"
        :binary="true"
        :aria-label="t('budget.paid')"
        @update:model-value="(v) => store.updateItem(item.id, { paid: v as boolean })"
      />

      <template v-if="isEditing">
        <InputWithError
          v-model="editName"
          :invalid="editNameInvalid"
          :error-message="t('budget.nameRequired')"
          :show-save="true"
          :autofocus="true"
          :maxlength="120"
          class="item-name-input"
          @save="commitName"
          @cancel="isEditing = false"
        />
      </template>
      <template v-else>
        <span class="item-name" :class="{ placeholder: !item.name }">
          {{ item.name || t('budget.itemNamePlaceholder') }}
        </span>
        <Button
          icon="pi pi-pencil"
          size="small"
          text
          rounded
          class="edit-btn"
          :aria-label="t('budget.editName')"
          @click="startEdit"
        />
      </template>

      <PriorityBadge :priority="item.priority" @click="store.cyclePriority(item.id)" />
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

    <!-- Row 2: estimated / actual / deviation -->
    <div class="item-amounts">
      <div class="amount-field">
        <span class="amount-label">{{ t('budget.estimated') }}</span>
        <InputNumber
          :model-value="item.estimatedCost"
          :min="0"
          :max-fraction-digits="0"
          class="amount-input"
          @update:model-value="(v) => store.updateItem(item.id, { estimatedCost: v ?? 0 })"
        />
      </div>
      <div class="amount-field">
        <span class="amount-label">{{ t('budget.actual') }}</span>
        <InputNumber
          :model-value="item.actualCost"
          :min="0"
          :max-fraction-digits="0"
          :placeholder="t('budget.notKnownYet')"
          class="amount-input"
          @update:model-value="(v) => store.updateItem(item.id, { actualCost: v })"
        />
      </div>
      <div class="amount-field">
        <span class="amount-label">{{ t('budget.deviation') }}</span>
        <span
          v-if="deviation !== null"
          :class="['deviation', deviation > 0 ? 'over' : deviation < 0 ? 'under' : '']"
        >
          {{ deviation > 0 ? '+' : '' }}{{ store.formatCurrency(deviation) }}
        </span>
        <span v-else class="deviation-empty">—</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-item {
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  padding: 0.5rem 0.75rem 0.4rem;
}

.card-item:last-child {
  border-bottom: none;
}

/* Row 1 */
.item-main {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.item-name {
  flex: 1;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.item-name.placeholder {
  color: var(--color-text-secondary, #9ca3af);
  font-style: italic;
}

.item-name-input {
  flex: 1;
  min-width: 0;
}

.item-name-input :deep(input) {
  padding: 0.2rem 3rem 0.2rem 0.5rem;
}

.edit-btn {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s;
}

.card-item:hover .edit-btn {
  opacity: 1;
}

/* Row 2 */
.item-amounts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
  margin-top: 0.4rem;
}

.amount-field {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.amount-label {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-secondary, #6b7280);
  text-align: center;
}

.amount-input {
  width: 100%;
}

.amount-input :deep(input) {
  padding: 0.2rem 0.4rem;
  width: 100%;
}

.deviation {
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  align-self: center;
  padding-top: 0.15rem;
}

.deviation.over { color: #e8927a; }
.deviation.under { color: #7aad8c; }

.deviation-empty {
  font-size: 0.85rem;
  color: var(--color-text-secondary, #9ca3af);
  align-self: center;
  padding-top: 0.15rem;
}
</style>