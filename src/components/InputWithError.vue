<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  invalid: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const touched = ref(false)

const showError = () => props.invalid && touched.value
</script>

<template>
  <div :class="['input-with-error', { 'input-with-error--invalid': showError() }]">
    <InputText
      :value="modelValue"
      :placeholder="placeholder"
      :invalid="showError()"
      class="input-with-error__input"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="touched = true"
    />
    <small v-if="showError()" class="input-with-error__message">{{ errorMessage }}</small>
  </div>
</template>

<style scoped>
.input-with-error {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.input-with-error__input {
  width: 100%;
}

.input-with-error--invalid {
  --p-inputtext-invalid-border-color: #f87171;
  --p-focus-ring-color: #f87171;
}

.input-with-error__message {
  color: #f87171;
  font-size: 0.78rem;
}
</style>