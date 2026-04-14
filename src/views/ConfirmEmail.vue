<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AUTH_API } from '@/api/auth'
import { AppRoute } from '@/constants/app'
import ConfirmLoading from '@/components/confirmation/ConfirmLoading.vue'
import ConfirmSuccess from '@/components/confirmation/ConfirmSuccess.vue'
import ConfirmError from '@/components/confirmation/ConfirmError.vue'
import ConfirmNoToken from '@/components/confirmation/ConfirmNoToken.vue'

type State = 'loading' | 'success' | 'error' | 'no-token'

const route = useRoute()
const router = useRouter()

const state = ref<State>('loading')

onMounted(async () => {
  const token = route.query.token

  if (!token || typeof token !== 'string') {
    state.value = 'no-token'
    return
  }

  try {
    await AUTH_API.confirmEmail(token)
    state.value = 'success'
  } catch {
    state.value = 'error'
  }
})

function goToLogin() {
  router.push(AppRoute.Login)
}
</script>

<template>
  <div class="confirm-page">
    <div class="confirm-card">
      <ConfirmLoading v-if="state === 'loading'" />
      <ConfirmSuccess v-else-if="state === 'success'" @go-to-login="goToLogin" />
      <ConfirmError v-else-if="state === 'error'" @go-to-login="goToLogin" />
      <ConfirmNoToken v-else @go-to-login="goToLogin" />
    </div>
  </div>
</template>

<style scoped>
.confirm-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--color-bg, #f8f9fa);
}

.confirm-card {
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