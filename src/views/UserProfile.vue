<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import ProfileAvatarCard from '@/components/profile/ProfileAvatarCard.vue'
import ProfileContextBanner from '@/components/profile/ProfileContextBanner.vue'
import ProfileFieldsCard from '@/components/profile/ProfileFieldsCard.vue'
import ProfileSecurityCard from '@/components/profile/ProfileSecurityCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useAppCommonStore } from '@/stores/app_common'
import { useUsersStore } from '@/stores/users'
import { useSelectedUser } from '@/composables/useSelectedUser'
import { AppRoute } from '@/constants/app'
import type { UpdateProfileDto } from '@/api/profile'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const appCommon = useAppCommonStore()
const usersStore = useUsersStore()
const { editingUserId } = useSelectedUser()

const isPending = ref(true)

const targetUser = computed(() =>
  editingUserId.value ? (usersStore.users.find((u) => u.id === editingUserId.value) ?? null) : null,
)

onMounted(async () => {
  try {
    if (!authStore.user) await authStore.fetchMe()
    if (editingUserId.value && usersStore.users.length === 0) {
      await usersStore.fetchUsers()
    }
  } catch (err) {
    appCommon.showError(err)
  } finally {
    isPending.value = false
  }
})

onBeforeRouteLeave(() => {
  editingUserId.value = null
})

function goBack() {
  router.push(AppRoute.UserManagement)
}

function makeSaveFn(userId: number) {
  return (dto: UpdateProfileDto) => usersStore.updateUserProfile(userId, dto)
}

function makeUploadFn(userId: number) {
  return (file: File) => usersStore.uploadUserProfileImage(userId, file)
}
</script>

<template>
  <div class="profile-page">
    <ProfileContextBanner v-if="targetUser" :login="targetUser.login" @back="goBack" />

    <div class="page-header">
      <h1 class="page-title">{{ t('userProfile.title') }}</h1>
    </div>
    <div class="profile-content">
      <ProfileAvatarCard
        :pending="isPending"
        :override-profile-img="targetUser ? targetUser.profile.profileImg : undefined"
        :upload-fn="targetUser ? makeUploadFn(targetUser.id) : undefined"
      />
      <ProfileFieldsCard
        :pending="isPending"
        :override-profile="targetUser ? targetUser.profile : undefined"
        :save-fn="targetUser ? makeSaveFn(targetUser.id) : undefined"
      />
    </div>
    <ProfileSecurityCard v-if="!targetUser" />
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
}

.page-header {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary);
}

.profile-content {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 1.5rem;
  align-items: stretch;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}
</style>
