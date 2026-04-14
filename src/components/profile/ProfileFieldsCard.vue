<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import InputWithError from '@/components/shared/InputWithError.vue'
import PhoneInputWithError from '@/components/shared/PhoneInputWithError.vue'
import SkeletonBlock from '@/components/shared/SkeletonBlock.vue'
import { useAuthStore } from '@/stores/auth'
import { useAppCommonStore } from '@/stores/app_common'
import { useCurrentUser } from '@/composables/useCurrentUser'
import type { ProfileDto } from '@/api/auth'
import type { UpdateProfileDto } from '@/api/profile'

const props = defineProps<{
  pending?: boolean
  overrideProfile?: ProfileDto | null
  saveFn?: (dto: UpdateProfileDto) => Promise<ProfileDto>
}>()

const { t } = useI18n()
const authStore = useAuthStore()
const appCommon = useAppCommonStore()
const { isSuperUser } = useCurrentUser()

const isEditingPlainUser = computed(() => Boolean(props.overrideProfile))

const invitationUrl = ref('')
const weddingDate = ref<Date | null>(null)
const phoneNumber = ref<string | null>(null)
const email = ref('')
const isSaving = ref(false)
const isPhoneValid = ref(true)

const urlInputRef = ref<InstanceType<typeof InputWithError> | null>(null)
const emailInputRef = ref<InstanceType<typeof InputWithError> | null>(null)
const phoneInputRef = ref<InstanceType<typeof PhoneInputWithError> | null>(null)

const urlDirty = ref(false)
const emailDirty = ref(false)
const phoneDirty = ref(false)
const loadedPhoneNumber = ref<string | null>(null)

function loadFromProfile(profile: ProfileDto | null | undefined) {
  if (!profile) return
  invitationUrl.value = profile.invitationUrl ?? ''
  phoneNumber.value = profile.phoneNumber ?? ''
  loadedPhoneNumber.value = profile.phoneNumber ?? null
  email.value = profile.email ?? ''
  weddingDate.value = profile.weddingDate ? new Date(profile.weddingDate) : null
}

onMounted(() => {
  loadFromProfile(props.overrideProfile ?? authStore.user?.profile)
})

watch(() => props.overrideProfile, (profile) => {
  if (profile) loadFromProfile(profile)
})

const urlError = computed(() => {
  if (!invitationUrl.value) return ''
  return /^https?:\/\/.+/.test(invitationUrl.value) ? '' : t('errors.userProfile.invalidUrl')
})

const emailError = computed(() => {
  if (!email.value) return ''
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? '' : t('errors.userProfile.invalidEmail')
})

const phoneError = computed(() => {
  if (!phoneNumber.value) return ''
  return isPhoneValid.value ? '' : t('errors.userProfile.invalidPhone')
})

const isFormValid = computed(() =>
  (!urlDirty.value || !urlError.value) &&
  (!emailDirty.value || !emailError.value) &&
  (!phoneDirty.value || !phoneError.value)
)

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const isUnchanged = computed(() => {
  const profile = props.overrideProfile ?? authStore.user?.profile
  if (!profile) return false
  const norm = (v: string | null | undefined) => v ?? ''
  const profileDateStr = profile.weddingDate?.slice(0, 10) ?? ''
  const formDateStr = weddingDate.value ? toLocalDateStr(weddingDate.value) : ''
  const hasDateWeddingField = isEditingPlainUser.value || !isSuperUser.value
  const dateUnchanged = hasDateWeddingField
    ? norm(invitationUrl.value) === norm(profile.invitationUrl) && formDateStr === profileDateStr
    : true
  return (
    dateUnchanged &&
    norm(phoneDirty.value ? (phoneNumber.value || null) : loadedPhoneNumber.value) === norm(profile.phoneNumber) &&
    norm(email.value) === norm(profile.email)
  )
})

function onPhoneInput(value: string, isAutoFill: boolean) {
  phoneNumber.value = value
  if (!isAutoFill) phoneDirty.value = true
}

async function handleSave() {
  if (urlDirty.value) urlInputRef.value?.touch()
  if (emailDirty.value) emailInputRef.value?.touch()
  if (phoneDirty.value) phoneInputRef.value?.touch()
  if (!isFormValid.value || isUnchanged.value) return

  isSaving.value = true
  appCommon.showSpinner()
  try {
    const dto: UpdateProfileDto = {
      ...((!isSuperUser.value || isEditingPlainUser.value) && {
        invitationUrl: invitationUrl.value || null,
        weddingDate: weddingDate.value ? toLocalDateStr(weddingDate.value) : null,
      }),
      phoneNumber: phoneDirty.value ? (phoneNumber.value || null) : loadedPhoneNumber.value,
      email: email.value || null,
    }
    if (props.saveFn) {
      await props.saveFn(dto)
    } else {
      await authStore.updateProfile(dto)
    }
    appCommon.showSuccess(t('userProfile.saveSuccess'))
  } catch (err) {
    appCommon.showError(err)
  } finally {
    isSaving.value = false
    appCommon.hideSpinner()
  }
}
</script>

<template>
  <Card class="fields-card">
    <template #content>
      <SkeletonBlock v-if="pending" height="320px" />

      <div v-else class="form-fields">
        <div v-if="!isSuperUser || isEditingPlainUser" class="form-field">
          <label class="field-label">{{ t('userProfile.invitationUrlLabel') }}</label>
          <InputWithError
            ref="urlInputRef"
            v-model="invitationUrl"
            :placeholder="t('userProfile.invitationUrlPlaceholder')"
            :invalid="urlDirty && Boolean(urlError)"
            :error-message="urlDirty ? urlError : ''"
            @input="urlDirty = true"
          />
        </div>

        <div v-if="!isSuperUser || isEditingPlainUser" class="form-field">
          <label class="field-label">{{ t('userProfile.weddingDateLabel') }}</label>
          <DatePicker
            v-model="weddingDate"
            date-format="yy-mm-dd"
            :show-button-bar="true"
            :show-icon="true"
            :min-date="new Date()"
            class="date-picker"
            panel-class="my-datepicker-panel"
          />
        </div>

        <div class="form-field">
          <label class="field-label">{{ t('userProfile.phoneNumberLabel') }}</label>
          <PhoneInputWithError
            ref="phoneInputRef"
            :model-value="phoneNumber ?? ''"
            :placeholder="t('userProfile.phoneNumberPlaceholder')"
            :invalid="phoneDirty && Boolean(phoneError)"
            :error-message="phoneDirty ? phoneError : ''"
            :pending="phoneNumber === null"
            @update:model-value="onPhoneInput"
            @validate="isPhoneValid = $event"
          />
        </div>

        <div class="form-field">
          <label class="field-label">{{ t('userProfile.emailLabel') }}</label>
          <InputWithError
            ref="emailInputRef"
            v-model="email"
            :placeholder="t('userProfile.emailPlaceholder')"
            :invalid="emailDirty && Boolean(emailError)"
            :error-message="emailDirty ? emailError : ''"
            @input="emailDirty = true"
          />
        </div>
      </div>

      <Button
        v-if="!pending"
        class="save-btn"
        :label="isSaving ? t('userProfile.saving') : t('userProfile.saveButton')"
        :loading="isSaving"
        :disabled="isSaving || isUnchanged"
        @click="handleSave"
      />
    </template>
  </Card>
</template>

<style scoped>
.fields-card {
  width: 100%;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.date-picker {
  width: 100%;
}

:global(.my-datepicker-panel) {
  max-width: 400px !important;
  min-width: 200px !important;
}

.save-btn {
  margin-top: 1.5rem;
  width: 100%;
}
</style>
