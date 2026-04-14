<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useUsersStore } from '@/stores/users'
import { useAppCommonStore } from '@/stores/app_common'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ 'update:visible': [value: boolean] }>()

const { t } = useI18n()
const store = useUsersStore()
const appCommon = useAppCommonStore()

const createForm = ref({ login: '', password: '', email: '' })
const createErrors = ref({ login: '', password: '', email: '' })
const isCreating = ref(false)

watch(() => props.visible, (val) => {
  if (val) {
    createForm.value = { login: '', password: '', email: '' }
    createErrors.value = { login: '', password: '', email: '' }
  }
})

function validate(): boolean {
  let valid = true
  createErrors.value = { login: '', password: '', email: '' }

  if (createForm.value.login.trim().length < 3 || createForm.value.login.trim().length > 10) {
    createErrors.value.login = t('userManagement.form.loginError')
    valid = false
  }
  if (createForm.value.password.length < 3 || createForm.value.password.length > 30) {
    createErrors.value.password = t('userManagement.form.passwordError')
    valid = false
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(createForm.value.email.trim())) {
    createErrors.value.email = t('userManagement.form.emailError')
    valid = false
  }
  return valid
}

async function submit() {
  if (!validate()) return
  isCreating.value = true
  try {
    await store.createUser({
      login: createForm.value.login.trim(),
      password: createForm.value.password,
      email: createForm.value.email.trim(),
    })
    emit('update:visible', false)
    appCommon.showSuccess(t('userManagement.createSuccess'))
  } catch {
    appCommon.showError(t('errors.userManagement.failedToCreate'))
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <Dialog
    :visible="visible"
    :header="t('userManagement.form.title')"
    modal
    :breakpoints="{ '640px': '90vw' }"
    style="width: 420px"
    @update:visible="$emit('update:visible', $event)"
  >
    <form class="create-form" @submit.prevent="submit">
      <div class="field">
        <label class="field-label">{{ t('userManagement.form.loginLabel') }}</label>
        <InputText
          v-model="createForm.login"
          :placeholder="t('userManagement.form.loginPlaceholder')"
          class="w-full"
          :class="{ 'p-invalid': createErrors.login }"
        />
        <small v-if="createErrors.login" class="field-error">{{ createErrors.login }}</small>
      </div>

      <div class="field">
        <label class="field-label">{{ t('userManagement.form.passwordLabel') }}</label>
        <InputText
          v-model="createForm.password"
          type="password"
          :placeholder="t('userManagement.form.passwordPlaceholder')"
          class="w-full"
          :class="{ 'p-invalid': createErrors.password }"
        />
        <small v-if="createErrors.password" class="field-error">{{ createErrors.password }}</small>
      </div>

      <div class="field">
        <label class="field-label">{{ t('userManagement.form.emailLabel') }}</label>
        <InputText
          v-model="createForm.email"
          type="email"
          :placeholder="t('userManagement.form.emailPlaceholder')"
          class="w-full"
          :class="{ 'p-invalid': createErrors.email }"
        />
        <small v-if="createErrors.email" class="field-error">{{ createErrors.email }}</small>
      </div>

      <div class="form-actions">
        <Button
          type="button"
          :label="t('userManagement.cancel')"
          severity="secondary"
          text
          @click="$emit('update:visible', false)"
        />
        <Button
          type="submit"
          :label="t('userManagement.form.submitButton')"
          :loading="isCreating"
        />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
.create-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 4px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.field-error {
  font-size: 12px;
  color: var(--p-red-500, #ef4444);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
}
</style>