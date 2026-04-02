<script setup lang="ts">
import personIconUrl from '@/assets/person.svg'

const props = withDefaults(defineProps<{
  size: number
  alt?: string
  variant?: 'default' | 'soft'
  src?: string | null
}>(), {
  alt: 'User Avatar',
  variant: 'soft',
  src: null,
})
</script>

<template>
  <img
    :src="props.src ?? personIconUrl"
    :alt="alt"
    class="user-avatar"
    loading="lazy"
    :style="{ width: `${size}px`, height: `${size}px` }"
    :class="props.src ? '' : (variant === 'default' ? 'user-avatar--default' : 'user-avatar--soft')"
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
