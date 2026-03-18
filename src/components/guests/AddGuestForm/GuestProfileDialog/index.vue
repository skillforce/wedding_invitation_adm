<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import DialogFooter from '../DialogFooter.vue'
import ProfileBanner from '../ProfileBanner.vue'
import AgeFieldCard from './AgeFieldCard.vue'
import CoupleFieldCard from './CoupleFieldCard.vue'
import CoupleDetailsFieldCard from './CoupleDetailsFieldCard.vue'
import KidsFieldCard from './KidsFieldCard.vue'
import PersonalityFieldCard from './PersonalityFieldCard.vue'
import RelationshipFieldCard from './RelationshipFieldCard.vue'
import VipFieldCard from './VipFieldCard.vue'
import {
  buildGuestForm,
  createEmptyGuestProfileDraft,
  isFieldInvalid as isDraftFieldInvalid,
  selectNoVipStatus as applyNoVipStatus,
  syncDraftFromForm,
  toggleVipFlag as applyVipToggle,
} from '../guestProfileDraft'
import { useGuestChoiceOptions, useGuestProfileOptions } from '../profileOptions'
import type { GuestDetailViewDto, GuestFormDto } from '@/api/guests'
import { useAppCommonStore } from '@/stores/app_common'
import {
  CoupleGuestListOptionKey,
  CoupleOptionKey,
  KidsOptionKey,
  ModalMode,
  ValidationField,
  VipOptionKey,
  VipSelectionState,
} from '../types'
import type { GuestProfileDraft, GuestVipFlag } from '../types'

const props = defineProps<{
  visible: boolean
  mode: ModalMode
  guestName: string
  guests: GuestDetailViewDto[]
  editingGuestId?: string | null
  editGuestForm?: GuestFormDto | null
  isAdding: boolean
  isUpdating: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  submit: [guestForm: GuestFormDto]
}>()

const { t } = useI18n()
const appCommon = useAppCommonStore()

const hasAttemptedSubmit = ref(false)
const guestProfileDraft = reactive<GuestProfileDraft>(createEmptyGuestProfileDraft())
const { relationshipOptions, ageOptions, personalityOptions } = useGuestProfileOptions(t)
const { kidsOptions, coupleOptions, coupleGuestListOptions, vipOptions } = useGuestChoiceOptions(t, guestProfileDraft)

const isGuestProfileValid = computed(() => (
  guestProfileDraft.relationship_to_couple !== null
  && guestProfileDraft.age_group !== null
  && guestProfileDraft.has_kids_attending !== null
  && guestProfileDraft.personality_type !== null
  && guestProfileDraft.vip_selection_state !== VipSelectionState.Unset
  && guestProfileDraft.if_with_couple !== null
  && (
    guestProfileDraft.if_with_couple === false
    || (
      guestProfileDraft.couple_already_in_guest_list !== null
      && (
        guestProfileDraft.couple_already_in_guest_list === false
        || Boolean(guestProfileDraft.couple_id)
      )
    )
  )
))

const dialogTitle = computed(() => (
  props.mode === ModalMode.Edit ? t('guests.profile.editTitle') : t('guests.profile.modalTitle')
))

const dialogKicker = computed(() => (
  props.mode === ModalMode.Edit ? t('guests.profile.editKicker') : t('guests.profile.kicker')
))

const dialogDescription = computed(() => (
  props.mode === ModalMode.Edit ? t('guests.profile.editDescription') : t('guests.profile.description')
))

const coupleGuestOptions = computed(() => props.guests
  .filter((guest) => guest.id !== props.editingGuestId)
  .map((guest) => ({
    label: guest.name,
    value: guest.id,
  })))

function resetDraft() {
  Object.assign(guestProfileDraft, createEmptyGuestProfileDraft())
}

function handleHide() {
  hasAttemptedSubmit.value = false
  resetDraft()
}

function selectKidsOption(key: string) {
  guestProfileDraft.has_kids_attending = key === KidsOptionKey.Yes
  if (key === KidsOptionKey.Yes && (guestProfileDraft.amount_of_kids ?? 0) < 1) {
    guestProfileDraft.amount_of_kids = 1
  }
  if (key === KidsOptionKey.No) {
    guestProfileDraft.amount_of_kids = null
  }
}

function selectCoupleOption(key: string) {
  guestProfileDraft.if_with_couple = key === CoupleOptionKey.Yes

  if (!guestProfileDraft.if_with_couple) {
    guestProfileDraft.couple_already_in_guest_list = null
    guestProfileDraft.couple_id = null
  }
}

