<script setup lang="ts">
defineProps<{
  icon?: string
  title?: string
  message: string
}>()
</script>

<template>
  <div class="info-message">
    <div class="info-icon">
      <i :class="icon ?? 'pi pi-envelope'" />
    </div>
    <h3 v-if="title" class="info-title">{{ title }}</h3>
    <p class="info-text">{{ message }}</p>
    <slot />
  </div>
</template>

<style scoped>
.info-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.info-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--p-primary-color) 15%, transparent);
  color: var(--p-primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.info-text {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
  max-width: 300px;
}
</style>