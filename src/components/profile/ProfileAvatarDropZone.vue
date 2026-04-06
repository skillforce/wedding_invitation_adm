<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  imagePreview: string | null
  isUploading: boolean
}>()

const emit = defineEmits<{
  pick: []
  fileDrop: [file: File]
}>()

const { t } = useI18n()
const isDragging = ref(false)

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
  if (file) emit('fileDrop', file)
}
</script>

<template>
  <div
    class="drop-zone"
    :class="{ 'drop-zone--dragging': isDragging, 'drop-zone--has-image': imagePreview }"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="emit('pick')"
  >
    <div v-if="isUploading" class="drop-zone__uploading">
      <i class="pi pi-spin pi-spinner" />
      <span>{{ t('userProfile.uploadingImage') }}</span>
    </div>
    <template v-else>
      <template v-if="imagePreview">
        <img class="drop-zone__bg" :src="imagePreview" aria-hidden="true" />
        <div class="drop-zone__circle">
          <img
            :src="imagePreview"
            :alt="t('a11y.userAvatar')"
            class="drop-zone__circle-img"
          />
          <div class="drop-zone__circle-overlay">
            <i class="pi pi-pencil" />
          </div>
        </div>
      </template>
      <div v-else class="drop-zone__placeholder">
        <i class="pi pi-image drop-zone__icon" />
        <span class="drop-zone__hint">{{ t('userProfile.dropZoneHint') }}</span>
        <span class="drop-zone__or">{{ t('userProfile.or') }}</span>
        <span class="drop-zone__cta">{{ t('userProfile.chooseFile') }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.drop-zone {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 200px;
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

.drop-zone__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(18px) brightness(0.55);
  transform: scale(1.08);
  pointer-events: none;
}

.drop-zone__circle {
  position: relative;
  width: min(270px, 90%);
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.5);
}

.drop-zone__circle-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.drop-zone__circle-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.drop-zone:hover .drop-zone__circle-overlay {
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
</style>