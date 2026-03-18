<script setup lang="ts">
defineProps<{
  label: string
  plusOneCount?: number
}>()
</script>

<template>
  <span class="guest-count">
    {{ label }}
    <span v-if="plusOneCount && plusOneCount > 0" class="guest-count-plus">
      (+{{ plusOneCount }})
    </span>
  </span>
</template>

<style scoped>
.guest-count {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--color-border-strong) 60%, transparent);
  background: color-mix(in srgb, var(--color-surface) 90%, white);
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-title);
  white-space: nowrap;
}

.guest-count-plus {
  color: var(--p-green-500);
  font-weight: 800;
}
</style>
