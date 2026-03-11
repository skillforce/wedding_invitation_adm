import type { GuestFormDto } from '@/api/guests'
import type { GuestProfileDraft, GuestVipFlag, ValidationField } from './types'

export function createEmptyGuestProfileDraft(): GuestProfileDraft {
  return {
    relationship_to_couple: null,
    age_group: null,
    has_kids_attending: null,
    personality_type: null,
    vip_selection_state: 'unset',
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
  draft.personality_type = guestForm.personality_type
  draft.vip_parents = guestForm.vip_parents
  draft.vip_grandparents = guestForm.vip_grandparents
  draft.vip_relatives = guestForm.vip_relatives

  const hasAnyVipFlag = guestForm.vip_parents || guestForm.vip_grandparents || guestForm.vip_relatives
  draft.vip_selection_state = hasAnyVipFlag ? 'selected' : 'none'
}

export function toggleVipFlag(draft: GuestProfileDraft, flag: GuestVipFlag) {
  if (draft.vip_selection_state === 'none') {
    draft.vip_selection_state = 'selected'
  }

  draft[flag] = !draft[flag]

  const hasAnyVipFlag = draft.vip_parents || draft.vip_grandparents || draft.vip_relatives
  draft.vip_selection_state = hasAnyVipFlag ? 'selected' : 'unset'
}

export function selectNoVipStatus(draft: GuestProfileDraft) {
  draft.vip_parents = false
  draft.vip_grandparents = false
  draft.vip_relatives = false
  draft.vip_selection_state = 'none'
}

export function isFieldInvalid(
  draft: GuestProfileDraft,
  hasAttemptedSubmit: boolean,
  field: ValidationField,
) {
  if (!hasAttemptedSubmit) return false

  switch (field) {
    case 'relationship_to_couple':
      return draft.relationship_to_couple === null
    case 'age_group':
      return draft.age_group === null
    case 'has_kids_attending':
      return draft.has_kids_attending === null
    case 'personality_type':
      return draft.personality_type === null
    case 'vip_status':
      return draft.vip_selection_state === 'unset'
  }
}

export function buildGuestForm(draft: GuestProfileDraft): GuestFormDto {
  return {
    relationship_to_couple: draft.relationship_to_couple!,
    age_group: draft.age_group!,
    has_kids_attending: draft.has_kids_attending!,
    personality_type: draft.personality_type!,
    vip_parents: draft.vip_parents,
    vip_grandparents: draft.vip_grandparents,
    vip_relatives: draft.vip_relatives,
  }
}
