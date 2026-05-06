<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import ProfileFieldsCardItem from '@/components/profile/ProfileFieldsCard/ProfileFieldsCardItem.vue'

defineProps<{
  loading?: boolean
  submitLabel?: string
  title?: string
  description?: string
}>()

const emit = defineEmits<{ submit: [password: string] }>()

const { t } = useI18n()

const password = ref('')
const confirmPassword = ref('')
const errors = ref({ password: '', confirm: '' })

function validate(): boolean {
  errors.value = { password: '', confirm: '' }
  let valid = true
  if (password.value.length < 10) {
    errors.value.password = t('setPassword.tooShort')
    valid = false
  } else if (password.value.length > 30) {
    errors.value.password = t('setPassword.tooLong')
    valid = false
  }
  if (password.value !== confirmPassword.value) {
    errors.value.confirm = t('setPassword.mismatch')
    valid = false
  }
  return valid
}

function submit() {
  if (!validate()) return
  emit('submit', password.value)
}
</script>

<template>
  <div class="set-password-form">
    <div v-if="title || description" class="form-header">
      <h2 v-if="title" class="form-title">{{ title }}</h2>
      <p v-if="description" class="form-description">{{ description }}</p>
    </div>

    <form class="fields" @submit.prevent="submit">
      <ProfileFieldsCardItem :label="t('setPassword.passwordLabel')" :error="errors.password">
        <InputText
          v-model="password"
          type="password"
          :placeholder="t('setPassword.passwordPlaceholder')"
          class="w-full"
          :class="{ 'p-invalid': errors.password }"
          :disabled="loading"
          autocomplete="new-password"
        />
        <div v-if="password" class="hint" :class="password.length >= 10 ? 'hint--met' : 'hint--unmet'">
          <i :class="password.length >= 10 ? 'pi pi-check-circle' : 'pi pi-circle'" />
          {{ t('setPassword.hintMinLength') }}
        </div>
      </ProfileFieldsCardItem>

      <ProfileFieldsCardItem :label="t('setPassword.confirmLabel')" :error="errors.confirm">
        <InputText
          v-model="confirmPassword"
          type="password"
          :placeholder="t('setPassword.confirmPlaceholder')"
          class="w-full"
          :class="{ 'p-invalid': errors.confirm }"
          :disabled="loading"
          autocomplete="new-password"
        />
        <div v-if="confirmPassword" class="hint" :class="password === confirmPassword ? 'hint--met' : 'hint--unmet'">
          <i :class="password === confirmPassword ? 'pi pi-check-circle' : 'pi pi-circle'" />
          {{ t('setPassword.hintMatch') }}
        </div>
      </ProfileFieldsCardItem>

      <Button
        type="submit"
        :label="submitLabel ?? t('setPassword.submit')"
        :loading="loading"
        class="w-full"
      />
    </form>
  </div>
</template>

<style scoped>
.set-password-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
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

.fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.hint--met {
  color: var(--p-green-500, #22c55e);
}

.hint--unmet {
  color: var(--color-text-muted);
}
</style>