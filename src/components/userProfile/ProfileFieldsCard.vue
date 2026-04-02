<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import InputWithError from '@/components/shared/InputWithError.vue'
import PhoneInputWithError from '@/components/shared/PhoneInputWithError.vue'
import SkeletonBlock from '@/components/shared/SkeletonBlock.vue'
import { useAuthStore } from '@/stores/auth'
import { useAppCommonStore } from '@/stores/app_common'

defineProps<{ pending?: boolean }>()

const { t } = useI18n()
const authStore = useAuthStore()
const appCommon = useAppCommonStore()

const invitationUrl = ref('')
const weddingDate = ref<Date | null>(null)
const phoneNumber = ref<string | null>(null)
const email = ref('')
const isSaving = ref(false)
const isPhoneValid = ref(true)

const urlInputRef = ref<InstanceType<typeof InputWithError> | null>(null)
const emailInputRef = ref<InstanceType<typeof InputWithError> | null>(null)
const phoneInputRef = ref<InstanceType<typeof PhoneInputWithError> | null>(null)

onMounted(() => {
  const profile = authStore.user?.profile
  if (!profile) return
  invitationUrl.value = profile.invitationUrl ?? ''
  phoneNumber.value = profile.phoneNumber ?? ''
  email.value = profile.email ?? ''
  if (profile.weddingDate) {
    weddingDate.value = new Date(profile.weddingDate)
  }
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

const isFormValid = computed(() => !urlError.value && !emailError.value && !phoneError.value)

const isUnchanged = computed(() => {
  const profile = authStore.user?.profile
  if (!profile) return false
  const norm = (v: string | null | undefined) => v ?? ''
  const profileDateStr = profile.weddingDate
    ? new Date(profile.weddingDate).toISOString().slice(0, 10)
    : ''
  const formDateStr = weddingDate.value ? weddingDate.value.toISOString().slice(0, 10) : ''
  return (
    norm(invitationUrl.value) === norm(profile.invitationUrl) &&
    formDateStr === profileDateStr &&
    norm(phoneNumber.value) === norm(profile.phoneNumber) &&
    norm(email.value) === norm(profile.email)
  )
})

async function handleSave() {
  urlInputRef.value?.touch()
  emailInputRef.value?.touch()
  phoneInputRef.value?.touch()
  if (!isFormValid.value || isUnchanged.value) return

  isSaving.value = true
  appCommon.showSpinner()
  try {
    await authStore.updateProfile({
      invitationUrl: invitationUrl.value || null,
      weddingDate: weddingDate.value ? weddingDate.value.toISOString().slice(0, 10) : null,
      phoneNumber: phoneNumber.value ?? null,
      email: email.value || null,
    })
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
        <div class="form-field">
          <label class="field-label">{{ t('userProfile.invitationUrlLabel') }}</label>
          <InputWithError
            ref="urlInputRef"
            v-model="invitationUrl"
            :placeholder="t('userProfile.invitationUrlPlaceholder')"
            :invalid="Boolean(urlError)"
            :error-message="urlError"
          />
        </div>

        <div class="form-field">
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
            :invalid="Boolean(phoneError)"
            :error-message="phoneError"
            :pending="phoneNumber === null"
            @update:model-value="phoneNumber = $event"
            @validate="isPhoneValid = $event"
          />
        </div>

        <div class="form-field">
          <label class="field-label">{{ t('userProfile.emailLabel') }}</label>
          <InputWithError
            ref="emailInputRef"
            v-model="email"
            :placeholder="t('userProfile.emailPlaceholder')"
            :invalid="Boolean(emailError)"
            :error-message="emailError"
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