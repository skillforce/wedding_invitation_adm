<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import FieldCard from '../FieldCard.vue'
import type { GuestRelationshipToCouple } from '@/api/guests'
import type { SelectOption } from '../types'

defineProps<{
  modelValue: GuestRelationshipToCouple | null
  options: SelectOption<GuestRelationshipToCouple>[]
  invalid: boolean
}>()

defineEmits<{
  'update:modelValue': [value: GuestRelationshipToCouple | null]
}>()

const { t } = useI18n()
</script>

<template>
  <FieldCard
    :label="t('guests.profile.relationshipLabel')"
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
