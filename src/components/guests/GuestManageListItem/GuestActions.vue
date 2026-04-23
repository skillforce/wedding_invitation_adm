<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import GuestResponseMark from '@/components/guests/GuestResponsePanel/GuestResponseMark.vue'
import { useAuthStore } from '@/stores/auth.ts'

const props = defineProps<{
  guestId: string
  guestName: string
  isAlreadyAnswered: boolean
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const { t } = useI18n()
const confirm = useConfirm()
const authStore = useAuthStore()
const copied = ref(false)

const invitationUrl = computed(() => authStore.user?.profile?.invitationUrl ?? '')

async function copyLink() {
  const url = `${invitationUrl.value.replace(/\/$/, '')}/${props.guestId}`
  await navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function confirmRemove() {
  confirm.require({
    header: t('guests.confirmDeleteHeader'),
    message: t('guests.confirmDeleteGuest', { name: props.guestName }),
    rejectLabel: t('guests.cancel'),
    acceptLabel: t('guests.delete'),
    acceptClass: 'p-button-danger',
    accept: () => emit('remove', props.guestId),
  })
}
</script>

<template>
  <GuestResponseMark
    :responded="isAlreadyAnswered"
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
    @click.stop="confirmRemove"
  />
</template>

<style scoped>
@media (max-width: 640px) {
  .link-btn {
    width: 20px;
    height: 20px;
  }
}
</style>
