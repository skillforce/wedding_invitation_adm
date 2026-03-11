<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GuestDetailViewDto } from '@/api/guests'
import GuestResponseDropdown from '@/components/guests/GuestResponsePanel/GuestResponseDropdown.vue'
import GuestResponseEmpty from '@/components/guests/GuestResponsePanel/GuestResponseEmpty.vue'
import GuestResponseHeader from '@/components/guests/GuestResponsePanel/GuestResponseHeader.vue'
import GuestResponseSection from '@/components/guests/GuestResponsePanel/GuestResponseSection.vue'

const props = defineProps<{
  guest: GuestDetailViewDto | null
}>()

const { t } = useI18n()

const relationshipKeyMap = {
  bride_side: 'brideSide',
  groom_side: 'groomSide',
  mutual: 'mutual',
} as const

const ageKeyMap = {
  child: 'child',
  young: 'young',
  adult: 'adult',
  old: 'old',
} as const

const personalityKeyMap = {
  introvert: 'introvert',
  extrovert: 'extrovert',
  unknown: 'unknown',
} as const

const guestProfileFields = computed(() => {
  const form = props.guest?.guestForm
  if (!form) return []

  const vipLabels = [
    form.vip_parents ? t('guests.profile.vipOptions.parents') : null,
    form.vip_grandparents ? t('guests.profile.vipOptions.grandparents') : null,
    form.vip_relatives ? t('guests.profile.vipOptions.relatives') : null,
  ].filter((value): value is string => Boolean(value))

  return [
    {
      label: t('guests.profile.relationshipLabel'),
      value: t(`guests.profile.relationshipOptions.${relationshipKeyMap[form.relationship_to_couple]}`),
    },
    {
      label: t('guests.profile.ageLabel'),
      value: t(`guests.profile.ageOptions.${ageKeyMap[form.age_group]}`),
    },
    {
      label: t('guests.profile.kidsLabel'),
      value: form.has_kids_attending ? t('guests.yes') : t('guests.no'),
    },
    {
      label: t('guests.profile.personalityLabel'),
      value: t(`guests.profile.personalityOptions.${personalityKeyMap[form.personality_type]}`),
    },
    {
      label: t('guests.profile.vipLabel'),
      value: vipLabels.length ? vipLabels.join(', ') : t('guests.profile.vipOptions.none'),
    },
  ]
})

const responseFields = computed(() => {
  const response = props.guest?.response
  if (!response) return []

  const drinksText = response.preferred_drinks.join(', ') || t('guests.none')
  const plusOneText = response.plus_one
    ? response.plus_one_name || t('guests.yes')
    : t('guests.no')

  return [
    {
      label: t('guests.preferredDrinks'),
      value: drinksText,
      marked: response.preferred_drinks.length > 0,
    },
    {
      label: t('guests.otherPreferences'),
      value: response.other_preferences || t('guests.none'),
      marked: Boolean(response.other_preferences),
    },
    {
      label: t('guests.plusOne'),
      value: plusOneText,
      marked: response.plus_one,
    },
  ]
})
</script>

<template>
  <aside class="response-panel">
    <template v-if="guest">
      <GuestResponseHeader :guest="guest" />
      <GuestResponseSection :fields="guestProfileFields" />
      <GuestResponseDropdown
        :responded="guest.is_already_answered"
        :fields="responseFields"
      />
    </template>
    <GuestResponseEmpty v-else />
  </aside>
</template>

<style scoped>
.response-panel {
  border-radius: 24px;
  border: 1px solid color-mix(in srgb, var(--color-border-strong) 70%, transparent);
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--p-primary-300) 16%, transparent), transparent 34%),
    linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 92%, white), var(--color-surface));
  padding: 1.1rem;
  box-shadow: var(--shadow-card);
  display: grid;
  gap: 1rem;
  position: sticky;
  top: 1rem;
}

@media (max-width: 900px) {
  .response-panel {
    position: static;
  }
}
</style>
