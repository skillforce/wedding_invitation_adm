<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="icon-wrap icon-loading">
    <i class="pi pi-spin pi-spinner" />
  </div>
  <p class="card-text">{{ t('confirmEmail.loading') }}</p>
</template>

<style scoped>
.icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 4px;
}

.icon-loading {
  background: color-mix(in srgb, var(--color-primary, #6366f1) 12%, transparent);
  color: var(--color-primary, #6366f1);
}

.card-text {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.6;
  max-width: 300px;
}
</style>