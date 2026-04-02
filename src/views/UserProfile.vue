<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProfileAvatarCard from '@/components/userProfile/ProfileAvatarCard.vue'
import ProfileFieldsCard from '@/components/userProfile/ProfileFieldsCard.vue'
import { useAuthStore } from '@/stores/auth'
import { useAppCommonStore } from '@/stores/app_common'

const { t } = useI18n()
const authStore = useAuthStore()
const appCommon = useAppCommonStore()

const isPending = ref(true)

onMounted(async () => {
  try {
    if (!authStore.user) await authStore.fetchMe()
  } catch (err) {
    appCommon.showError(err)
  } finally {
    isPending.value = false
  }
})
</script>

<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">{{ t('userProfile.title') }}</h1>
    </div>

    <div class="profile-content">
      <ProfileAvatarCard :pending="isPending" />
      <ProfileFieldsCard :pending="isPending" />
    </div>
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
  grid-template-columns: 280px 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}
</style>
