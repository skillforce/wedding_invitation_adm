import type {
  GuestAgeGroup,
  GuestPersonalityType,
  GuestRelationshipToCouple
} from "@/api/guests.ts";


export enum GuestProfileFilterField {
  RelationshipToCouple = 'relationship_to_couple',
  AgeGroup = 'age_group',
  HasKidsAttending = 'has_kids_attending',
  PersonalityType = 'personality_type',
  VipStatus = 'vip_status',
  IfWithCouple = 'if_with_couple',
}

export enum GuestVipFilterValue {
  None = 'none',
  Parents = 'parents',
  Grandparents = 'grandparents',
  Relatives = 'relatives',
}

export type GuestProfileFilterValue =
  | GuestRelationshipToCouple
  | GuestAgeGroup
  | GuestPersonalityType
  | GuestVipFilterValue
  | boolean
  | null

export type GuestProfileFilterState = {
  field: GuestProfileFilterField | null
  value: GuestProfileFilterValue
}
