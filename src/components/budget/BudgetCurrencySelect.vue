<script setup lang="ts">
import Select from 'primevue/select'
import bynSymbolUrl from '@/assets/byn.svg'
import type { BudgetCurrency } from '@/types/budget'

withDefaults(defineProps<{
  modelValue: BudgetCurrency
  ariaLabel?: string
  variant?: 'compact' | 'default'
}>(), {
  ariaLabel: 'Currency',
  variant: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: BudgetCurrency]
}>()

const currencyOptions: { label: string; shortLabel: string; value: BudgetCurrency; iconUrl?: string }[] = [
  { label: 'RUB ₽', shortLabel: '₽', value: 'RUB' },
  { label: 'USD $', shortLabel: '$', value: 'USD' },
  { label: 'BYN', shortLabel: 'BYN', value: 'BYN', iconUrl: bynSymbolUrl },
]

function getCurrencyOption(value: BudgetCurrency) {
  return currencyOptions.find((entry) => entry.value === value)
}
</script>

<template>
  <Select
    :model-value="modelValue"
    :options="currencyOptions"
    option-label="label"
    option-value="value"
    append-to="body"
    :aria-label="ariaLabel"
    :class="['currency-select', `currency-select--${variant}`]"
    @update:model-value="(value) => emit('update:modelValue', value as BudgetCurrency)"
  >
    <template #value="{ value, placeholder }">
      <template v-if="value">
        <span v-if="getCurrencyOption(value)?.iconUrl" class="currency-value currency-value--with-icon">
          <span v-if="variant !== 'compact'">{{ getCurrencyOption(value)?.label }}</span>
          <img
            :src="getCurrencyOption(value)?.iconUrl"
            alt="currency icon"
            class="currency-icon"
          >
        </span>
        <span v-else class="currency-value">
          {{ variant === 'compact' ? getCurrencyOption(value)?.shortLabel : getCurrencyOption(value)?.label }}
        </span>
      </template>
      <span v-else class="currency-placeholder">{{ placeholder }}</span>
    </template>

    <template #option="{ option }">
      <div class="currency-option">
        <span class="currency-option-label">{{ option.label }}</span>
        <img
          v-if="option.iconUrl"
          :src="option.iconUrl"
          alt=""
          class="currency-icon"
        >
      </div>
    </template>
  </Select>
</template>

<style scoped>
.currency-select {
  flex-shrink: 0;
}

.currency-select :deep(.p-select-label) {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.currency-select :deep(.p-select-dropdown) {
  padding: 0;
}

.currency-select--compact :deep(.p-select-label) {
  padding: 2px 4px;
  font-size: var(--summary-label-size, 13px);
}

.currency-select--compact :deep(.p-select-dropdown) {
  width: 19px;
}

.currency-select--default {
  width: 100%;
  min-width: 0;
}

.currency-select--default :deep(.p-select-label) {
  padding: 6px 10px;
  font-size: 16px;
}

.currency-select--default :deep(.p-select-dropdown) {
  width: 28px;
}

.currency-value,
.currency-placeholder {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.currency-option {
  display: flex;
  align-items: center;
  gap: 6px;
}

.currency-option-label {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.currency-value--with-icon {
  gap: 6px;
}

.currency-icon {
  width: 12px;
  height: 12px;
  object-fit: contain;
  flex-shrink: 0;
  margin-left: -3px;
}
</style>
