<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import type { AuthSessionDto } from '@/api/sessions'

const props = defineProps<{
  session: AuthSessionDto
  isRevoking: boolean
}>()

const emit = defineEmits<{
  revoke: [id: string]
}>()

const { t, locale } = useI18n()

const deviceLabel = computed(() =>
  props.session.deviceName ?? t('userProfile.sessions.unknownDevice'),
)

const deviceIcon = computed(() => {
  const name = props.session.deviceName?.toLowerCase() ?? ''
  if (name.includes('iphone') || name.includes('android')) return 'pi pi-mobile'
  if (name.includes('ipad')) return 'pi pi-tablet'
  return 'pi pi-desktop'
})

const lastActiveLabel = computed(() => {
  const date = new Date(props.session.lastActiveAt)
  return new Intl.DateTimeFormat(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
})
</script>

<template>
  <div class="session-item" :class="{ 'session-item--current': session.isCurrent }">
    <div class="session-item__icon-wrap">
      <i :class="deviceIcon" class="session-item__icon" />
    </div>

    <div class="session-item__info">
      <div class="session-item__name-row">
        <span class="session-item__name">{{ deviceLabel }}</span>
        <Tag
          v-if="session.isCurrent"
          :value="t('userProfile.sessions.currentDevice')"
          severity="success"
          class="session-item__badge"
        />
      </div>
      <span class="session-item__meta">
        {{ t('userProfile.sessions.lastActive') }}: {{ lastActiveLabel }}
      </span>
    </div>

    <Button
      v-if="!session.isCurrent"
      icon="pi pi-times"
      text
      rounded
      severity="danger"
      size="small"
      :loading="isRevoking"
      :aria-label="t('userProfile.sessions.revokeAriaLabel')"
      class="session-item__revoke"
      @click="emit('revoke', session.id)"
    />
  </div>
</template>

<style scoped>
.session-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.5rem;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.session-item:not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}

.session-item--current {
  background: var(--color-surface-section);
}

.session-item__icon-wrap {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.session-item__icon {
  font-size: 1rem;
  color: var(--color-text-muted);
}

.session-item__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.session-item__name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.session-item__name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.session-item__badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.45rem;
}

.session-item__meta {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.session-item__revoke {
  flex-shrink: 0;
}
</style>