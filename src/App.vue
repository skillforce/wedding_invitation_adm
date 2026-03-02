<script setup lang="ts">
import ThemeSwitch from '@/components/shared/ThemeSwitch.vue'
import LocaleSwitch from '@/components/shared/LocaleSwitch.vue'
import GlobalErrorAlert from '@/components/global/GlobalErrorAlert.vue'
import GlobalSpinner from '@/components/global/GlobalSpinner.vue'
import { useRouter } from 'vue-router'
import { configureApiAuth } from '@/api/consts'
import { AUTH_API } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { AppRoute } from '@/constants/app'

const authStore = useAuthStore()
const router = useRouter()

configureApiAuth(
  async () => {
    const token = await AUTH_API.refresh()
    authStore.token = token
    return token
  },
  async () => {
    await authStore.logout()
    await router.push(AppRoute.Login)
  },
)
</script>

<template>
  <GlobalSpinner />
  <GlobalErrorAlert />
  <RouterView />
  <div class="global-controls">
    <LocaleSwitch />
    <ThemeSwitch />
  </div>
</template>

<style scoped>
.global-controls {
  position: fixed;
  top: 0.7rem;
  right: 0.7rem;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
