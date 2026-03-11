<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import AddForm from './AddForm.vue'
import ChoicePills from './ChoicePills.vue'
import DialogFooter from './DialogFooter.vue'
import EditStrip from './EditStrip.vue'
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
import type { GuestDetailViewDto, GuestFormDto, NewGuestPayload, } from '@/api/guests.ts'
import { useAppCommonStore } from '@/stores/app_common.ts'
import type { GuestProfileDraft, GuestVipFlag, ModalMode, ValidationField } from './types'

const props = defineProps<{
  isAdding: boolean
  isUpdating: boolean
  editingGuest: GuestDetailViewDto | null
}>()

const emit = defineEmits<{
  add: [payload: NewGuestPayload]
  update: [payload: { id: string; payload: GuestFormDto }]
}>()

const { t } = useI18n()
const appCommon = useAppCommonStore()

const newGuestName = ref('')
const isProfileModalVisible = ref(false)
const hasAttemptedSubmit = ref(false)
const modalMode = ref<ModalMode>('create')

const guestProfileDraft = reactive<GuestProfileDraft>(createEmptyGuestProfileDraft())
const { relationshipOptions, ageOptions, personalityOptions } = useGuestProfileOptions(t)
const { kidsOptions, vipOptions } = useGuestChoiceOptions(t, guestProfileDraft)

const trimmedGuestName = computed(() => newGuestName.value.trim())
const canEditSelectedGuest = computed(() => Boolean(props.editingGuest?.guestForm))
const editingGuestName = computed(() => props.editingGuest?.name ?? '')

const isAddGuestButtonDisabled = computed(() => {
  const nameLength = trimmedGuestName.value.length
  return nameLength < 3 || nameLength > 20 || props.isAdding
})

const isGuestProfileValid = computed(() => (
  guestProfileDraft.relationship_to_couple !== null
  && guestProfileDraft.age_group !== null
  && guestProfileDraft.has_kids_attending !== null
  && guestProfileDraft.personality_type !== null
  && guestProfileDraft.vip_selection_state !== 'unset'
))

const dialogTitle = computed(() => (
  modalMode.value === 'edit' ? t('guests.profile.editTitle') : t('guests.profile.modalTitle')
))

const dialogKicker = computed(() => (
  modalMode.value === 'edit' ? t('guests.profile.editKicker') : t('guests.profile.kicker')
))

const dialogDescription = computed(() => (
  modalMode.value === 'edit' ? t('guests.profile.editDescription') : t('guests.profile.description')
))

const dialogName = computed(() => (
  modalMode.value === 'edit' ? editingGuestName.value : trimmedGuestName.value
))

function resetGuestProfileDraft() {
  Object.assign(guestProfileDraft, createEmptyGuestProfileDraft())
}

function openCreateProfileModal() {
  if (isAddGuestButtonDisabled.value) return

  appCommon.clearError()
  modalMode.value = 'create'
  hasAttemptedSubmit.value = false
  resetGuestProfileDraft()
  isProfileModalVisible.value = true
}

function openEditProfileModal() {
  if (!props.editingGuest?.guestForm) return

  appCommon.clearError()
  modalMode.value = 'edit'
  hasAttemptedSubmit.value = false
  syncDraftFromForm(guestProfileDraft, props.editingGuest.guestForm)
  isProfileModalVisible.value = true
}

function handleProfileModalHide() {
  hasAttemptedSubmit.value = false
  resetGuestProfileDraft()
}

function setKidsAttending(value: boolean) {
  guestProfileDraft.has_kids_attending = value
}

function selectKidsOption(key: string) {
  setKidsAttending(key === 'yes')
}

function toggleVipFlag(flag: GuestVipFlag) {
  applyVipToggle(guestProfileDraft, flag)
}

function selectNoVipStatus() {
  applyNoVipStatus(guestProfileDraft)
}

function selectVipOption(key: string) {
  if (key === 'none') {
    selectNoVipStatus()
    return
  }

  toggleVipFlag(key as GuestVipFlag)
}

function isFieldInvalid(field: ValidationField) {
  return isDraftFieldInvalid(guestProfileDraft, hasAttemptedSubmit.value, field)
}

