<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  invalid: boolean
  errorMessage: string
  showSave?: boolean
  autofocus?: boolean
  maxlength?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'save': []
  'cancel': []
}>()

const touched = ref(false)

const showError = () => props.invalid && touched.value

function handleSave() {
  touched.value = true
  if (!props.invalid) emit('save')
}

function handleKeydown(e: KeyboardEvent) {
  if (!props.showSave) return
  if (e.key === 'Enter') { e.preventDefault(); handleSave() }
  if (e.key === 'Escape') { e.preventDefault(); emit('cancel') }
}

defineExpose({ touch: () => { touched.value = true } })
</script>

<template>
  <div :class="['input-with-error', { 'input-with-error--invalid': showError() }]">
    <div class="input-wrapper" :class="{ 'has-save': showSave }">
      <InputText
        :value="modelValue"
        :placeholder="placeholder"
        :invalid="showError()"
        :autofocus="autofocus"
        :maxlength="maxlength"
        class="input-with-error__input"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="touched = true"
        @keydown="handleKeydown"
      />
      <Button
        v-if="showSave"
        icon="pi pi-check"
        size="small"
        severity="primary"
        class="save-btn"
        @mousedown.prevent
        @click="handleSave"
      />
    </div>
    <small v-if="showError()" class="input-with-error__message">{{ errorMessage }}</small>
  </div>
</template>

<style scoped>
.input-with-error {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-error__input {
  width: 100%;
  flex: 1;
}

/* Leave room for the inline save button */
.has-save .input-with-error__input {
  padding-right: 3rem;
}

.input-with-error--invalid {
  --p-inputtext-invalid-border-color: #f87171;
  --p-focus-ring-color: #f87171;
}

.input-with-error__message {
  color: #f87171;
  font-size: 0.78rem;
}

.save-btn {
  position: absolute;
  right: 0.2rem;
  top: 50%;
  transform: translateY(-50%);
  height: calc(100% - 0.4rem);
  padding-top: 0;
  padding-bottom: 0;
}
</style>