<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import InputWithError from '@/components/shared/InputWithError.vue'
import SkeletonBlock from '@/components/shared/SkeletonBlock.vue'
import { useAuthStore } from '@/stores/auth'
import { useAppCommonStore } from '@/stores/app_common'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { URL_RE, normStr } from '@/utils/validation'
import { toLocalDateStr } from '@/utils/date'
import type { ProfileDto } from '@/api/auth'
import type { UpdateProfileDto } from '@/api/profile'
import ProfileFieldsCardItem from './ProfileFieldsCardItem.vue'

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
const hasInvitationUrlField = computed(() => isSuperUser.value && isEditingPlainUser.value)
const hasWeddingDateField = computed(() => isEditingPlainUser.value || !isSuperUser.value)

const invitationUrl = ref('')
const weddingDate = ref<Date | null>(null)
const email = ref('')
const isSaving = ref(false)

const urlInputRef = ref<InstanceType<typeof InputWithError> | null>(null)

const urlDirty = ref(false)

function loadFromProfile(profile: ProfileDto | null | undefined) {
  if (!profile) return
  invitationUrl.value = profile.invitationUrl ?? ''
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
  return URL_RE.test(invitationUrl.value) ? '' : t('errors.userProfile.invalidUrl')
})

const isFormValid = computed(() => !urlDirty.value || !urlError.value)

const isUnchanged = computed(() => {
  const profile = props.overrideProfile ?? authStore.user?.profile
  if (!profile) return false
  const profileDateStr = profile.weddingDate?.slice(0, 10) ?? ''
  const formDateStr = weddingDate.value ? toLocalDateStr(weddingDate.value) : ''
  const urlUnchanged = !hasInvitationUrlField.value || normStr(invitationUrl.value) === normStr(profile.invitationUrl)
  const dateUnchanged = !hasWeddingDateField.value || formDateStr === profileDateStr
  return urlUnchanged && dateUnchanged
})

async function handleSave() {
  if (urlDirty.value) urlInputRef.value?.touch()
  if (!isFormValid.value || isUnchanged.value) return

  isSaving.value = true
  appCommon.showSpinner()
  try {
    const dto: UpdateProfileDto = {
      ...(hasInvitationUrlField.value && { invitationUrl: invitationUrl.value || null }),
      ...(hasWeddingDateField.value && { weddingDate: weddingDate.value ? toLocalDateStr(weddingDate.value) : null }),
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
        <ProfileFieldsCardItem
          v-if="hasInvitationUrlField"
          :label="t('userProfile.invitationUrlLabel')"
        >
          <InputWithError
            ref="urlInputRef"
            v-model="invitationUrl"
            :placeholder="t('userProfile.invitationUrlPlaceholder')"
            :invalid="urlDirty && Boolean(urlError)"
            :error-message="urlDirty ? urlError : ''"
            @input="urlDirty = true"
          />
        </ProfileFieldsCardItem>

        <ProfileFieldsCardItem
          v-if="hasWeddingDateField"
          :label="t('userProfile.weddingDateLabel')"
        >
          <DatePicker
            v-model="weddingDate"
            date-format="yy-mm-dd"
            :show-button-bar="true"
            :show-icon="true"
            :min-date="new Date()"
            class="date-picker"
            panel-class="my-datepicker-panel"
          />
        </ProfileFieldsCardItem>

        <ProfileFieldsCardItem :label="t('userProfile.emailLabel')">
          <InputText
            :model-value="email"
            :placeholder="t('userProfile.emailPlaceholder')"
            class="w-full"
            readonly
          />
        </ProfileFieldsCardItem>
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
