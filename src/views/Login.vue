<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import LoginForm from '@/components/login/LoginForm.vue'
import { useAuthStore } from '@/stores/auth'
import { useAppCommonStore } from '@/stores/app_common'
import { AppRoute } from '@/constants/app'

const router = useRouter()
const authStore = useAuthStore()
const appCommon = useAppCommonStore()
const { t } = useI18n()

const isLoading = ref(false)

const onSubmit = async (login: string, password: string) => {
  isLoading.value = true

  try {
    await authStore.login(login, password)
    await router.push(AppRoute.Guests)
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
      <template #title>{{ t('auth.signInTitle') }}</template>
      <template #content>
        <LoginForm
          :is-loading="isLoading"
          @submit="onSubmit"
        />
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
  max-width: 420px;
  border-radius: 8px;
}

</style>
