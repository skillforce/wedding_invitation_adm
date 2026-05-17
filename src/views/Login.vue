<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Button from 'primevue/button'
import LoginForm from '@/components/login/LoginForm.vue'
import ForgotPasswordForm from '@/components/login/ForgotPasswordForm.vue'
import InfoMessage from '@/components/shared/InfoMessage.vue'
import { useAuthStore } from '@/stores/auth'
import { useAppCommonStore } from '@/stores/app_common'
import { resetAllStores } from '@/stores/resetAllStores'
import { AppRoute } from '@/constants/app'

type LoginState = 'login' | 'forgot' | 'forgot-sent'

const router = useRouter()
const authStore = useAuthStore()
const appCommon = useAppCommonStore()
const { t } = useI18n()

onMounted(resetAllStores)

const state = ref<LoginState>('login')
const isLoading = ref(false)

async function onLogin(loginOrEmail: string, password: string) {
  isLoading.value = true
  try {
    await authStore.login(loginOrEmail, password)
    await router.push(AppRoute.Guests)
  } catch (error) {
    appCommon.showError(error)
  } finally {
    isLoading.value = false
  }
}

async function onForgotSubmit(email: string) {
  isLoading.value = true
  try {
    await authStore.forgotPassword(email)
    state.value = 'forgot-sent'
  } catch (error) {
    appCommon.showError(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <Card class="login-card">
      <template #title>
        {{ state === 'login' ? t('auth.signInTitle') : t('forgotPassword.title') }}
      </template>
      <template #content>
        <LoginForm
          v-if="state === 'login'"
          :is-loading="isLoading"
          @submit="onLogin"
          @forgot-password="state = 'forgot'"
        />

        <ForgotPasswordForm
          v-else-if="state === 'forgot'"
          :loading="isLoading"
          @submit="onForgotSubmit"
          @back="state = 'login'"
        />

        <InfoMessage v-else :message="t('forgotPassword.successMessage')">
          <Button variant="link" :label="t('forgotPassword.backToLogin')" @click="state = 'login'" />
        </InfoMessage>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.login-page {
  height: 100dvh;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: var(--color-login-gradient);
}

.login-card {
  width: 100%;
  max-width: 440px;
  border-radius: 8px;
}

</style>
