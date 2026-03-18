<script setup lang="ts">
defineProps<{
  options: Array<{
    key: string
    label: string
    active: boolean
  }>
}>()

defineEmits<{
  select: [key: string]
}>()
</script>

<template>
  <div class="choice-pills">
    <button
      v-for="option in options"
      :key="option.key"
      type="button"
      :class="['choice-pill', { 'choice-pill--active': option.active }]"
      :aria-pressed="option.active"
      @click="$emit('select', option.key)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.choice-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  width: 100%;
}

.choice-pill {
  border: 1px solid color-mix(in srgb, var(--color-border-strong) 65%, transparent);
  background: transparent;
  color: var(--color-text-primary);
  border-radius: 999px;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.choice-pill--active {
  border-color: var(--p-primary-400);
  background: color-mix(in srgb, var(--p-primary-100) 25%, var(--color-surface));
}

@media (max-width: 640px) {
  .choice-pills {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .choice-pill {
    width: 100%;
    text-align: center;
  }
}
</style>
