import type {
  GuestAgeGroup,
  GuestPersonalityType,
  GuestRelationshipToCouple,
} from '@/api/guests'

export type SelectOption<T extends string> = {
  label: string
  value: T
}

export type ChoiceOption = {
  key: string
  label: string
  active: boolean
}

export type GuestVipFlag = 'vip_parents' | 'vip_grandparents' | 'vip_relatives'

export type ValidationField =
  | 'relationship_to_couple'
  | 'age_group'
  | 'has_kids_attending'
  | 'personality_type'
  | 'vip_status'

export type ModalMode = 'create' | 'edit'

export type GuestProfileDraft = {
  relationship_to_couple: GuestRelationshipToCouple | null
  age_group: GuestAgeGroup | null
  has_kids_attending: boolean | null
  personality_type: GuestPersonalityType | null
  vip_selection_state: 'unset' | 'none' | 'selected'
  vip_parents: boolean
  vip_grandparents: boolean
  vip_relatives: boolean
}
