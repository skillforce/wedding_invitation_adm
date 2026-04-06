<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfirm } from 'primevue/useconfirm'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import SessionItem from './SessionItem.vue'
import { SESSIONS_API, type AuthSessionDto } from '@/api/sessions'
import { useAppCommonStore } from '@/stores/app_common'

const { t } = useI18n()
const confirm = useConfirm()
const appCommon = useAppCommonStore()

const sessions = ref<AuthSessionDto[]>([])
const isLoading = ref(true)
const revokingId = ref<string | null>(null)
const isRevokingAll = ref(false)

const hasOtherSessions = computed(() => sessions.value.some((s) => !s.isCurrent))

async function loadSessions() {
  isLoading.value = true
  try {
    sessions.value = await SESSIONS_API.getSessions()
  } catch (err) {
    appCommon.showError(err)
  } finally {
    isLoading.value = false
  }
}

async function revokeSession(id: string) {
  revokingId.value = id
  try {
    await SESSIONS_API.deleteSession(id)
    sessions.value = sessions.value.filter((s) => s.id !== id)
    appCommon.showSuccess(t('userProfile.sessions.revokeSuccess'))
  } catch (err) {
    appCommon.showError(err)
  } finally {
    revokingId.value = null
  }
}

function confirmRevokeOther() {
  confirm.require({
    header: t('userProfile.sessions.signOutOtherConfirmHeader'),
    message: t('userProfile.sessions.signOutOtherConfirmMessage'),
    rejectLabel: t('userProfile.sessions.cancel'),
    acceptLabel: t('userProfile.sessions.confirmSignOut'),
    acceptClass: 'p-button-danger',
    accept: revokeOtherSessions,
  })
}

async function revokeOtherSessions() {
  isRevokingAll.value = true
  try {
    await SESSIONS_API.deleteOtherSessions()
    sessions.value = sessions.value.filter((s) => s.isCurrent)
    appCommon.showSuccess(t('userProfile.sessions.revokeOtherSuccess'))
  } catch (err) {
    appCommon.showError(err)
  } finally {
    isRevokingAll.value = false
  }
}

onMounted(loadSessions)
</script>

<template>
  <Card class="security-card">
    <template #content>
      <div class="security-header">
        <div>
          <p class="section-label">{{ t('userProfile.sessions.title') }}</p>
        </div>
        <Button
          v-if="!isLoading && hasOtherSessions"
          :label="t('userProfile.sessions.signOutOther')"
          :loading="isRevokingAll"
          severity="danger"
          outlined
          size="small"
          @click="confirmRevokeOther"
        />
      </div>

      <div v-if="isLoading" class="sessions-skeleton">
        <div v-for="n in 2" :key="n" class="skeleton-row">
          <Skeleton shape="circle" size="36px" />
          <div class="skeleton-text">
            <Skeleton height="14px" width="60%" />
            <Skeleton height="12px" width="40%" />
          </div>
        </div>
      </div>

      <div v-else-if="sessions.length === 0" class="sessions-empty">
        {{ t('userProfile.sessions.noOtherSessions') }}
      </div>

      <div v-else class="sessions-list">
        <SessionItem
          v-for="session in sessions"
          :key="session.id"
          :session="session"
          :is-revoking="revokingId === session.id"
          @revoke="revokeSession"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.security-card {
  width: 100%;
}

.security-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.section-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin: 0;
}

.sessions-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.25rem 0;
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.skeleton-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.sessions-empty {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  padding: 0.5rem 0;
}

.sessions-list {
  display: flex;
  flex-direction: column;
}
</style>