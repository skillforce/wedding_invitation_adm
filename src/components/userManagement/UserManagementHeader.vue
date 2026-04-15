<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

defineProps<{ userCount: number }>()
defineEmits<{ 'add-user': [] }>()

const { t } = useI18n()
</script>

<template>
  <header class="page-header">
    <div class="bg-layers" aria-hidden="true">
      <div class="bg-grid" />
      <div class="bg-glow" />
      <div class="bg-vignette" />
    </div>

    <div class="header-content">
      <div class="eyebrow-row">
        <span class="eyebrow">
          <span class="eyebrow-pulse" />
          {{ t('userManagement.eyebrow') }}
        </span>
        <Button
          class="add-btn"
          :label="t('userManagement.addUser')"
          icon="pi pi-plus"
          @click="$emit('add-user')"
        />
      </div>

      <div class="title-block">
        <h1 class="title">{{ t('userManagement.title') }}</h1>
        <p class="subtitle">{{ t('userManagement.subtitle', { count: userCount }) }}</p>
      </div>
    </div>
  </header>
</template>

<style scoped>
.page-header {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border-bottom: 1px solid var(--color-border);
  padding: 40px 20px 28px;
  border-radius: 12px;
}

.bg-layers {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--color-hero-bg, var(--color-sidebar-bg));
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--p-primary-400, #a78bfa) 14%, transparent) 1px, transparent 0);
  background-size: 18px 18px;
  mask-image: radial-gradient(ellipse at 30% 0%, #000 25%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at 30% 0%, #000 25%, transparent 75%);
}

.bg-glow {
  position: absolute;
  top: -45%;
  right: -15%;
  width: 70%;
  height: 160%;
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--p-primary-400, #a78bfa) 28%, transparent) 0%,
    color-mix(in srgb, var(--p-primary-400, #a78bfa) 10%, transparent) 35%,
    transparent 65%
  );
  filter: blur(6px);
  pointer-events: none;
  animation: drift 14s ease-in-out infinite alternate;;
}

.bg-vignette {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 65%, rgba(0, 0, 0, 0.28) 100%);
  pointer-events: none;
}

@keyframes drift {
  from { transform: translate3d(-2%, 0, 0) scale(1); }
  to   { transform: translate3d(3%, -3%, 0) scale(1.08); }
}

.header-content {
  max-width: 720px;
  margin: 0 auto;
  position: relative;
}

.eyebrow-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  animation: rise 0.7s 0.05s both cubic-bezier(0.22, 1, 0.36, 1);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(18px, 3vw, 20px);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--p-primary-400, #a78bfa);
}

.eyebrow-pulse {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--p-primary-400, #a78bfa);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--p-primary-400, #a78bfa) 55%, transparent);
  animation: pulse 2.6s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--p-primary-400, #a78bfa) 55%, transparent); }
  50%      { box-shadow: 0 0 0 8px color-mix(in srgb, var(--p-primary-400, #a78bfa) 0%, transparent); }
}

.title-block {
  animation: rise 0.8s 0.15s both cubic-bezier(0.22, 1, 0.36, 1);
}

.title {
  font-size: clamp(30px, 5.6vw, 46px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--color-text-strong);
  margin: 0;
}

.subtitle {
  margin: 10px 0 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-size: 15px;
  letter-spacing: 0.01em;
  color: var(--color-text-secondary);
}

.add-btn :deep(.p-button) {
  background: color-mix(in srgb, var(--p-primary-400, #a78bfa) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--p-primary-400, #a78bfa) 45%, transparent);
  color: var(--p-primary-300, #c4b5fd);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  border-radius: 999px;
  backdrop-filter: blur(8px);
  transition: background 0.22s ease, border-color 0.22s ease, color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease;
}

.add-btn :deep(.p-button:hover) {
  background: color-mix(in srgb, var(--p-primary-400, #a78bfa) 18%, transparent);
  border-color: color-mix(in srgb, var(--p-primary-400, #a78bfa) 80%, transparent);
  color: var(--p-primary-200, #ddd6fe);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--p-primary-400, #a78bfa) 10%, transparent);
  transform: translateY(-1px);
}

.add-btn :deep(.p-button:active) {
  transform: translateY(0);
}

.add-btn :deep(.p-button-icon) {
  font-size: 11px;
  margin-right: 6px;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .bg-glow,
  .eyebrow-pulse,
  .eyebrow-row,
  .title-block { animation: none; }
}

@media (max-width: 560px) {
  .page-header { padding: 28px 16px 22px; }
  .eyebrow-row { margin-bottom: 14px; }
  .subtitle { font-size: 14px; }
}

@media (max-width: 420px) {
  .eyebrow-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .eyebrow { align-self: flex-start; }
  .add-btn :deep(.p-button) { width: 100%; justify-content: center; }
}
</style>
