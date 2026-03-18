<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import FieldCard from '../FieldCard.vue'
import type { GuestPersonalityType } from '@/api/guests'
import type { SelectOption } from '../types'

defineProps<{
  modelValue: GuestPersonalityType | null
  options: SelectOption<GuestPersonalityType>[]
  invalid: boolean
}>()

defineEmits<{
  'update:modelValue': [value: GuestPersonalityType | null]
}>()

const { t } = useI18n()
</script>

<template>
  <FieldCard
    :label="t('guests.profile.personalityLabel')"
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
