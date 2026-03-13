import type { GuestFormDto } from '@/api/guests'
import { ValidationField, VipSelectionState } from './types'
import type { GuestProfileDraft, GuestVipFlag } from './types'

export function createEmptyGuestProfileDraft(): GuestProfileDraft {
  return {
    relationship_to_couple: null,
    age_group: null,
    has_kids_attending: null,
    amount_of_kids: null,
    personality_type: null,
    vip_selection_state: VipSelectionState.Unset,
    vip_parents: false,
    vip_grandparents: false,
    vip_relatives: false,
  }
}

export function syncDraftFromForm(draft: GuestProfileDraft, guestForm: GuestFormDto | null | undefined) {
  if (!guestForm) {
    Object.assign(draft, createEmptyGuestProfileDraft())
    return
  }

  draft.relationship_to_couple = guestForm.relationship_to_couple
  draft.age_group = guestForm.age_group
  draft.has_kids_attending = guestForm.has_kids_attending
  draft.amount_of_kids = guestForm.has_kids_attending ? (guestForm.amount_of_kids ?? 1) : null
  draft.personality_type = guestForm.personality_type
  draft.vip_parents = guestForm.vip_parents
  draft.vip_grandparents = guestForm.vip_grandparents
  draft.vip_relatives = guestForm.vip_relatives

  const hasAnyVipFlag = guestForm.vip_parents || guestForm.vip_grandparents || guestForm.vip_relatives
  draft.vip_selection_state = hasAnyVipFlag ? VipSelectionState.Selected : VipSelectionState.None
}

export function toggleVipFlag(draft: GuestProfileDraft, flag: GuestVipFlag) {
  if (draft.vip_selection_state === VipSelectionState.None) {
    draft.vip_selection_state = VipSelectionState.Selected
  }

  draft[flag] = !draft[flag]

  const hasAnyVipFlag = draft.vip_parents || draft.vip_grandparents || draft.vip_relatives
  draft.vip_selection_state = hasAnyVipFlag ? VipSelectionState.Selected : VipSelectionState.Unset
}

export function selectNoVipStatus(draft: GuestProfileDraft) {
  draft.vip_parents = false
  draft.vip_grandparents = false
  draft.vip_relatives = false
  draft.vip_selection_state = VipSelectionState.None
}

export function isFieldInvalid(
  draft: GuestProfileDraft,
  hasAttemptedSubmit: boolean,
  field: ValidationField,
) {
  if (!hasAttemptedSubmit) return false

  switch (field) {
    case ValidationField.RelationshipToCouple:
      return draft.relationship_to_couple === null
    case ValidationField.AgeGroup:
      return draft.age_group === null
    case ValidationField.HasKidsAttending:
      return draft.has_kids_attending === null
    case ValidationField.PersonalityType:
      return draft.personality_type === null
    case ValidationField.VipStatus:
      return draft.vip_selection_state === VipSelectionState.Unset
  }
}

export function buildGuestForm(draft: GuestProfileDraft): GuestFormDto {
  return {
    relationship_to_couple: draft.relationship_to_couple!,
    age_group: draft.age_group!,
    has_kids_attending: draft.has_kids_attending!,
    amount_of_kids: draft.has_kids_attending ? Math.max(1, draft.amount_of_kids ?? 1) : null,
    personality_type: draft.personality_type!,
    vip_parents: draft.vip_parents,
    vip_grandparents: draft.vip_grandparents,
    vip_relatives: draft.vip_relatives,
  }
}
