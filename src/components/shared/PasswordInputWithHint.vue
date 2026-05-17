<script setup lang="ts">
import Password from 'primevue/password'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
  autocomplete?: string
  hint: string
  hintMet: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <Password
    :model-value="modelValue"
    :placeholder="placeholder"
    :feedback="false"
    toggle-mask
    fluid
    :invalid="invalid"
    :disabled="disabled"
    :autocomplete="autocomplete"
    @update:model-value="emit('update:modelValue', $event as string)"
  />
  <div v-if="modelValue" class="hint" :class="hintMet ? 'hint--met' : 'hint--unmet'">
    <i :class="hintMet ? 'pi pi-check-circle' : 'pi pi-circle'" />
    {{ hint }}
  </div>
</template>

<style scoped>
.hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.hint--met {
  color: var(--p-green-500, #22c55e);
}

.hint--unmet {
  color: var(--color-text-muted);
}
</style>