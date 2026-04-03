<script setup lang="ts">
import { ref } from 'vue'
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import SkeletonBlock from '@/components/shared/SkeletonBlock.vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  invalid: boolean
  errorMessage: string
  pending?: boolean
}>()


const emit = defineEmits<{
  'update:modelValue': [value: string]
  'validate': [valid: boolean]
}>()

const touched = ref(false)
const currentDialCode = ref('')

const showError = () => props.invalid && touched.value

function onValidate(phoneObject: { valid: boolean }) {
  emit('validate', phoneObject.valid)
}

function onCountryChanged(country: { dialCode: string }) {
  const dialCode = '+' + country.dialCode
  currentDialCode.value = dialCode
  if (!props.modelValue || !props.modelValue.startsWith(dialCode.slice(0, 2))) {
    emit('update:modelValue', dialCode)
  }
}

function onInput(value: string) {
  const val = value ?? ''
  if (currentDialCode.value && !val.startsWith(currentDialCode.value)) {
    emit('update:modelValue', currentDialCode.value)
  } else {
    emit('update:modelValue', val)
  }
}

defineExpose({ touch: () => { touched.value = true } })
</script>

<template>
  <div class="phone-with-error">
    <SkeletonBlock v-if="pending" />
    <VueTelInput
      v-else
      :model-value="modelValue"
      mode="international"
      :input-options="{ placeholder }"
      :auto-default-country="!modelValue"
      class="phone-input"
      :class="{ 'phone-input--invalid': showError() }"
      @update:model-value="onInput"
      @validate="onValidate"
      @country-changed="onCountryChanged"
      @blur="touched = true"
    />
    <small v-if="showError()" class="phone-with-error__message">{{ errorMessage }}</small>
  </div>
</template>

<style scoped>
.phone-with-error {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.phone-input {
  border-radius: 6px;
  border: 1px solid var(--color-border-strong) !important;
  background: transparent !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.phone-input:focus-within {
  border-color: var(--p-primary-400) !important;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--p-primary-400) 25%, transparent);
}

.phone-input--invalid {
  border-color: #f87171 !important;
}

.phone-input--invalid:focus-within {
  box-shadow: 0 0 0 2px color-mix(in srgb, #f87171 25%, transparent);
}

.phone-with-error__message {
  color: #f87171;
  font-size: 0.78rem;
}
</style>

<style>
.phone-input .vti__input {
  background: transparent;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  padding: 0.5rem 0.75rem;
}

.phone-input .vti__dropdown {
  background: transparent;
  border-right: 1px solid var(--color-border-strong);
  padding: 0 0.5rem;
}

.phone-input .vti__dropdown:hover,
.phone-input .vti__dropdown.open {
  background: var(--color-hover);
}

.phone-input .vti__dropdown-list {
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: 6px;
  box-shadow: var(--shadow-card);
  z-index: 100;
}

.phone-input .vti__dropdown-item {
  color: var(--color-text-primary);
}

.phone-input .vti__dropdown-item:hover,
.phone-input .vti__dropdown-item.highlighted {
  background: var(--color-hover);
}
</style>
