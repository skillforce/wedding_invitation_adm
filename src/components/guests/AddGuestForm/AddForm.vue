<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useI18n } from 'vue-i18n'

defineProps<{
  modelValue: string
  isAdding: boolean
  disabled: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
  submit: []
}>()

const { t } = useI18n()

function updateValue(value: string | undefined) {
  return value ?? ''
}
</script>

<template>
  <form class="add-form" @submit.prevent="$emit('submit')">
    <InputText
      :model-value="modelValue"
      :placeholder="t('guests.addGuestPlaceholder')"
      class="add-input"
      maxlength="20"
      @update:model-value="$emit('update:modelValue', updateValue($event))"
    />
    <Button
      type="submit"
      :loading="isAdding"
      :disabled="disabled"
      :aria-label="t('a11y.addGuest')"
      icon="pi pi-plus"
      size="small"
    />
  </form>
</template>

<style scoped>
.add-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.add-input {
  flex: 1;
}
</style>
