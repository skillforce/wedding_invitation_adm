<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import { getFieldOptions, getValueOptions } from './utils.ts'
import type { GuestProfileFilterField, GuestProfileFilterState, GuestProfileFilterValue } from './types.ts'

export type { GuestProfileFilterField, GuestProfileFilterValue, GuestProfileFilterState }

const props = defineProps<{
  modelValue: GuestProfileFilterState
}>()

const emit = defineEmits<{
  'update:modelValue': [value: GuestProfileFilterState]
}>()

const { t } = useI18n()

const fieldOptions = computed(() => getFieldOptions(t))
const valueOptions = computed(() => getValueOptions(t, props.modelValue.field))

function updateField(field: GuestProfileFilterField | null) {
  emit('update:modelValue', {
    field,
    value: null,
  })
}

function updateValue(value: GuestProfileFilterValue) {
  emit('update:modelValue', {
    field: props.modelValue.field,
    value,
  })
}
</script>

<template>
  <div class="profile-filter">
    <Select
      :model-value="modelValue.field"
      :options="fieldOptions"
      option-label="label"
      option-value="value"
      :placeholder="t('guests.profileFilterFieldPlaceholder')"
      class="filter-bar"
      show-clear
      @update:model-value="updateField($event)"
    />

    <Select
      v-if="modelValue.field"
      :model-value="modelValue.value"
      :options="valueOptions"
      option-label="label"
      option-value="value"
      :placeholder="t('guests.profileFilterValuePlaceholder')"
      class="filter-bar"
      show-clear
      @update:model-value="updateValue($event)"
    />
  </div>
</template>

<style scoped>
.profile-filter {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.filter-bar {
  width: 220px;
  min-width: 0;
}

@media (max-width: 640px) {
  .profile-filter {
    grid-template-columns: 1fr;
  }

  .filter-bar {
    width: 100%;
    min-width: 0;
  }
}
</style>
