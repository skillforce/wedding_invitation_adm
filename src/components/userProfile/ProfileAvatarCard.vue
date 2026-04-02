<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import SkeletonBlock from '@/components/shared/SkeletonBlock.vue'
import { useAuthStore } from '@/stores/auth'
import { useAppCommonStore } from '@/stores/app_common'
import { ApiError } from '@/api/consts'

defineProps<{ pending?: boolean }>()

const { t } = useI18n()
const authStore = useAuthStore()
const appCommon = useAppCommonStore()

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
const MAX_FILE_SIZE = 15 * 1024 * 1024

const imagePreview = ref<string | null>(null)
const isDragging = ref(false)
const isUploading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  imagePreview.value = authStore.user?.profile?.profileImg ?? null
})

function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) return t('errors.userProfile.imageTooLarge')
  if (!ALLOWED_MIME_TYPES.includes(file.type)) return t('errors.userProfile.imageInvalidType')
  return null
}

async function handleFile(file: File) {
  const error = validateFile(file)
  if (error) {
    appCommon.showError(new ApiError(error))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  isUploading.value = true
  appCommon.showSpinner()
  try {
    await authStore.uploadProfileImage(file)
    imagePreview.value = authStore.user?.profile?.profileImg ?? imagePreview.value
    appCommon.showSuccess(t('userProfile.uploadSuccess'))
  } catch (err) {
    appCommon.showError(err)
  } finally {
    isUploading.value = false
    appCommon.hideSpinner()
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) handleFile(file)
}

function onFileInputChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
  ;(e.target as HTMLInputElement).value = ''
}

function openFilePicker() {
  fileInputRef.value?.click()
}
</script>

<template>
  <Card class="avatar-card">
    <template #content>
      <p class="section-label">{{ t('userProfile.avatarSection') }}</p>

      <SkeletonBlock v-if="pending" class="avatar-skeleton" height="auto" border-radius="12px" />

      <div
        v-else
        class="drop-zone"
        :class="{ 'drop-zone--dragging': isDragging, 'drop-zone--has-image': imagePreview }"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
        @click="openFilePicker"
      >
        <div v-if="isUploading" class="drop-zone__uploading">
          <i class="pi pi-spin pi-spinner" />
          <span>{{ t('userProfile.uploadingImage') }}</span>
        </div>
        <template v-else>
          <img
            v-if="imagePreview"
            :src="imagePreview"
            :alt="t('a11y.userAvatar')"
            class="drop-zone__preview"
          />
          <div v-else class="drop-zone__placeholder">
            <i class="pi pi-image drop-zone__icon" />
            <span class="drop-zone__hint">{{ t('userProfile.dropZoneHint') }}</span>
            <span class="drop-zone__or">{{ t('userProfile.or') }}</span>
            <span class="drop-zone__cta">{{ t('userProfile.chooseFile') }}</span>
          </div>
          <div v-if="imagePreview" class="drop-zone__overlay">
            <i class="pi pi-pencil" />
          </div>
        </template>
      </div>

      <template v-if="!pending">
        <p class="format-hint">{{ t('userProfile.allowedFormats') }}</p>
        <input
          ref="fileInputRef"
          type="file"
          :accept="ALLOWED_MIME_TYPES.join(',')"
          class="visually-hidden"
          @change="onFileInputChange"
        />
      </template>
    </template>
  </Card>
</template>

<style scoped>
.avatar-card {
  width: 100%;
}

.avatar-skeleton {
  width: 100%;
  aspect-ratio: 1 / 1;
}

.section-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin: 0 0 0.75rem;
}

.drop-zone {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  border: 2px dashed var(--color-border-strong);
  background: var(--color-surface-soft);
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.drop-zone:hover {
  border-color: var(--p-primary-400);
  background: color-mix(in srgb, var(--p-primary-400) 8%, var(--color-surface-soft));
}

.drop-zone--dragging {
  border-color: var(--p-primary-400);
  background: color-mix(in srgb, var(--p-primary-400) 14%, var(--color-surface-soft));
}

.drop-zone__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 1rem;
  pointer-events: none;
  text-align: center;
}

.drop-zone__icon {
  font-size: 2rem;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}

.drop-zone__hint {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.drop-zone__or {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.drop-zone__cta {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--p-primary-400);
  text-decoration: underline;
}

.drop-zone__preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.drop-zone__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.drop-zone:hover .drop-zone__overlay {
  opacity: 1;
}

.drop-zone__uploading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  pointer-events: none;
}

.drop-zone__uploading .pi {
  font-size: 1.5rem;
}

.format-hint {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-align: center;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>