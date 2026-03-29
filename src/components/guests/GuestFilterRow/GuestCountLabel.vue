<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import coupleIconUrl from '@/assets/couple.svg'
import childIconUrl from '@/assets/child.svg'

const { t } = useI18n()

const props = defineProps<{
  label: string
  partnerPlusCount?: number
  kidsPlusCount?: number
}>()

const badges = computed(() => [
  { key: 'couple', iconUrl: coupleIconUrl, count: props.partnerPlusCount, label: t('guests.badgePartners'), modifier: 'badge--couple' },
  { key: 'kids',   iconUrl: childIconUrl,  count: props.kidsPlusCount,    label: t('guests.badgeKids'),     modifier: 'badge--kids'   },
].filter(b => b.count && b.count > 0))
</script>

<template>
  <div class="guest-count-row">
    <span class="guest-count-label">{{ label }}</span>

    <span
      v-for="badge in badges"
      :key="badge.key"
      class="guest-count-badge"
      :class="badge.modifier"
    >
      <img :src="badge.iconUrl" class="badge-icon" alt="" aria-hidden="true" loading="lazy" />
      <span class="badge-count">+{{ badge.count }}</span>
      <span class="badge-label">{{ badge.label }}</span>
    </span>
  </div>
</template>

<style scoped>
.guest-count-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.guest-count-label {
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--color-border-strong) 60%, transparent);
  background: color-mix(in srgb, var(--color-surface) 90%, white);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-title);
  white-space: nowrap;
}

.guest-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem 0.4rem 0.5rem;
  border-radius: 999px;
  border: 1.5px solid transparent;
  font-weight: 700;
  white-space: nowrap;
  font-size: 0.88rem;
  line-height: 1;
}

.badge-icon {
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
}

.badge-count {
  font-size: 0.9rem;
  font-weight: 800;
}

.badge-label {
  font-size: 0.78rem;
  font-weight: 600;
  opacity: 0.85;
  letter-spacing: 0.01em;
}

/* Couple badge — warm rose */
.badge--couple {
  background: color-mix(in srgb, var(--p-rose-100, #ffe4e6) 80%, transparent);
  border-color: color-mix(in srgb, var(--p-rose-300, #fda4af) 70%, transparent);
  color: var(--p-rose-700, #be123c);
}

.badge--couple .badge-icon {
  filter: invert(17%) sepia(85%) saturate(2000%) hue-rotate(330deg) brightness(80%) contrast(95%);
}

/* Kids badge — warm amber */
.badge--kids {
  background: color-mix(in srgb, var(--p-amber-100, #fef3c7) 80%, transparent);
  border-color: color-mix(in srgb, var(--p-amber-300, #fcd34d) 70%, transparent);
  color: var(--p-amber-700, #b45309);
}

.badge--kids .badge-icon {
  filter: invert(38%) sepia(60%) saturate(800%) hue-rotate(15deg) brightness(85%) contrast(95%);
}

/* Larger screens — slightly bigger */
@media (min-width: 1024px) {
  .guest-count-label {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }

  .guest-count-badge {
    font-size: 0.95rem;
    padding: 0.48rem 0.9rem 0.48rem 0.65rem;
  }

  .badge-icon {
    width: 1.45rem;
    height: 1.45rem;
  }

  .badge-count {
    font-size: 1rem;
  }

  .badge-label {
    font-size: 0.85rem;
  }
}

/* Mobile — hide text label, keep icon + count readable */
@media (max-width: 480px) {
  .guest-count-row {
    gap: 0.4rem;
  }

  .badge-label {
    display: none;
  }

  .guest-count-badge {
    padding: 0.38rem 0.6rem;
    gap: 0.28rem;
  }

  .badge-icon {
    width: 1.1rem;
    height: 1.1rem;
  }
}
</style>
