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
  border: 1px solid #2b3446;
  border-radius: 12px;
  background: #1b2433;
}

.avatar-image {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  flex-shrink: 0;
  object-fit: cover;
  filter: brightness(0) invert(1) opacity(0.6);
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
  color: #97a4bd;
}

.profile-login {
  color: #edf2ff;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
