<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import 'cropperjs/dist/cropper.css'
import 'vue-picture-cropper/style.css'
import VuePictureCropper, { type VuePictureCropperRefValue } from 'vue-picture-cropper'
import AvatarCropperFooter from './AvatarCropperFooter.vue'

const props = defineProps<{
  visible: boolean
  imageSrc: string
  fileName: string
}>()

const emit = defineEmits<{
  'update:visible': [val: boolean]
  crop: [file: File]
}>()

const { t } = useI18n()
const cropperRef = ref<VuePictureCropperRefValue | null>(null)
const isProcessing = ref(false)

const cropperOptions = {
  viewMode: 1 as const,
  dragMode: 'move' as const,
  aspectRatio: 1,
  autoCropArea: 0.7,
  responsive: true,
  restore: false,
  guides: true,
  center: true,
  highlight: true,
  cropBoxMovable: true,
  cropBoxResizable: true,
  toggleDragModeOnDblclick: false,
}

async function handleCrop() {
  if (!cropperRef.value?.cropper) return
  isProcessing.value = true
  try {
    const file = await cropperRef.value.cropper.getFile({ fileName: props.fileName })
    if (file) emit('crop', file)
    emit('update:visible', false)
  } finally {
    isProcessing.value = false
  }
}

function handleCancel() {
  emit('update:visible', false)
}

function rotateLeft() {
  cropperRef.value?.cropper?.rotate(-90)
}

function rotateRight() {
  cropperRef.value?.cropper?.rotate(90)
}
</script>

<template>
  <Dialog
    :visible="visible"
    :header="t('userProfile.cropDialog.title')"
    :modal="true"
    :closable="false"
    :draggable="false"
    :style="{ width: 'min(600px, 95vw)' }"
    :content-style="{ padding: 0, overflow: 'hidden', background: '#111' }"
    class="cropper-dialog"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="cropper-wrap">
      <VuePictureCropper
        ref="cropperRef"
        :img="imageSrc"
        :options="cropperOptions"
        :preset-mode="{ mode: 'round' }"
        :box-style="{ width: '100%', height: '100%' }"
      />
    </div>

    <template #footer>
      <AvatarCropperFooter
        :is-processing="isProcessing"
        @rotate-left="rotateLeft"
        @rotate-right="rotateRight"
        @cancel="handleCancel"
        @crop="handleCrop"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.cropper-wrap {
  width: 100%;
  height: min(420px, calc(100dvh - 180px));
}
</style>

<style>
@media (max-width: 600px) {
  .p-dialog.cropper-dialog {
    width: 100vw !important;
    max-width: 100vw !important;
    height: 100dvh !important;
    max-height: 100dvh !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }

  .p-dialog.cropper-dialog .p-dialog-content {
    flex: 1;
  }
}
</style>
