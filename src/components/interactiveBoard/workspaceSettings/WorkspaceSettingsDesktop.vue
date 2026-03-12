<script setup lang="ts">
import Dialog from 'primevue/dialog'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Dialog
    :visible="open"
    modal
    dismissable-mask
    :draggable="false"
    :style="{ width: 'min(92vw, 680px)' }"
    class="workspace-settings-dialog"
    @update:visible="(value) => !value && emit('close')"
  >
    <slot />
  </Dialog>
</template>

<style scoped>
:deep(.workspace-settings-dialog .p-dialog) {
  border: 1px solid var(--board-toolbar-border);
  background: var(--color-surface);
}

:deep(.workspace-settings-dialog .p-dialog-header) {
  display: none;
}

:deep(.workspace-settings-dialog .p-dialog-content),
:deep(.workspace-settings-dialog .p-dialog-footer) {
  background: var(--color-surface);
  color: var(--color-text-primary);
}
</style>