function submitGuestProfile() {
  hasAttemptedSubmit.value = true

  if (!isGuestProfileValid.value) {
    appCommon.showError(new Error('errors.guests.completeGuestProfile'))
    return
  }

  appCommon.clearError()
  const guestForm = buildGuestForm(guestProfileDraft)

  if (modalMode.value === 'edit') {
    if (!props.editingGuest) return
    emit('update', { id: props.editingGuest.id, payload: guestForm })
    isProfileModalVisible.value = false
    return
  }

  const guest_name = trimmedGuestName.value
  if (guest_name.length < 3 || guest_name.length > 20) return

  emit('add', { guest_name, guestForm })
  newGuestName.value = ''
  isProfileModalVisible.value = false
  hasAttemptedSubmit.value = false
  resetGuestProfileDraft()
}

watch(
  () => props.editingGuest?.id,
  () => {
    if (modalMode.value === 'edit' && props.editingGuest?.guestForm) {
      syncDraftFromForm(guestProfileDraft, props.editingGuest.guestForm)
    }
  },
)
</script>

<template>
  <div class="guest-form-shell">
    <AddForm
      v-model="newGuestName"
      :is-adding="isAdding"
      :disabled="isAddGuestButtonDisabled"
      @submit="openCreateProfileModal"
    />

    <EditStrip
      v-if="editingGuest"
      :guest-name="editingGuest.name"
      :can-edit="canEditSelectedGuest"
      :is-updating="isUpdating"
      @edit="openEditProfileModal"
    />
  </div>

  <Dialog
    v-model:visible="isProfileModalVisible"
    :header="dialogTitle"
    :style="{ width: 'min(720px, calc(100vw - 1.5rem))' }"
    class="guest-profile-dialog"
    modal
    @hide="handleProfileModalHide"
  >
    <div class="profile-shell">
      <ProfileBanner
        :kicker="dialogKicker"
        :name="dialogName"
        :description="dialogDescription"
      />

      <div class="profile-grid">
        <FieldCard
          :label="t('guests.profile.relationshipLabel')"
          :invalid="isFieldInvalid('relationship_to_couple')"
        >
          <Select
            v-model="guestProfileDraft.relationship_to_couple"
            :options="relationshipOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('guests.profile.selectPlaceholder')"
            :invalid="isFieldInvalid('relationship_to_couple')"
            class="field-select"
          />
        </FieldCard>

        <FieldCard
          :label="t('guests.profile.ageLabel')"
          :invalid="isFieldInvalid('age_group')"
        >
          <Select
            v-model="guestProfileDraft.age_group"
            :options="ageOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('guests.profile.selectPlaceholder')"
            :invalid="isFieldInvalid('age_group')"
            class="field-select"
          />
        </FieldCard>

        <FieldCard
          :label="t('guests.profile.kidsLabel')"
          :invalid="isFieldInvalid('has_kids_attending')"
        >
          <ChoicePills :options="kidsOptions" @select="selectKidsOption" />
        </FieldCard>

        <FieldCard
          :label="t('guests.profile.personalityLabel')"
          :invalid="isFieldInvalid('personality_type')"
        >
          <Select
            v-model="guestProfileDraft.personality_type"
            :options="personalityOptions"
            option-label="label"
            option-value="value"
            :placeholder="t('guests.profile.selectPlaceholder')"
            :invalid="isFieldInvalid('personality_type')"
            class="field-select"
          />
        </FieldCard>

        <FieldCard
          :label="t('guests.profile.vipLabel')"
          :invalid="isFieldInvalid('vip_status')"
          wide
        >
          <ChoicePills :options="vipOptions" @select="selectVipOption" />
        </FieldCard>
      </div>
    </div>

    <template #footer>
      <DialogFooter
        :is-edit-mode="modalMode === 'edit'"
        :is-adding="isAdding"
        :is-updating="isUpdating"
        @cancel="isProfileModalVisible = false"
        @confirm="submitGuestProfile"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.guest-form-shell {
  display: grid;
  gap: 0.85rem;
}

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

@media (max-width: 640px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
