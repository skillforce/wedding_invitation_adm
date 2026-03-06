<script setup lang="ts">
import ThemeSwitch from '@/components/global/ThemeSwitch.vue'
import LocaleSwitch from '@/components/global/LocaleSwitch.vue'
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
  <div class="router">
    <RouterView />
  </div>
  <div class="global-controls">
    <LocaleSwitch />
    <ThemeSwitch />
  </div>
</template>

<style scoped>

.router {
  view-transition-name: page;
}

.global-controls {
  position: fixed;
  top: 0.7rem;
  right: 2rem;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  view-transition-name: controls;
}
@media (max-width: 768px) {
  .global-controls {
    top: 0.5rem;
    right: 0.5rem;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
