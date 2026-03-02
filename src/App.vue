<script setup lang="ts">
import ThemeSwitch from '@/components/shared/ThemeSwitch.vue'
import LocaleSwitch from '@/components/shared/LocaleSwitch.vue'
import GlobalErrorAlert from '@/components/global/GlobalErrorAlert.vue'
import GlobalSpinner from '@/components/global/GlobalSpinner.vue'
import { configureApiAuth } from '@/api/consts'
import { AUTH_API } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

configureApiAuth(
  async () => {
    const token = await AUTH_API.refresh()
    authStore.token = token
    return token
  },
  () => authStore.logout(),
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
