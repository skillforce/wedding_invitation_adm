import type { GuestDetailViewDto } from '@/api/guests.ts'
import {
  GuestProfileFilterField,
  GuestVipFilterValue,
} from '@/components/guests/GuestFilterRow/types.ts'
import type { GuestProfileFilterValue } from '@/components/guests/GuestFilterRow/types.ts'

type T = (key: string) => string

export function getFieldOptions(t: T) {
  return [
    { label: t('guests.profile.relationshipLabel'), value: GuestProfileFilterField.RelationshipToCouple },
    { label: t('guests.profile.ageLabel'), value: GuestProfileFilterField.AgeGroup },
    { label: t('guests.profile.kidsLabel'), value: GuestProfileFilterField.HasKidsAttending },
    { label: t('guests.profile.personalityLabel'), value: GuestProfileFilterField.PersonalityType },
    { label: t('guests.profile.vipLabel'), value: GuestProfileFilterField.VipStatus },
    { label: t('guests.profile.withCoupleLabel'), value: GuestProfileFilterField.IfWithCouple },
  ]
}

export function getValueOptions(t: T, field: GuestProfileFilterField | null) {
  switch (field) {
    case GuestProfileFilterField.RelationshipToCouple:
      return [
        { label: t('guests.profile.relationshipOptions.brideSide'), value: 'bride_side' },
        { label: t('guests.profile.relationshipOptions.groomSide'), value: 'groom_side' },
        { label: t('guests.profile.relationshipOptions.mutual'), value: 'mutual' },
      ]
    case GuestProfileFilterField.AgeGroup:
      return [
        { label: t('guests.profile.ageOptions.child'), value: 'child' },
        { label: t('guests.profile.ageOptions.young'), value: 'young' },
        { label: t('guests.profile.ageOptions.adult'), value: 'adult' },
        { label: t('guests.profile.ageOptions.old'), value: 'old' },
      ]
    case GuestProfileFilterField.HasKidsAttending:
      return [
        { label: t('guests.yes'), value: true },
        { label: t('guests.no'), value: false },
      ]
    case GuestProfileFilterField.PersonalityType:
      return [
        { label: t('guests.profile.personalityOptions.introvert'), value: 'introvert' },
        { label: t('guests.profile.personalityOptions.extrovert'), value: 'extrovert' },
        { label: t('guests.profile.personalityOptions.unknown'), value: 'unknown' },
      ]
    case GuestProfileFilterField.VipStatus:
      return [
        { label: t('guests.profile.vipOptions.none'), value: GuestVipFilterValue.None },
        { label: t('guests.profile.vipOptions.parents'), value: GuestVipFilterValue.Parents },
        { label: t('guests.profile.vipOptions.grandparents'), value: GuestVipFilterValue.Grandparents },
        { label: t('guests.profile.vipOptions.relatives'), value: GuestVipFilterValue.Relatives },
      ]
    case GuestProfileFilterField.IfWithCouple:
      return [
        { label: t('guests.yes'), value: true },
        { label: t('guests.no'), value: false },
      ]
    default:
      return []
  }
}

export function matchesProfileFilter(
  guest: GuestDetailViewDto,
  field: GuestProfileFilterField,
  value: GuestProfileFilterValue,
): boolean {
  const form = guest.guestForm
  if (!form || value === null) return false

  switch (field) {
    case GuestProfileFilterField.RelationshipToCouple:
      return form.relationship_to_couple === value
    case GuestProfileFilterField.AgeGroup:
      return form.age_group === value
    case GuestProfileFilterField.HasKidsAttending:
      return form.has_kids_attending === value
    case GuestProfileFilterField.PersonalityType:
      return form.personality_type === value
    case GuestProfileFilterField.VipStatus:
      return value === GuestVipFilterValue.None
        ? !form.vip_parents && !form.vip_grandparents && !form.vip_relatives
        : (
          (value === GuestVipFilterValue.Parents && form.vip_parents)
          || (value === GuestVipFilterValue.Grandparents && form.vip_grandparents)
          || (value === GuestVipFilterValue.Relatives && form.vip_relatives)
        )
    case GuestProfileFilterField.IfWithCouple:
      return (form.ifWithCouple?.response ?? false) === value
  }
}
