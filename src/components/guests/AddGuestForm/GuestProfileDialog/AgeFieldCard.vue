<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import FieldCard from '../FieldCard.vue'
import type { GuestAgeGroup } from '@/api/guests'
import type { SelectOption } from '../types'

defineProps<{
  modelValue: GuestAgeGroup | null
  options: SelectOption<GuestAgeGroup>[]
  invalid: boolean
}>()

defineEmits<{
  'update:modelValue': [value: GuestAgeGroup | null]
}>()

const { t } = useI18n()
</script>

<template>
  <FieldCard
    :label="t('guests.profile.ageLabel')"
    :invalid="invalid"
  >
    <Select
      :model-value="modelValue"
      :options="options"
      option-label="label"
      option-value="value"
      :placeholder="t('guests.profile.selectPlaceholder')"
      :invalid="invalid"
      class="field-select"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </FieldCard>
</template>

<style scoped>
.field-select {
  width: 100%;
}
</style>
