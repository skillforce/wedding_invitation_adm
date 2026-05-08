<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import { useI18n } from 'vue-i18n'
import ConfirmDialog from 'primevue/confirmdialog'
import { useUsersStore } from '@/stores/users'
import { useAppCommonStore } from '@/stores/app_common'
import type { UsersViewDto } from '@/api/users'
import UserManagementHeader from '@/components/userManagement/UserManagementHeader.vue'
import UserManagementCreateDialog from '@/components/userManagement/UserManagementCreateDialog.vue'
import UserManagementDetailDialog from '@/components/userManagement/UserManagementDetailDialog.vue'
import UserManagementUserCard from '@/components/userManagement/UserManagementUserCard.vue'

const { t } = useI18n()
const store = useUsersStore()
const appCommon = useAppCommonStore()

const createDialogVisible = ref(false)
const detailUser = ref<UsersViewDto | null>(null)
const detailDialogVisible = ref(false)

function openDetail(user: UsersViewDto) {
  detailUser.value = user
  detailDialogVisible.value = true
}

onMounted(async () => {
  try {
    await store.fetchUsers()
  } catch {
    appCommon.showError(t('errors.userManagement.failedToLoad'))
  }
})

usePullToRefresh(() => store.fetchUsers())
</script>

<template>
  <div class="user-management-page">
    <UserManagementHeader
      :user-count="store.users.length"
      @add-user="createDialogVisible = true"
    />

    <main class="users-area">
      <div v-if="store.isLoading" class="empty-state">
        <i class="pi pi-spin pi-spinner" />
        <p>{{ t('userManagement.loading') }}</p>
      </div>

      <div v-else-if="store.users.length === 0" class="empty-state">
        <i class="pi pi-users" />
        <p>{{ t('userManagement.empty') }}</p>
      </div>

      <div v-else class="users-grid">
        <UserManagementUserCard
          v-for="user in store.users"
          :key="user.id"
          :user="user"
          @click="openDetail(user)"
        />
      </div>
    </main>

    <UserManagementCreateDialog v-model:visible="createDialogVisible" />
    <UserManagementDetailDialog v-model:visible="detailDialogVisible" :user="detailUser" />
    <ConfirmDialog :breakpoints="{ '640px': '80vw' }" />
  </div>
</template>

<style scoped>
.user-management-page {
  min-height: 100%;
}

.users-area {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-muted);
}

.empty-state i {
  font-size: 36px;
  display: block;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
}

.users-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (max-width: 768px) {
  .users-area { padding: 20px 16px 60px; }
}

@media (max-width: 480px) {
  .users-area { padding: 16px 12px 60px; }
}
</style>