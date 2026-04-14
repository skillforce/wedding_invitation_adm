<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import SkeletonBlock from '@/components/shared/SkeletonBlock.vue'
import ProfileAvatarDropZone from './ProfileAvatarDropZone.vue'
import ProfileAvatarFileInput from './ProfileAvatarFileInput.vue'
import { useAuthStore } from '@/stores/auth'
import { useAppCommonStore } from '@/stores/app_common'
import { ApiError } from '@/api/consts'
import type { ProfileDto } from '@/api/auth'

const AvatarCropperDialog = defineAsyncComponent(
  () => import('./avatarCropper/AvatarCropperDialog.vue'),
)

const props = defineProps<{
  pending?: boolean
  // When set, this image URL is shown instead of the logged-in user's avatar.
  overrideProfileImg?: string | null
  // When set, called instead of authStore.uploadProfileImage.
  uploadFn?: (file: File) => Promise<ProfileDto>
}>()

const { t } = useI18n()
const authStore = useAuthStore()
const appCommon = useAppCommonStore()

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
const MAX_FILE_SIZE = 15 * 1024 * 1024

const imagePreview = ref<string | null>(null)
const isUploading = ref(false)
const fileInputRef = ref<InstanceType<typeof ProfileAvatarFileInput> | null>(null)

const cropperVisible = ref(false)
const cropperSrc = ref('')
const pendingFileName = ref('avatar.jpg')

onMounted(() => {
  imagePreview.value =
    props.overrideProfileImg !== undefined
      ? (props.overrideProfileImg ?? null)
      : (authStore.user?.profile?.profileImg ?? null)
})

function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) return t('errors.userProfile.imageTooLarge')
  if (!ALLOWED_MIME_TYPES.includes(file.type)) return t('errors.userProfile.imageInvalidType')
  return null
}

function openCropper(file: File) {
  const error = validateFile(file)
  if (error) {
    appCommon.showError(new ApiError(error))
    return
  }
  pendingFileName.value = file.name || 'avatar.jpg'
  const reader = new FileReader()
  reader.onload = (e) => {
    cropperSrc.value = e.target?.result as string
    cropperVisible.value = true
  }
  reader.readAsDataURL(file)
}

async function handleCroppedFile(file: File) {
  const previousImage = imagePreview.value
  isUploading.value = true
  appCommon.showSpinner()
  try {
    if (props.uploadFn) {
      const profile = await props.uploadFn(file)
      imagePreview.value = profile.profileImg ?? null
    } else {
      await authStore.uploadProfileImage(file)
      imagePreview.value = authStore.user?.profile?.profileImg ?? null
    }
    appCommon.showSuccess(t('userProfile.uploadSuccess'))
  } catch (err) {
    imagePreview.value = previousImage
    appCommon.showError(err)
  } finally {
    isUploading.value = false
    appCommon.hideSpinner()
  }
}

function openFilePicker() {
  fileInputRef.value?.open()
}
</script>

<template>
  <Card class="avatar-card">
    <template #content>
      <p class="section-label">{{ t('userProfile.avatarSection') }}</p>

      <SkeletonBlock v-if="pending" class="avatar-skeleton" height="auto" border-radius="12px" />

      <ProfileAvatarDropZone
        v-else
        :image-preview="imagePreview"
        :is-uploading="isUploading"
        @pick="openFilePicker"
        @file-drop="openCropper"
      />

      <ProfileAvatarFileInput
        v-if="!pending"
        ref="fileInputRef"
        :allowed-mime-types="ALLOWED_MIME_TYPES"
        @select="openCropper"
      />
    </template>
  </Card>

  <AvatarCropperDialog
    v-if="cropperSrc"
    v-model:visible="cropperVisible"
    :image-src="cropperSrc"
    :file-name="pendingFileName"
    @crop="handleCroppedFile"
  />
</template>

<style scoped>
.avatar-card {
  width: 100%;
  height: 100%;
}

:deep(.p-card-body),
:deep(.p-card-content) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.avatar-skeleton {
  width: 100%;
  flex: 1;
  min-height: 200px;
}

.section-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin: 0 0 0.75rem;
}
</style>