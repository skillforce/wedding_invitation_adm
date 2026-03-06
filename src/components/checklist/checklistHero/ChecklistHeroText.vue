<template>
  <div class="hero-text">
    <p class="hero-eyebrow">{{ t('checklist.eyebrow') }}</p>
    <h1 class="hero-title">
      <span class="hero-title-muted">{{ t('checklist.title_the') }}</span>
      {{ t('checklist.title_checklist') }}
    </h1>
    <p class="hero-sub">
      {{ t('checklist.tasks_progress', { done: doneCount, total: totalCount }) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  doneCount: number
  totalCount: number
}>()

const { t } = useI18n()
</script>

<style scoped>
.hero-text {
  flex: 1;
  min-width: 0;
}

.hero-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #7aad8c;
  margin-bottom: 6px;
}

.hero-title {
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 800;
  line-height: 1.1;
  color: var(--color-title);
  margin-bottom: 8px;
}

.hero-title-muted {
  color: var(--color-text-muted);
  font-weight: 400;
  margin-right: 8px;
}

.hero-sub {
  font-size: 14px;
  color: var(--color-text-muted);
}
</style>
