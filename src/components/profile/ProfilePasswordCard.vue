<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useAuthStore } from '@/stores/auth'
import { useAppCommonStore } from '@/stores/app_common'
import InfoMessage from '@/components/shared/InfoMessage.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const appCommon = useAppCommonStore()

const dialogVisible = ref(false)
const isLoading = ref(false)
const sent = ref(false)

const userEmail = computed(() => authStore.user?.profile.email ?? null)

function openDialog() {
  sent.value = false
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

async function sendResetLink() {
  if (!userEmail.value) return
  isLoading.value = true
  try {
    await authStore.forgotPassword(userEmail.value)
    sent.value = true
  } catch (err) {
    appCommon.showError(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Card class="password-card">
    <template #content>
      <div class="password-header">
        <p class="section-label">{{ t('userProfile.password.title') }}</p>
        <Button
          :label="t('userProfile.password.button')"
          severity="secondary"
          outlined
          size="small"
          @click="openDialog"
        />
      </div>
    </template>
  </Card>

  <Dialog
    v-model:visible="dialogVisible"
    :header="t('userProfile.password.dialogTitle')"
    modal
    :style="{ width: '360px' }"
  >
    <div v-if="!sent" class="dialog-body">
      <p class="dialog-description">{{ t('userProfile.password.dialogMessage') }}</p>
      <p v-if="userEmail" class="dialog-email">{{ userEmail }}</p>
      <p v-else class="dialog-no-email">{{ t('userProfile.password.noEmail') }}</p>
    </div>

    <InfoMessage v-else :message="t('userProfile.password.successMessage')" />

    <template #footer>
      <Button
        v-if="!sent"
        :label="t('userProfile.password.sendLink')"
        :loading="isLoading"
        :disabled="!userEmail"
        @click="sendResetLink"
      />
      <Button
        :label="t('userProfile.password.close')"
        severity="secondary"
        outlined
        @click="closeDialog"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.password-card {
  width: 100%;
}

.password-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.section-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin: 0;
}

.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 0.5rem;
}

.dialog-description {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
}

.dialog-email {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.dialog-no-email {
  font-size: 13px;
  color: var(--p-orange-500, #f97316);
  margin: 0;
}

</style>