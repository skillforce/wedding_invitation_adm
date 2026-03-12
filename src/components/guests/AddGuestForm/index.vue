<script setup lang="ts">
import { computed, ref } from 'vue'
import AddForm from './AddForm.vue'
import EditStrip from './EditStrip.vue'
import GuestProfileDialog from './GuestProfileDialog.vue'
import type { GuestDetailViewDto, GuestFormDto, NewGuestPayload } from '@/api/guests'
import { useAppCommonStore } from '@/stores/app_common'
import { ModalMode } from './types'

const props = defineProps<{
  isAdding: boolean
  isUpdating: boolean
  editingGuest: GuestDetailViewDto | null
}>()

const emit = defineEmits<{
  add: [payload: NewGuestPayload]
  update: [payload: { id: string; payload: GuestFormDto }]
}>()

const appCommon = useAppCommonStore()

const newGuestName = ref('')
const isProfileModalVisible = ref(false)
const modalMode = ref(ModalMode.Create)

const trimmedGuestName = computed(() => newGuestName.value.trim())
const canEditSelectedGuest = computed(() => Boolean(props.editingGuest?.guestForm))

const isAddGuestButtonDisabled = computed(() => {
  const nameLength = trimmedGuestName.value.length
  return nameLength < 3 || nameLength > 20 || props.isAdding
})

const dialogGuestName = computed(() => (
  modalMode.value === ModalMode.Edit ? (props.editingGuest?.name ?? '') : trimmedGuestName.value
))

function openCreateProfileModal() {
  if (isAddGuestButtonDisabled.value) return
  appCommon.clearError()
  modalMode.value = ModalMode.Create
  isProfileModalVisible.value = true
}

function openEditProfileModal() {
  if (!props.editingGuest?.guestForm) return
  appCommon.clearError()
  modalMode.value = ModalMode.Edit
  isProfileModalVisible.value = true
}

function handleProfileSubmit(guestForm: GuestFormDto) {
  if (modalMode.value === ModalMode.Edit) {
    if (!props.editingGuest) return
    emit('update', { id: props.editingGuest.id, payload: guestForm })
    return
  }

  const guest_name = trimmedGuestName.value
  if (guest_name.length < 3 || guest_name.length > 20) return

  emit('add', { guest_name, guestForm })
  newGuestName.value = ''
}
</script>

<template>
  <div class="guest-form-shell">
    <AddForm
      v-model="newGuestName"
      :is-adding="isAdding"
      :disabled="isAddGuestButtonDisabled"
      @submit="openCreateProfileModal"
    />

    <EditStrip
      v-if="editingGuest"
      :guest-name="editingGuest.name"
      :can-edit="canEditSelectedGuest"
      :is-updating="isUpdating"
      @edit="openEditProfileModal"
    />
  </div>

  <GuestProfileDialog
    v-model:visible="isProfileModalVisible"
    :mode="modalMode"
    :guest-name="dialogGuestName"
    :edit-guest-form="editingGuest?.guestForm"
    :is-adding="isAdding"
    :is-updating="isUpdating"
    @submit="handleProfileSubmit"
  />
</template>

<style scoped>
.guest-form-shell {
  display: grid;
  gap: 0.85rem;
}
</style>