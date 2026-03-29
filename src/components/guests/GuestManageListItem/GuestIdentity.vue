<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import UserAvatar from '@/components/shared/UserAvatar.vue'

const props = defineProps<{
  guestId: string
  name: string
  number: number
  extraCount?: number
  highlightQuery?: string
}>()

const { t } = useI18n()

const normalizedHighlightQuery = computed(() => props.highlightQuery?.trim() ?? '')
const highlightedGuestNameParts = computed(() => {
  const query = normalizedHighlightQuery.value
  const name = props.name

  if (!query) {
    return [{ text: name, highlighted: false }]
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const matcher = new RegExp(`(${escapedQuery})`, 'ig')
  const segments = name.split(matcher).filter(Boolean)

  if (segments.length === 1) {
    return [{ text: name, highlighted: false }]
  }

  return segments.map((segment) => ({
    text: segment,
    highlighted: segment.toLowerCase() === query.toLowerCase(),
  }))
})
</script>

<template>
  <span class="guest-number">{{ number }}</span>
  <UserAvatar :size="28" :alt="t('a11y.guestAvatar')" class="guest-avatar" />
  <span class="guest-name">
    <span
      v-for="(part, index) in highlightedGuestNameParts"
      :key="`${guestId}-${index}-${part.text}`"
      :class="['guest-name-part', { 'guest-name-part--highlighted': part.highlighted }]"
    >
      {{ part.text }}
    </span>
    <span v-if="extraCount && extraCount > 0" class="guest-extra-count">+{{ extraCount }}</span>
  </span>
</template>

<style scoped>
.guest-number {
  min-width: 1.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-align: right;
  flex-shrink: 0;
}

.guest-name {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
}

.guest-name-part--highlighted {
  background: color-mix(in srgb, #f7df6d 78%, white);
  color: #5b4600;
  border-radius: 0.28rem;
  padding: 0 0.12rem;
  box-shadow: 0 0 0 1px color-mix(in srgb, #e0b400 22%, transparent);
}

.guest-name-part {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.guest-extra-count {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 0.18rem 0.45rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--p-primary-100) 65%, white);
  border: 1px solid color-mix(in srgb, var(--p-primary-300) 50%, transparent);
  color: var(--p-primary-700);
  font-size: 0.76rem;
  font-weight: 800;
  line-height: 1;
}

@media (max-width: 480px) {
  .guest-name {
    max-width: 140px;
  }
}

@media (max-width: 390px) {
  .guest-avatar {
    display: none;
  }

  .guest-name {
    max-width: 100px;
  }
}
</style>
