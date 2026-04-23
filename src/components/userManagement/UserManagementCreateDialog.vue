<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import ProfileFieldsCardItem from '@/components/profile/ProfileFieldsCard/ProfileFieldsCardItem.vue'
import { useUsersStore } from '@/stores/users'
import { useAppCommonStore } from '@/stores/app_common'
import { usePreferencesStore } from '@/stores/preferences'
import { EMAIL_RE } from '@/utils/validation'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ 'update:visible': [value: boolean] }>()

const { t } = useI18n()
const store = useUsersStore()
const appCommon = useAppCommonStore()
const preferences = usePreferencesStore()

const createForm = ref({ login: '', password: '', email: '' })
const createErrors = ref({ login: '', password: '', email: '' })
const isCreating = ref(false)

const fields = computed(() => [
  {
    key: 'login',
    type: 'text',
    label: t('userManagement.form.loginLabel'),
    placeholder: t('userManagement.form.loginPlaceholder'),
  },
  {
    key: 'password',
    type: 'password',
    label: t('userManagement.form.passwordLabel'),
    placeholder: t('userManagement.form.passwordPlaceholder'),
  },
  {
    key: 'email',
    type: 'email',
    label: t('userManagement.form.emailLabel'),
    placeholder: t('userManagement.form.emailPlaceholder'),
  },
] as const)

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
  if (!EMAIL_RE.test(createForm.value.email.trim())) {
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
      locale: preferences.locale,
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
      <ProfileFieldsCardItem
        v-for="field in fields"
        :key="field.key"
        :label="field.label"
        :error="createErrors[field.key]"
      >
        <InputText
          :model-value="createForm[field.key]"
          :type="field.type"
          :placeholder="field.placeholder"
          class="w-full"
          :class="{ 'p-invalid': createErrors[field.key] }"
          @update:model-value="(value) => {
            createForm[field.key] = typeof value === 'string' ? value : ''
          }"
        />
      </ProfileFieldsCardItem>

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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
}
</style>
