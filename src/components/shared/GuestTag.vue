<script setup lang="ts">
import type { GuestRelationshipToCouple } from '@/api/guests'
import GuestSideTag from '@/components/guests/GuestTag/GuestSideTag.vue'

defineProps<{
  side: GuestRelationshipToCouple
}>()
</script>

<template>
    <GuestSideTag :side="side" />
</template>

<style scoped>

.labeled-tag__prefix {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-muted);
  white-space: nowrap;
}
</style>
