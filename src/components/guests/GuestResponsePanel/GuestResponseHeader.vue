<script setup lang="ts">
import type { GuestDetailViewDto } from '@/api/guests'
import { useI18n } from 'vue-i18n'
import GuestResponseMark from '@/components/guests/GuestResponsePanel/GuestResponseMark.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'

defineProps<{
  guest: GuestDetailViewDto
}>()

const { t } = useI18n()
</script>

<template>
  <header class="response-header">
    <div class="response-identity">
      <UserAvatar :size="44" :alt="t('a11y.guestAvatar')" />
      <div>
        <p class="response-kicker">{{ t('guests.responsePanel.kicker') }}</p>
        <h2 class="response-name">{{ guest.name }}</h2>
      </div>
    </div>

    <GuestResponseMark :responded="guest.is_already_answered" variant="badge" />
  </header>
</template>

<style scoped>
.response-header,
.response-identity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.response-identity {
  justify-content: flex-start;
  min-width: 0;
}

.response-identity > div {
  min-width: 0;
}

.response-kicker {
  margin: 0 0 0.2rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-text-muted);
}

.response-name {
  margin: 0;
  font-size: 1.4rem;
  line-height: 1.05;
  color: var(--color-title);

  min-width: 0;
}

@media (max-width: 480px) {
  .response-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
