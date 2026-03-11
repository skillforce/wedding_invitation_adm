<script setup lang="ts">
defineProps<{
  kicker: string
  name: string
  description: string
}>()
</script>

<template>
  <div class="profile-banner">
    <span class="profile-kicker">{{ kicker }}</span>
    <strong class="profile-name">{{ name }}</strong>
    <p class="profile-copy">{{ description }}</p>
  </div>
</template>

<style scoped>
.profile-banner {
  padding: 1rem;
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--p-primary-300) 16%, transparent), transparent 38%),
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 90%, white), var(--color-surface));
  border: 1px solid color-mix(in srgb, var(--color-border-strong) 60%, transparent);
}

.profile-kicker {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
}

.profile-name {
  display: block;
  font-size: 1.2rem;
  color: var(--color-title);
}

.profile-copy {
  margin: 0.5rem 0 0;
  color: var(--color-text-secondary);
}
</style>
