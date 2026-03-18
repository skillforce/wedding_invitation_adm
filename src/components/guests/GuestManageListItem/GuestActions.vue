<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import GuestResponseMark from '@/components/guests/GuestResponsePanel/GuestResponseMark.vue'
import { useAuthStore } from '@/stores/auth.ts'

const props = defineProps<{
  guestId: string
  isAlreadyAnswered: boolean
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const { t } = useI18n()
const authStore = useAuthStore()
const copied = ref(false)

const invitationUrl = computed(() => authStore.user?.invitationUrl ?? '')

async function copyLink() {
  const url = `${invitationUrl.value.replace(/\/$/, '')}/${props.guestId}`
  await navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
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
    @click.stop="emit('remove', guestId)"
  />
</template>

<style scoped>
@media (max-width: 390px) {
  .link-btn {
    width: 20px;
    height: 20px;
  }
}
</style>