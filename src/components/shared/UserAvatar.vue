<script setup lang="ts">
import personIconUrl from '@/assets/person.svg'

withDefaults(defineProps<{
  size: number
  alt?: string
  variant?: 'default' | 'soft'
}>(), {
  alt: 'User Avatar',
  variant: 'soft',
})
</script>

<template>
  <img
    :src="personIconUrl"
    :alt="alt"
    class="user-avatar"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :class="variant === 'default' ? 'user-avatar--default' : 'user-avatar--soft'"
  />
</template>

<style scoped>
.user-avatar {
  border-radius: 999px;
  flex-shrink: 0;
  object-fit: cover;
}

.user-avatar--soft {
  filter: var(--color-avatar-filter-soft);
}

.user-avatar--default {
  filter: var(--color-avatar-filter);
}
</style>