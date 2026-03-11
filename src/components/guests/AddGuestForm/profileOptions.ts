import { computed } from 'vue'
import type {
  GuestAgeGroup,
  GuestPersonalityType,
  GuestFormDto,
  GuestRelationshipToCouple,
} from '@/api/guests'
import type { ChoiceOption, GuestProfileDraft, SelectOption } from './types'

export function useGuestProfileOptions(t: (key: string) => string) {
  const relationshipOptions = computed<SelectOption<GuestRelationshipToCouple>[]>(() => [
    { label: t('guests.profile.relationshipOptions.brideSide'), value: 'bride_side' },
    { label: t('guests.profile.relationshipOptions.groomSide'), value: 'groom_side' },
    { label: t('guests.profile.relationshipOptions.mutual'), value: 'mutual' },
  ])

  const ageOptions = computed<SelectOption<GuestAgeGroup>[]>(() => [
    { label: t('guests.profile.ageOptions.child'), value: 'child' },
    { label: t('guests.profile.ageOptions.young'), value: 'young' },
    { label: t('guests.profile.ageOptions.adult'), value: 'adult' },
    { label: t('guests.profile.ageOptions.old'), value: 'old' },
  ])

  const personalityOptions = computed<SelectOption<GuestPersonalityType>[]>(() => [
    { label: t('guests.profile.personalityOptions.introvert'), value: 'introvert' },
    { label: t('guests.profile.personalityOptions.extrovert'), value: 'extrovert' },
    { label: t('guests.profile.personalityOptions.unknown'), value: 'unknown' },
  ])

  return {
    relationshipOptions,
    ageOptions,
    personalityOptions,
  }
}

export function useGuestChoiceOptions(
  t: (key: string) => string,
  guestProfileDraft: GuestProfileDraft,
) {
  const kidsOptions = computed<ChoiceOption[]>(() => [
    {
      key: 'yes',
      label: t('guests.yes'),
      active: guestProfileDraft.has_kids_attending === true,
    },
    {
      key: 'no',
      label: t('guests.no'),
      active: guestProfileDraft.has_kids_attending === false,
    },
  ])

  const vipOptions = computed<ChoiceOption[]>(() => [
    {
      key: 'none',
      label: t('guests.profile.vipOptions.none'),
      active: guestProfileDraft.vip_selection_state === 'none',
    },
    {
      key: 'vip_parents',
      label: t('guests.profile.vipOptions.parents'),
      active: guestProfileDraft.vip_parents,
    },
    {
      key: 'vip_grandparents',
      label: t('guests.profile.vipOptions.grandparents'),
      active: guestProfileDraft.vip_grandparents,
    },
    {
      key: 'vip_relatives',
      label: t('guests.profile.vipOptions.relatives'),
      active: guestProfileDraft.vip_relatives,
    },
  ])

  return {
    kidsOptions,
    vipOptions,
  }
}
