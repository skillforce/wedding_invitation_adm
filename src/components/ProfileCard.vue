<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import personIconUrl from '@/assets/person.svg'

defineProps<{
  login?: string
  collapsed?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <div :class="['profile-card', { collapsed }]">
    <img :src="personIconUrl" :alt="t('a11y.userAvatar')" class="avatar-image" />
    <div v-if="!collapsed" class="profile-text">
      <p class="profile-label">{{ t('profile.loggedAs') }}</p>
      <p class="profile-login">{{ login || t('profile.unknownUser') }}</p>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--color-profile-border);
  border-radius: 12px;
  background: var(--color-surface-soft);
}

.profile-card.collapsed {
  padding: 0.45rem;
}

.avatar-image {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  flex-shrink: 0;
  object-fit: cover;
  filter: var(--color-avatar-filter);
}

.profile-text {
  min-width: 0;
}

.profile-label,
.profile-login {
  margin: 0;
}

.profile-label {
  font-size: 0.75rem;
  color: var(--color-text-subtle);
}

.profile-login {
  color: var(--color-text-strong);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
