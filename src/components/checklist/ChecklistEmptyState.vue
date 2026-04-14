<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="empty-state">
    <i class="pi pi-search" />
    <p>{{ t('checklist.empty') }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-muted);
}

.empty-state i {
  font-size: 36px;
  display: block;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
}
</style>