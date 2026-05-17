<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputWithError from '@/components/shared/InputWithError.vue'
import { EMAIL_RE } from '@/utils/validation'

defineProps<{ loading?: boolean }>()

const emit = defineEmits<{
  submit: [email: string]
  back: []
}>()

const { t } = useI18n()
const email = ref('')
const emailInput = ref<InstanceType<typeof InputWithError>>()

const isInvalid = computed(() => !EMAIL_RE.test(email.value.trim()))

function onSubmit() {
  emailInput.value?.touch()
  if (isInvalid.value) return
  emit('submit', email.value.trim())
}
</script>

<template>
  <form class="forgot-form" @submit.prevent="onSubmit">
    <div class="form-header">
      <h2 class="form-title">{{ t('forgotPassword.title') }}</h2>
      <p class="form-description">{{ t('forgotPassword.description') }}</p>
    </div>

    <div class="field">
      <label>{{ t('forgotPassword.emailLabel') }}</label>
      <InputWithError
        ref="emailInput"
        v-model="email"
        :placeholder="t('forgotPassword.emailPlaceholder')"
        :invalid="isInvalid"
        :error-message="t('forgotPassword.invalidEmail')"
        :disabled="loading"
      />
    </div>

    <Button type="submit" :label="t('forgotPassword.submit')" :loading="loading" />

    <Button
      type="button"
      :label="t('forgotPassword.backToLogin')"
      variant="link"
      :disabled="loading"
      class="back-link"
      @click="$emit('back')"
    />
  </form>
</template>

<style scoped>
.forgot-form {
  display: grid;
  gap: 1rem;
  width: 100%;
}

.form-header {
  text-align: center;
}

.form-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 8px;
}

.form-description {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.5;
}

.field {
  display: grid;
  gap: 0.4rem;
}

.back-link {
  justify-self: center;
  font-size: 14px;
}
</style>