<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

defineEmits<{ 'go-to-login': [] }>()

const { t } = useI18n()
</script>

<template>
  <div class="icon-wrap icon-error">
    <i class="pi pi-times" />
  </div>
  <h1 class="card-title">{{ t('confirmEmail.errorTitle') }}</h1>
  <p class="card-text">{{ t('confirmEmail.errorMessage') }}</p>
  <Button :label="t('confirmEmail.goToLogin')" severity="secondary" @click="$emit('go-to-login')" />
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

.icon-error {
  background: color-mix(in srgb, #ef4444 12%, transparent);
  color: #dc2626;
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.card-text {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.6;
  max-width: 300px;
}
</style>