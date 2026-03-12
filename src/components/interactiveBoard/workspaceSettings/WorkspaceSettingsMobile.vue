<script setup lang="ts">
import BottomDrawer from '@/components/shared/BottomDrawer.vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <BottomDrawer :open="open" @close="emit('close')">
    <slot />
  </BottomDrawer>
</template>
