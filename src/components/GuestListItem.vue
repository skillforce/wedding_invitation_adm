<script setup lang="ts">
import { computed } from 'vue'
import type { GuestsViewDto } from '@/api/guests'

const props = defineProps<{
  guest: GuestsViewDto
}>()

const initial = computed(() => {
  if (!props.guest.name) {
    return ''
  }

  return props.guest.name.charAt(0).toUpperCase()
})

const drinksText = computed(() => {
  if (!props.guest.preferred_drinks.length) {
    return 'None'
  }

  return props.guest.preferred_drinks.join(', ')
})

const otherPreferencesText = computed(
  () => props.guest.other_preferences?.trim() || 'None',
)
</script>

<template>
  <article class="guest-item">
    <header class="guest-header">
      <div class="avatar-fallback">{{ initial }}</div>
      <p class="guest-name">{{ guest.name }}</p>
    </header>

    <dl class="guest-details">
      <div class="guest-field">
        <dt>Preferred drinks</dt>
        <dd>{{ drinksText }}</dd>
      </div>

      <div class="guest-field">
        <dt>Other preferences</dt>
        <dd>{{ otherPreferencesText }}</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.guest-item {
  min-height: 100%;
  border-radius: 10px;
  border: 1px solid #d4d4d8;
  background: #f8fafc;
  padding: 0.75rem;
  display: grid;
  gap: 0.75rem;
}

.guest-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar-fallback {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: #2a3a56;
  color: #dbeafe;
  font-weight: 700;
}

.guest-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.guest-details {
  margin: 0;
  display: grid;
  gap: 0.5rem;
}

.guest-field {
  display: grid;
  gap: 0.15rem;
}

.guest-field dt {
  font-size: 0.75rem;
  color: #6b7280;
}

.guest-field dd {
  margin: 0;
  color: #1f2937;
}
</style>
