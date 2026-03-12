<script setup lang="ts">
defineProps<{
  label: string
  invalid?: boolean
  wide?: boolean
}>()
</script>

<template>
  <section :class="['field-card', invalid && 'field-card--invalid', wide && 'field-card--wide']">
    <span class="field-label">{{ label }}</span>
    <slot />
  </section>
</template>

<style scoped>
.field-card {
  display: grid;
  gap: 0.55rem;
  padding: 0.9rem;
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--color-border-strong) 60%, transparent);
  background: color-mix(in srgb, var(--color-surface) 94%, white);
  overflow: hidden;
}

.field-card--wide {
  grid-column: 1 / -1;
}

.field-card--invalid {
  border-color: color-mix(in srgb, var(--p-red-500) 70%, transparent);
}

.field-label {
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--color-title);
}
</style>
