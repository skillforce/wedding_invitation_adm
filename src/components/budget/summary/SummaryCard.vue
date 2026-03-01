<script setup lang="ts">
defineProps<{ label: string; icon?: string; iconColor?: string }>()
</script>

<template>
  <div class="card-header">
    <div class="card-header-main">
      <i v-if="icon" :class="icon" class="card-icon" :style="iconColor ? { color: iconColor } : {}" />
      <span class="card-label">{{ label }}</span>
    </div>
    <div class="card-header-end">
      <slot name="header-end" />
    </div>
  </div>
  <slot />
</template>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.55rem;
}

.card-header-main {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
  flex: 1;
}

.card-header-end {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
}

.card-icon {
  font-size: var(--summary-icon-font-size, 0.85rem);
  flex-shrink: 0;
  opacity: 0.75;
}

.card-label {
  font-size: var(--summary-label-size, 0.8rem);
  font-weight: 600;
  line-height: 1.25;
  color: var(--color-text-secondary, #6b7280);
  flex: 1;
  min-width: 0;
}

@media (max-width: 400px) {
  .card-header {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .card-header-end {
    flex-basis: 100%;
    justify-content: flex-start;
  }
}
</style>
