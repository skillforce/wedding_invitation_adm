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

export enum ModalMode {
  Create = 'create',
  Edit = 'edit',
}

export enum KidsOptionKey {
  Yes = 'yes',
  No = 'no',
}

export enum VipOptionKey {
  None = 'none',
  Parents = 'vip_parents',
  Grandparents = 'vip_grandparents',
  Relatives = 'vip_relatives',
}

export enum VipSelectionState {
  Unset = 'unset',
  None = 'none',
  Selected = 'selected',
}

export enum CoupleOptionKey {
  Yes = 'yes',
  No = 'no',
}

export enum CoupleGuestListOptionKey {
  Yes = 'yes',
  No = 'no',
}

export enum ValidationField {
  RelationshipToCouple = 'relationship_to_couple',
  AgeGroup = 'age_group',
  HasKidsAttending = 'has_kids_attending',
  PersonalityType = 'personality_type',
  VipStatus = 'vip_status',
  IfWithCouple = 'if_with_couple',
  CoupleAlreadyInList = 'couple_already_in_list',
  CoupleId = 'couple_id',
}

export type GuestVipFlag = VipOptionKey.Parents | VipOptionKey.Grandparents | VipOptionKey.Relatives

export type GuestProfileDraft = {
  relationship_to_couple: GuestRelationshipToCouple | null
  age_group: GuestAgeGroup | null
  has_kids_attending: boolean | null
  amount_of_kids: number | null
  personality_type: GuestPersonalityType | null
  vip_selection_state: VipSelectionState
  vip_parents: boolean
  vip_grandparents: boolean
  vip_relatives: boolean
  if_with_couple: boolean | null
  couple_already_in_guest_list: boolean | null
  couple_id: string | null
}
