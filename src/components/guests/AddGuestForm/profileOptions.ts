import { computed } from 'vue'
import type {
  GuestAgeGroup,
  GuestPersonalityType,
  GuestRelationshipToCouple,
} from '@/api/guests'
import { KidsOptionKey, VipOptionKey, VipSelectionState } from './types'
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
      key: KidsOptionKey.Yes,
      label: t('guests.yes'),
      active: guestProfileDraft.has_kids_attending === true,
    },
    {
      key: KidsOptionKey.No,
      label: t('guests.no'),
      active: guestProfileDraft.has_kids_attending === false,
    },
  ])

  const vipOptions = computed<ChoiceOption[]>(() => [
    {
      key: VipOptionKey.None,
      label: t('guests.profile.vipOptions.none'),
      active: guestProfileDraft.vip_selection_state === VipSelectionState.None,
    },
    {
      key: VipOptionKey.Parents,
      label: t('guests.profile.vipOptions.parents'),
      active: guestProfileDraft.vip_parents,
    },
    {
      key: VipOptionKey.Grandparents,
      label: t('guests.profile.vipOptions.grandparents'),
      active: guestProfileDraft.vip_grandparents,
    },
    {
      key: VipOptionKey.Relatives,
      label: t('guests.profile.vipOptions.relatives'),
      active: guestProfileDraft.vip_relatives,
    },
  ])

  return {
    kidsOptions,
    vipOptions,
  }
}