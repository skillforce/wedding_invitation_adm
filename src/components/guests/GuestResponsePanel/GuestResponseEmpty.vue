<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="response-empty">
    <p class="response-kicker">{{ t('guests.responsePanel.kicker') }}</p>
    <h2 class="response-name">{{ t('guests.responsePanel.emptyTitle') }}</h2>
    <p class="response-empty-text">{{ t('guests.responsePanel.emptyDescription') }}</p>
  </div>
</template>

<style scoped>
.response-empty {
  min-height: 320px;
  display: grid;
  align-content: center;
  gap: 0.45rem;
}

.response-kicker {
  margin: 0 0 0.2rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-text-muted);
}

.response-name {
  margin: 0;
  font-size: 1.4rem;
  line-height: 1.05;
  color: var(--color-title);
}

.response-empty-text {
  margin: 0;
  color: var(--color-text-muted);
}
</style>
