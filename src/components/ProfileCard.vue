<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  login?: string
  imageUrl?: string
}>()

const hasImage = computed(() => Boolean(props.imageUrl))
const initial = computed(() => {
  if (!props.login) {
    return ''
  }

  return props.login.charAt(0).toUpperCase()
})
</script>

<template>
  <div class="profile-card">
    <img v-if="hasImage" :src="imageUrl" alt="User avatar" class="avatar-image" />
    <div v-else class="avatar-fallback">{{ initial }}</div>

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

.avatar-image,
.avatar-fallback {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  flex-shrink: 0;
}

.avatar-image {
  object-fit: cover;
}

.avatar-fallback {
  display: grid;
  place-items: center;
  background: #2a3a56;
  color: #dbeafe;
  font-weight: 700;
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
