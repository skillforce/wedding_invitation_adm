<script setup lang="ts">
import type { GuestRelationshipToCouple } from '@/api/guests'
import maleIconUrl from '@/assets/guest_male.svg'
import femaleIconUrl from '@/assets/guest_female.svg'

defineProps<{ side?: GuestRelationshipToCouple }>()
</script>

<template>
  <span :class="['guest-side-tag', `guest-side-tag--${side}`]" :aria-label="side">
    <img v-if="side === 'groom_side'" :src="maleIconUrl" class="tag-icon" alt="male side" />
    <img v-else-if="side === 'bride_side'" :src="femaleIconUrl" class="tag-icon" alt="female side" />
    <template v-else>
      <img :src="maleIconUrl" class="tag-icon tag-icon--mutual" alt="mutual side male" />
      <img :src="femaleIconUrl" class="tag-icon tag-icon--mutual" alt="mutual side female" />
    </template>
  </span>
</template>

<style scoped>
.guest-side-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 6px;
  width: 22px;
  height: 24px;
  padding: 2px;
  gap: 1px;
}

.tag-icon {
  width: 14px;
  height: 24px;
  object-fit: contain;
}

.tag-icon--mutual {
  width: 14px;
  height: 18px;
}

.guest-side-tag--groom_side {
  background: color-mix(in srgb, #1d4ed8 10%, transparent);
  outline: 1px solid color-mix(in srgb, #1d4ed8 25%, transparent);
}

.guest-side-tag--bride_side {
  background: color-mix(in srgb, #be185d 10%, transparent);
  outline: 1px solid color-mix(in srgb, #be185d 25%, transparent);
}

.guest-side-tag--mutual {
  width: 38px;
  background: color-mix(in srgb, var(--color-text-muted) 10%, transparent);
  outline: 1px solid color-mix(in srgb, var(--color-text-muted) 20%, transparent);
}
</style>
