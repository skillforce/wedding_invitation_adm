<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import { useUsersStore } from '@/stores/users'
import { useCurrentUser } from '@/composables/useCurrentUser'

const props = defineProps<{
  modelValue: number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

const { t } = useI18n()
const usersStore = useUsersStore()
const { isSuperUser } = useCurrentUser()

const options = computed(() =>
  usersStore.users.map((u) => ({ label: u.login, value: String(u.id) })),
)

const selectValue = computed(() => props.modelValue === null ? null : String(props.modelValue))

function onSelect(val: string | null | undefined) {
  emit('update:modelValue', val == null ? null : Number(val))
}

onMounted(async () => {
  if (isSuperUser.value && !usersStore.users.length) {
    await usersStore.fetchUsers()
  }
})
</script>

<template>
  <label v-if="isSuperUser" class="user-switcher-field">
    <span class="user-switcher-label">{{ t('userSwitcher.label') }}</span>
    <Select
      :model-value="selectValue"
      :options="options"
      option-label="label"
      option-value="value"
      :placeholder="t('userSwitcher.placeholder')"
      :show-clear="true"
      append-to="body"
      @update:model-value="onSelect"
    />
  </label>
</template>

<style scoped>
.user-switcher-field {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
}

.user-switcher-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.user-switcher-field :deep(.p-select) {
  min-width: 160px;
  max-width: 100%;
}

@media (max-width: 320px) {
  .user-switcher-field {
    width: 100%;
  }

  .user-switcher-field :deep(.p-select) {
    width: 100%;
    min-width: 0;
  }
}
</style>