function selectCoupleGuestListOption(key: string) {
  guestProfileDraft.couple_already_in_guest_list = key === CoupleGuestListOptionKey.Yes

  if (!guestProfileDraft.couple_already_in_guest_list) {
    guestProfileDraft.couple_id = null
  }
}

function onKidsCountUpdate(value: number | null) {
  guestProfileDraft.amount_of_kids = Math.max(1, value ?? 1)
}

function selectVipOption(key: string) {
  if (key === VipOptionKey.None) {
    applyNoVipStatus(guestProfileDraft)
    return
  }
  applyVipToggle(guestProfileDraft, key as GuestVipFlag)
}

function isFieldInvalid(field: ValidationField) {
  return isDraftFieldInvalid(guestProfileDraft, hasAttemptedSubmit.value, field)
}

function handleSubmit() {
  hasAttemptedSubmit.value = true

  if (!isGuestProfileValid.value) {
    appCommon.showError(new Error('errors.guests.completeGuestProfile'))
    return
  }

  appCommon.clearError()
  emit('submit', buildGuestForm(guestProfileDraft))
  emit('update:visible', false)
  hasAttemptedSubmit.value = false
  resetDraft()
}

watch(
  () => props.visible,
  (visible) => {
    if (!visible) return
    hasAttemptedSubmit.value = false
    if (props.mode === ModalMode.Edit && props.editGuestForm) {
      syncDraftFromForm(guestProfileDraft, props.editGuestForm)
    } else {
      resetDraft()
    }
  },
)
</script>

<template>
  <Dialog
    :visible="visible"
    :header="dialogTitle"
    :style="{ width: 'min(720px, calc(100vw - 1.5rem))' }"
    class="guest-profile-dialog"
    modal
    @update:visible="emit('update:visible', $event)"
    @hide="handleHide"
  >
    <div class="profile-shell">
      <ProfileBanner
        :kicker="dialogKicker"
        :name="guestName"
        :description="dialogDescription"
      />

      <div class="profile-grid">
        <RelationshipFieldCard
          v-model="guestProfileDraft.relationship_to_couple"
          :options="relationshipOptions"
          :invalid="isFieldInvalid(ValidationField.RelationshipToCouple)"
        />

        <AgeFieldCard
          v-model="guestProfileDraft.age_group"
          :options="ageOptions"
          :invalid="isFieldInvalid(ValidationField.AgeGroup)"
        />

        <KidsFieldCard
          :has-kids-attending="guestProfileDraft.has_kids_attending"
          :amount-of-kids="guestProfileDraft.amount_of_kids"
          :options="kidsOptions"
          :invalid="isFieldInvalid(ValidationField.HasKidsAttending)"
          @select="selectKidsOption"
          @update:amount-of-kids="onKidsCountUpdate"
        />

        <PersonalityFieldCard
          v-model="guestProfileDraft.personality_type"
          :options="personalityOptions"
          :invalid="isFieldInvalid(ValidationField.PersonalityType)"
        />

        <CoupleFieldCard
          :couple-options="coupleOptions"
          :invalid="isFieldInvalid(ValidationField.IfWithCouple)"
          @select="selectCoupleOption"
        />
        <CoupleDetailsFieldCard
          v-if="guestProfileDraft.if_with_couple"
          :couple-already-in-guest-list="guestProfileDraft.couple_already_in_guest_list"
          :couple-id="guestProfileDraft.couple_id"
          :couple-guest-list-options="coupleGuestListOptions"
          :guest-options="coupleGuestOptions"
          :invalid-couple-already-in-list="isFieldInvalid(ValidationField.CoupleAlreadyInList)"
          :invalid-couple-id="isFieldInvalid(ValidationField.CoupleId)"
          @select="selectCoupleGuestListOption"
          @update:couple-id="guestProfileDraft.couple_id = $event"
        />
        <VipFieldCard
          :options="vipOptions"
          :invalid="isFieldInvalid(ValidationField.VipStatus)"
          @select="selectVipOption"
        />



      </div>
    </div>

    <template #footer>
      <DialogFooter
        :is-edit-mode="mode === ModalMode.Edit"
        :is-adding="isAdding"
        :is-updating="isUpdating"
        @cancel="emit('update:visible', false)"
        @confirm="handleSubmit"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.profile-shell {
  display: grid;
  gap: 1rem;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

@media (max-width: 640px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
