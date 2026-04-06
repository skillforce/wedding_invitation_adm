<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  allowedMimeTypes: string[]
}>()

const emit = defineEmits<{
  select: [file: File]
}>()

const { t } = useI18n()
const fileInputRef = ref<HTMLInputElement | null>(null)

function open() {
  fileInputRef.value?.click()
}

function onChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('select', file);
  (e.target as HTMLInputElement).value = ''
}

defineExpose({ open })
</script>

<template>
  <p class="format-hint">{{ t('userProfile.allowedFormats') }}</p>
  <input
    ref="fileInputRef"
    type="file"
    :accept="props.allowedMimeTypes.join(',')"
    class="visually-hidden"
    @change="onChange"
  />
</template>

<style scoped>
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