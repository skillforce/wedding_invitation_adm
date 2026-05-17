<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { AppRoute } from '@/constants/app'
import SetPasswordForm from '@/components/auth/SetPasswordForm.vue'
import ConfirmSuccess from '@/components/confirmation/ConfirmSuccess.vue'
import ConfirmError from '@/components/confirmation/ConfirmError.vue'
import ConfirmNoToken from '@/components/confirmation/ConfirmNoToken.vue'

type State = 'set-password' | 'loading' | 'success' | 'error' | 'no-token'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const rawToken = route.query.token
const token = typeof rawToken === 'string' ? rawToken : null
const state = ref<State>(token ? 'set-password' : 'no-token')

async function handleSetPassword(password: string) {
  if (!token) return
  state.value = 'loading'
  try {
    await authStore.resetPassword(token, password)
    state.value = 'success'
  } catch(e:unknown) {
    state.value = 'error'
  }
}

function goToLogin() {
  router.push(AppRoute.Login)
}
</script>

<template>
  <div class="reset-page">
    <div class="reset-card">
      <SetPasswordForm
        v-if="state === 'set-password' || state === 'loading'"
        :title="t('resetPassword.title')"
        :description="t('resetPassword.description')"
        :loading="state === 'loading'"
        @submit="handleSetPassword"
      />
      <ConfirmSuccess
        v-else-if="state === 'success'"
        :title="t('resetPassword.successTitle')"
        :message="t('resetPassword.successMessage')"
        @go-to-login="goToLogin"
      />
      <ConfirmError
        v-else-if="state === 'error'"
        :title="t('resetPassword.errorTitle')"
        :message="t('resetPassword.errorMessage')"
        @go-to-login="goToLogin"
      />
      <ConfirmNoToken v-else @go-to-login="goToLogin" />
    </div>
  </div>
</template>

<style scoped>
.reset-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--color-bg, #f8f9fa);
}

.reset-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 400px;
  padding: 40px 32px;
  background: var(--color-sidebar-bg);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  box-shadow: var(--shadow-card);
  text-align: center;
}
</style>
