<script setup lang="ts">
import personIconUrl from '@/assets/person.svg'

defineProps<{
  login?: string
}>()
</script>

<template>
  <div class="profile-card">
    <img :src="personIconUrl" alt="User avatar" class="avatar-image" />

    <div class="profile-text">
      <p class="profile-label">Logged as</p>
      <p class="profile-login">{{ login || 'Unknown user' }}</p>
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
