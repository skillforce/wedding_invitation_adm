<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import ChoicePills from './ChoicePills.vue'
import DialogFooter from './DialogFooter.vue'
import FieldCard from './FieldCard.vue'
import ProfileBanner from './ProfileBanner.vue'
import {
  buildGuestForm,
  createEmptyGuestProfileDraft,
  isFieldInvalid as isDraftFieldInvalid,
  selectNoVipStatus as applyNoVipStatus,
  syncDraftFromForm,
  toggleVipFlag as applyVipToggle,
} from './guestProfileDraft'
import { useGuestChoiceOptions, useGuestProfileOptions } from './profileOptions'
import type { GuestFormDto } from '@/api/guests'
import { useAppCommonStore } from '@/stores/app_common'
import { KidsOptionKey, ModalMode, ValidationField, VipOptionKey, VipSelectionState } from './types'
import type { GuestProfileDraft, GuestVipFlag } from './types'

const props = defineProps<{
  visible: boolean
  mode: ModalMode
  guestName: string
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
const { kidsOptions, vipOptions } = useGuestChoiceOptions(t, guestProfileDraft)

const isGuestProfileValid = computed(() => (
  guestProfileDraft.relationship_to_couple !== null
  && guestProfileDraft.age_group !== null
  && guestProfileDraft.has_kids_attending !== null
  && guestProfileDraft.personality_type !== null
  && guestProfileDraft.vip_selection_state !== VipSelectionState.Unset
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

function resetDraft() {
  Object.assign(guestProfileDraft, createEmptyGuestProfileDraft())
}

function handleHide() {
  hasAttemptedSubmit.value = false
  resetDraft()
}

function selectKidsOption(key: string) {
  guestProfileDraft.has_kids_attending = key === KidsOptionKey.Yes
  if (key === KidsOptionKey.Yes && guestProfileDraft.kids_count < 1) {
    guestProfileDraft.kids_count = 1
  }
}

function onKidsCountUpdate(value: number | null) {
  guestProfileDraft.kids_count = Math.max(1, value ?? 1)
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
        <FieldCard
          :label="t('guests.profile.relationshipLabel')"
          :invalid="isFieldInvalid(ValidationField.RelationshipToCouple)"
        >
          <Select
            v-model="guestProfileDraft.relationship_to_couple"
            :options="relationshipOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('guests.profile.selectPlaceholder')"
            :invalid="isFieldInvalid(ValidationField.RelationshipToCouple)"
            class="field-select"
          />
        </FieldCard>

        <FieldCard
          :label="t('guests.profile.ageLabel')"
          :invalid="isFieldInvalid(ValidationField.AgeGroup)"
        >
          <Select
            v-model="guestProfileDraft.age_group"
            :options="ageOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('guests.profile.selectPlaceholder')"
            :invalid="isFieldInvalid(ValidationField.AgeGroup)"
            class="field-select"
          />
        </FieldCard>

        <FieldCard
          :label="t('guests.profile.kidsLabel')"
          :invalid="isFieldInvalid(ValidationField.HasKidsAttending)"
        >
          <div class="kids-field-row">
            <ChoicePills :options="kidsOptions" @select="selectKidsOption" />
            <div v-if="guestProfileDraft.has_kids_attending" class="kids-count-row">
              <InputNumber
                input-id="kids-count-input"
                v-model="guestProfileDraft.kids_count"
                :min="1"
                :max="10"
                show-buttons
                class="kids-count-input"
                @update:model-value="onKidsCountUpdate"
              />
            </div>
          </div>
        </FieldCard>

        <FieldCard
          :label="t('guests.profile.personalityLabel')"
          :invalid="isFieldInvalid(ValidationField.PersonalityType)"
        >
          <Select
            v-model="guestProfileDraft.personality_type"
            :options="personalityOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('guests.profile.selectPlaceholder')"
            :invalid="isFieldInvalid(ValidationField.PersonalityType)"
            class="field-select"
          />
        </FieldCard>

        <FieldCard
          :label="t('guests.profile.vipLabel')"
          :invalid="isFieldInvalid(ValidationField.VipStatus)"
          wide
        >
          <ChoicePills :options="vipOptions" @select="selectVipOption" />
        </FieldCard>
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

.field-select {
  width: 100%;
}

.kids-field-row {
  display: flex;
  align-items: center;
  gap: 2.75rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.kids-count-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.kids-count-input {
  width: 80px;
}
.kids-count-input:deep(.p-inputnumber-input) {
  width: 90px;
  height: 40px;
}

@media (max-width: 640px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .kids-field-row {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .kids-count-row {
    gap: 0.45rem;
  }
}
</style>
