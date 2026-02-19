<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loginValue = ref('')
const passwordValue = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const onSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(loginValue.value, passwordValue.value)
    await router.push('/dashboard')
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
        <form class="login-form" @submit.prevent="onSubmit">
          <Message v-if="errorMessage" severity="error" size="small" variant="simple">
            {{ errorMessage }}
          </Message>

          <div class="field">
            <label for="login">Login</label>
            <InputText id="login" v-model="loginValue" fluid />
          </div>

          <div class="field">
            <label for="password">Password</label>
            <Password
              id="password"
              v-model="passwordValue"
              :feedback="false"
              toggle-mask
              fluid
            />
          </div>

          <Button type="submit" label="Sign In" :loading="isLoading" />
        </form>
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
  background: linear-gradient(80deg, #f3f4f6 0%, #76d3bd 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 8px;
}

.login-form {
  display: grid;
  gap: 1rem;
}

.field {
  display: grid;
  gap: 0.4rem;
}
</style>
