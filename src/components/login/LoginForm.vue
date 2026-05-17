<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

defineProps<{
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (event: 'submit', loginOrEmail: string, password: string): void
  (event: 'forgot-password'): void
}>()

const loginOrEmailValue = ref('')
const passwordValue = ref('')
const { t } = useI18n()

const onSubmit = () => {
  emit('submit', loginOrEmailValue.value, passwordValue.value)
}
</script>

<template>
  <form class="login-form" @submit.prevent="onSubmit">
    <div class="field">
      <label for="login">{{ t('auth.loginLabel') }}</label>
      <InputText id="login" v-model="loginOrEmailValue" fluid />
    </div>

    <div class="field">
      <label for="password">{{ t('auth.passwordLabel') }}</label>
      <Password
        id="password"
        v-model="passwordValue"
        :feedback="false"
        toggle-mask
        fluid
      />
    </div>

    <Button type="submit" :label="t('auth.signInButton')" :loading="isLoading" />

    <Button
      type="button"
      :label="t('auth.forgotPassword')"
      variant="link"
      class="forgot-link"
      @click="$emit('forgot-password')"
    />
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

.field :deep(input) {
  font-size: 16px;
}

.forgot-link {
  justify-self: center;
  font-size: 14px;
}
</style>
