<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import { useBudgetStore } from '@/stores/budget'
import SummaryCard from './SummaryCard.vue'
import BudgetCurrencySelect from '../BudgetCurrencySelect.vue'

const props = defineProps<{ hovered?: boolean }>()

const store = useBudgetStore()
const { t } = useI18n()

const isEditingLimit = ref(false)
const limitDraft = ref<number | null>(store.budgetLimit)
const limitError = ref(false)

function startEditLimit() {
  limitDraft.value = store.budgetLimit
  limitError.value = false
  isEditingLimit.value = true
}

function commitLimit() {
  if (!limitDraft.value || limitDraft.value <= 0) {
    limitError.value = true
    return
  }
  store.setBudgetLimit(limitDraft.value)
  isEditingLimit.value = false
}
</script>

<template>
  <SummaryCard :label="t('budget.summary.budgetLimit')" icon="pi pi-briefcase" icon-color="var(--p-primary-400)">
    <template #header-end>
      <BudgetCurrencySelect
        :model-value="store.currency"
        :aria-label="t('budget.currency')"
        variant="compact"
        @update:model-value="store.setCurrency"
      />
    </template>

    <template v-if="isEditingLimit">
      <div class="limit-edit-row">
        <InputNumber
          v-model="limitDraft"
          :min="1"
          :max-fraction-digits="10"
          autofocus
          class="limit-input"
          @update:model-value="limitError = false"
          @keydown.enter="commitLimit"
          @keydown.esc="isEditingLimit = false"
        />
        <Button
          icon="pi pi-check"
          size="small"
          severity="primary"
          text
          :aria-label="t('budget.save')"
          @mousedown.prevent
          @click="commitLimit"
        />
      </div>
      <small v-if="limitError" class="limit-error">{{ t('budget.limitMustBePositive') }}</small>
    </template>

    <template v-else>
      <div class="limit-display">
        <span class="card-value">{{ store.formatCurrency(store.budgetLimit) }}</span>
        <Button
          icon="pi pi-pencil"
          size="small"
          text
          rounded
          class="edit-limit-btn"
          :class="{ visible: props.hovered }"
          :aria-label="t('budget.editName')"
          @click="startEditLimit"
        />
      </div>
    </template>
  </SummaryCard>
</template>

<style scoped>
.card-value {
  font-size: var(--summary-value-size, 1.2rem);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.25;
}

.limit-display {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  justify-content: space-between;
}

.edit-limit-btn {
  opacity: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.edit-limit-btn.visible {
  opacity: 1;
}

@media (max-width: 640px) {
  .edit-limit-btn {
    opacity: 1;
  }
}

.limit-edit-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.limit-input {
  flex: 1;
  min-width: 0;
}

.limit-input :deep(input) {
  font-size: calc(var(--summary-value-size, 1.2rem) * 0.9);
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  width: 100%;
}

.limit-error {
  display: block;
  color: #f87171;
  font-size: var(--summary-label-size, 0.8rem);
}

</style>
