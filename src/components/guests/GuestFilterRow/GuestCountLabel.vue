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
  font-size: 0.85rem;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.guest-count-plus {
  color: var(--p-green-500);
  font-weight: 600;
}
</style>