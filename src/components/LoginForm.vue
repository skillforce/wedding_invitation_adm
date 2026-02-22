<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'

defineProps<{
  errorMessage?: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (event: 'submit', login: string, password: string): void
}>()

const loginValue = ref('')
const passwordValue = ref('')

const onSubmit = () => {
  emit('submit', loginValue.value, passwordValue.value)
}
</script>

<template>
  <form class="login-form" @submit.prevent="onSubmit" @keyup.enter="onSubmit">
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

<style scoped>
.login-form {
  display: grid;
  gap: 1rem;
}

.field {
  display: grid;
  gap: 0.4rem;
}
</style>