<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import type { GuestDetailViewDto } from '@/api/guests.ts'
import GuestResponseMark from '@/components/guests/GuestResponsePanel/GuestResponseMark.vue'
import { useAuthStore } from '@/stores/auth.ts'
import UserAvatar from '@/components/shared/UserAvatar.vue'

const props = defineProps<{
  guest: GuestDetailViewDto
  isSelected: boolean
  number: number
}>()

const emit = defineEmits<{
  remove: [id: string]
  select: [id: string]
}>()

const { t } = useI18n()
const authStore = useAuthStore()
const copied = ref(false)

const invitationUrl = computed(() => authStore.user?.invitationUrl ?? '')

async function copyLink() {
  const url = `${invitationUrl.value.replace(/\/$/, '')}/${props.guest.id}`
  await navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div
    :class="['guest-row', isSelected && 'guest-row--selected']"
    role="button"
    tabindex="0"
    @click="emit('select', guest.id)"
    @keydown.enter.prevent="emit('select', guest.id)"
    @keydown.space.prevent="emit('select', guest.id)"
  >
    <span class="guest-number">{{ number }}</span>
    <UserAvatar :size="28" :alt="t('a11y.guestAvatar')" class="guest-avatar" />
    <span class="guest-name">{{ guest.name }}</span>
    <GuestResponseMark
      :responded="guest.is_already_answered"
      variant="badge"
      label-scope="guest"
      pending-icon="clock"
    />
    <Button
      class="link-btn"
      v-if="invitationUrl"
      :icon="copied ? 'pi pi-check' : 'pi pi-link'"
      size="small"
      :severity="copied ? 'success' : 'secondary'"
      text
      rounded
      :aria-label="t('a11y.copyInvitationLink')"
      @click.stop="copyLink"
    />
    <Button
      class="link-btn"
      icon="pi pi-trash"
      size="small"
      severity="danger"
      text
      rounded
      :aria-label="t('a11y.removeGuest')"
      @click.stop="emit('remove', guest.id)"
    />
  </div>
</template>

<style scoped>
.guest-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-strong);
  background: var(--color-surface);
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.guest-row:hover,
.guest-row:focus-visible {
  border-color: color-mix(in srgb, var(--p-primary-400) 55%, var(--color-border-strong));
  box-shadow: 0 12px 30px color-mix(in srgb, var(--p-primary-300) 12%, transparent);
  outline: none;
  transform: translateY(-1px);
}

.guest-row--selected {
  border-color: var(--p-primary-400);
  background: color-mix(in srgb, var(--p-primary-100) 20%, var(--color-surface));
}

.guest-number {
  min-width: 1.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-align: right;
  flex-shrink: 0;
}

.guest-name {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 480px) {
  .guest-row :deep(.response-mark--badge) {
    padding: 0.15rem 0.35rem;
  }

  .guest-row :deep(.response-mark--muted.response-mark--badge .response-mark__label) {
    display: none;
  }

  .guest-row :deep(.response-mark--muted.response-mark--badge) {
    gap: 0;
  }

  .guest-row :deep(.response-mark--muted.response-mark--badge .pi) {
    font-size: 0.75rem;
  }

  .guest-name {
    max-width: 140px;
  }
}

@media (max-width: 390px) {
  .guest-avatar {
    display: none;
  }

  .link-btn {
    width: 20px;
    height: 20px;
  }

  .guest-name {
    max-width: 100px;
  }
}
</style>
