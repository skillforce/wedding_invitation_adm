<script setup lang="ts">
defineProps<{
  fields: Array<{ label: string; value: string; marked?: boolean }>
  padded?: boolean
}>()
</script>

<template>
  <dl :class="['response-list', padded && 'response-list--padded']">
    <div v-for="field in fields" :key="field.label" class="response-row">
      <dt>{{ field.label }}</dt>
      <dd>
        <span
          v-if="typeof field.marked === 'boolean'"
          :class="['field-mark', field.marked ? 'field-mark--active' : 'field-mark--muted']"
        />
        {{ field.value }}
      </dd>
    </div>
  </dl>
</template>

<style scoped>
.response-list {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
}

.response-list--padded {
  padding: 0 1rem 1rem;
}

.response-row {
  padding: 0.85rem 0.9rem;
  border-radius: 18px;
  background: color-mix(in srgb, var(--color-surface) 92%, white);
  border: 1px solid color-mix(in srgb, var(--color-border-strong) 45%, transparent);
  display: grid;
  gap: 0.35rem;
}

.response-row dt {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.response-row dd {
  margin: 0;
  color: var(--color-text-primary);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  overflow-wrap: break-word;
  word-break: break-word;
  min-width: 0;
}

.field-mark {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 999px;
  flex-shrink: 0;
}

.field-mark--active {
  background: var(--p-green-500);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--p-green-500) 18%, transparent);
}

.field-mark--muted {
  background: var(--color-text-muted);
  opacity: 0.5;
}
</style>
