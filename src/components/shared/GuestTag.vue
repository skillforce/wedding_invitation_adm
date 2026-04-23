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
