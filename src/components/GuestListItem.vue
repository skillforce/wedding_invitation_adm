<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GuestsViewDto } from '@/api/guests'
import personIconUrl from '@/assets/person.svg'

const props = defineProps<{
  guest: GuestsViewDto
  viewMode: 'grid' | 'list'
}>()
const { t } = useI18n()

const drinksText = computed(() => {
  if (!props.guest.preferred_drinks.length) {
    return t('guests.none')
  }

  return props.guest.preferred_drinks.join(', ')
})

const otherPreferencesText = computed(
  () => props.guest.other_preferences?.trim() || t('guests.none'),
)
</script>

<template>
  <article :class="['guest-item', viewMode === 'grid' ? 'guest-item--grid' : 'guest-item--list']">
    <header class="guest-header">
      <img :src="personIconUrl" :alt="t('a11y.guestAvatar')" class="avatar-image" />
      <p class="guest-name">{{ guest.name }}</p>
    </header>

    <dl class="guest-details">
      <div class="guest-field">
        <dt>{{ t('guests.preferredDrinks') }}</dt>
        <dd class="guest-field-value">{{ drinksText }}</dd>
      </div>

      <div class="guest-field">
        <dt>{{ t('guests.otherPreferences') }}</dt>
        <dd class="guest-field-value">{{ otherPreferencesText }}</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.guest-item {
  min-height: 100%;
  border-radius: 10px;
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface);
  padding: 0.75rem;
  display: grid;
  gap: 0.75rem;
}

.guest-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.avatar-image {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  flex-shrink: 0;
  object-fit: cover;
  filter: var(--color-avatar-filter-soft);
}

.guest-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.guest-item--grid .guest-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.guest-details {
  margin: 0;
  display: grid;
  gap: 0.5rem;
}

.guest-field {
  display: grid;
  gap: 0.15rem;
  min-width: 0;
}

.guest-field dt {
  font-size: 1rem;
  color: var(--color-text-muted);
}

.guest-item--grid .guest-field dt {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.guest-field dd {
  margin: 0;
  color: var(--color-text-secondary);
}

.guest-item--grid .guest-field-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
