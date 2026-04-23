<script setup lang="ts">
defineProps<{
  label: string
  error?: string
}>()
</script>

<template>
  <div class="form-field">
    <label class="field-label">{{ label }}</label>
    <slot />
    <small v-if="error" class="field-error">{{ error }}</small>
  </div>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.field-error {
  font-size: 12px;
  color: var(--p-red-500, #ef4444);
}
</style>
