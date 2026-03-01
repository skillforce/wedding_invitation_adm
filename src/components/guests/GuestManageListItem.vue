<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import type { GuestDetailViewDto } from '@/api/guests.ts'
import { useAuthStore } from '@/stores/auth.ts'
import UserAvatar from '@/components/shared/UserAvatar.vue'

const props = defineProps<{
  guest: GuestDetailViewDto
}>()

const emit = defineEmits<{
  remove: [id: number]
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
  <div class="guest-row">
    <UserAvatar :size="28" :alt="t('a11y.guestAvatar')" class="guest-avatar" />
    <span class="guest-name">{{ guest.name }}</span>
    <span :class="['status-badge', guest.is_already_answered ? 'status--answered' : 'status--pending']">
      <span class="status-text">{{ guest.is_already_answered ? t('guests.answered') : t('guests.notAnswered') }}</span>
      <i v-if="!guest.is_already_answered" class="pi pi-clock status-icon" />
    </span>
    <Button
      class="link-btn"
      v-if="invitationUrl"
      :icon="copied ? 'pi pi-check' : 'pi pi-link'"
      size="small"
      :severity="copied ? 'success' : 'secondary'"
      text
      rounded
      :aria-label="t('a11y.copyInvitationLink')"
      @click="copyLink"
    />
    <Button
      class="link-btn"
      icon="pi pi-trash"
      size="small"
      severity="danger"
      text
      rounded
      :aria-label="t('a11y.removeGuest')"
      @click="emit('remove', guest.id)"
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

.status-badge {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
}

.status--answered {
  background: color-mix(in srgb, var(--p-green-500) 15%, transparent);
  color: var(--p-green-500);
}

.status--pending {
  background: color-mix(in srgb, var(--p-surface-400) 20%, transparent);
  color: var(--color-text-muted);
}

.status-icon {
  display: none;
  font-size: 0.75rem;
}

@media (max-width: 480px) {
  .status--pending .status-text {
    display: none;
  }

  .status--pending .status-icon {
    display: inline;
  }

  .status-badge {
    padding: 0.15rem 0.35rem;
  }
}

@media (max-width: 390px) {
  .guest-avatar{
    display: none;
  }
  .link-btn {
    width: 20px;
    height: 20px;
  }
}
</style>
