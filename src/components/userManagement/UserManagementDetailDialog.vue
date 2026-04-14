<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { useUsersStore } from '@/stores/users'
import { useAppCommonStore } from '@/stores/app_common'
import { useSelectedUser } from '@/composables/useSelectedUser'
import { AppRoute } from '@/constants/app'
import type { UsersViewDto } from '@/api/users'

defineProps<{ visible: boolean; user: UsersViewDto | null }>()
const emit = defineEmits<{ 'update:visible': [value: boolean] }>()

const { t } = useI18n()
const router = useRouter()
const confirm = useConfirm()
const store = useUsersStore()
const appCommon = useAppCommonStore()
const { editingUserId } = useSelectedUser()

const isResending = ref(false)

async function handleResend(user: UsersViewDto) {
  isResending.value = true
  try {
    await store.resendConfirmation(user.id)
    appCommon.showSuccess(t('userManagement.resendSuccess'))
  } catch {
    appCommon.showError(t('errors.userManagement.failedToResend'))
  } finally {
    isResending.value = false
  }
}

function handleEditProfile(user: UsersViewDto) {
  editingUserId.value = user.id
  emit('update:visible', false)
  router.push(AppRoute.UserProfile)
}

function handleDelete(user: UsersViewDto) {
  confirm.require({
    header: t('userManagement.deleteConfirmHeader'),
    message: t('userManagement.deleteConfirmMessage', { login: user.login }),
    acceptLabel: t('userManagement.deleteUser'),
    rejectLabel: t('userManagement.cancel'),
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await store.deleteUser(user.id)
        emit('update:visible', false)
        appCommon.showSuccess(t('userManagement.deleteSuccess'))
      } catch {
        appCommon.showError(t('errors.userManagement.failedToDelete'))
      }
    },
  })
}
</script>

<template>
  <Dialog
    :visible="visible"
    :header="user?.login"
    modal
    :breakpoints="{ '640px': '90vw' }"
    style="width: 400px"
    @update:visible="$emit('update:visible', $event)"
  >
    <div v-if="user" class="detail-content">
      <UserAvatar :src="user.profile.profileImg" :size="64" variant="default" />

      <div class="detail-fields">
        <div class="detail-row">
          <span class="detail-label">{{ t('userManagement.loginField') }}</span>
          <span class="detail-value">{{ user.login }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('userManagement.emailField') }}</span>
          <span class="detail-value">{{ user.profile.email ?? '—' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('userManagement.statusField') }}</span>
          <span
            class="status-badge"
            :class="user.profile.isConfirmed ? 'status-active' : 'status-pending'"
          >
            {{ user.profile.isConfirmed ? t('userManagement.statusActive') : t('userManagement.statusPending') }}
          </span>
        </div>
      </div>

      <div class="detail-actions">
        <Button
          :label="t('userManagement.editProfile')"
          icon="pi pi-user-edit"
          severity="secondary"
          @click="handleEditProfile(user)"
        />
        <Button
          v-if="!user.profile.isConfirmed"
          :label="t('userManagement.resendConfirmation')"
          icon="pi pi-envelope"
          severity="secondary"
          :loading="isResending"
          @click="handleResend(user)"
        />
        <Button
          :label="t('userManagement.deleteUser')"
          icon="pi pi-trash"
          severity="danger"
          outlined
          @click="handleDelete(user)"
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.detail-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 8px 0 4px;
}

.detail-fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  background: var(--color-bg, transparent);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.detail-label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  word-break: break-all;
}

.detail-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 3px 9px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-active {
  background: color-mix(in srgb, #22c55e 15%, transparent);
  color: #16a34a;
}

.status-pending {
  background: color-mix(in srgb, #f59e0b 15%, transparent);
  color: #b45309;
}
</style>