<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

const emit = defineEmits<{
  add: [name: string]
}>()

const { t } = useI18n()
const newGuestName = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function addGuest() {
  if (!newGuestName.value.trim()) return
  emit('add', newGuestName.value.trim())
  newGuestName.value = ''
  inputRef.value?.focus()
}

const isAddGuestBtnDisabled = !newGuestName.value.trim()
</script>

<template>
  <div class="add-seat-form">
    <input
      ref="inputRef"
      v-model="newGuestName"
      class="guest-input"
      :placeholder="t('seating.guestNamePlaceholder')"
      @keydown.enter="addGuest"
    />
    <Button
      icon="pi pi-user-plus"
      size="small"
      :disabled="isAddGuestBtnDisabled"
      :aria-label="t('a11y.addGuest')"
      @click="addGuest"
    />
  </div>
</template>

<style scoped>
.add-seat-form {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 2px;
}

.guest-input {
  flex: 1;
  min-width: 0;
  background: var(--board-guest-input-bg);
  border: 1px solid var(--board-guest-input-border);
  border-radius: 7px;
  padding: 7px 10px;
  color: var(--board-input-text);
  font-size: 16px;
  outline: none;
  transition: border-color 0.18s;
}

.guest-input:focus {
  border-color: var(--board-guest-input-focus);
}

.guest-input::placeholder {
  color: var(--board-placeholder);
}
</style>
