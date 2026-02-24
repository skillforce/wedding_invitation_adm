<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import LoginForm from '@/components/LoginForm.vue'
import { useAuthStore } from '@/stores/auth'
import { AppRoute } from '@/constants/app'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const errorMessage = ref('')

const onSubmit = async (login: string, password: string) => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(login, password)
    await router.push(AppRoute.Dashboard)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Login failed'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <Card class="login-card">
      <template #title>Sign in to your account</template>
      <template #content>
        <LoginForm
          :is-loading="isLoading"
          :error-message="errorMessage"
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
