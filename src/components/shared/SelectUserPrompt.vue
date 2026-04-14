<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="select-user-prompt">
    <i class="pi pi-users prompt-icon" />
    <p class="prompt-title">{{ t('userSwitcher.promptTitle') }}</p>
    <p class="prompt-subtitle">{{ t('userSwitcher.promptSubtitle') }}</p>
  </div>
</template>

<style scoped>
.select-user-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 80px 24px;
  color: var(--color-text-muted);
  text-align: center;
}

.prompt-icon {
  font-size: 3rem;
  opacity: 0.35;
}

.prompt-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.prompt-subtitle {
  font-size: 0.9rem;
  margin: 0;
  max-width: 320px;
  line-height: 1.5;
}
</style>