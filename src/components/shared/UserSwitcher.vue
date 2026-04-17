<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
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

const selectValue = computed({
  get: () => props.modelValue === null ? '' : String(props.modelValue),
  set: (val: string) => emit('update:modelValue', val === '' ? null : Number(val)),
})

onMounted(async () => {
  if (isSuperUser.value && !usersStore.users.length) {
    await usersStore.fetchUsers()
  }
})
</script>

<template>
  <label v-if="isSuperUser" class="user-switcher">
    <span class="sr-only">{{ t('userSwitcher.label') }}</span>
    <select v-model="selectValue" class="user-switcher-select" :aria-label="t('userSwitcher.label')">
      <option value="">{{ t('userSwitcher.placeholder') }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.user-switcher {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-theme-switch-border);
  border-radius: 50px;
  background: var(--color-theme-switch-bg);
  padding: 0.35rem 0.65rem;
}

.user-switcher-select {
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-theme-switch-label);
  font-size:14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  max-width: 200px;
}

.user-switcher-select option {
  color: #0f1728;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 768px) {
  .user-switcher {
    padding: 0.15rem 0.45rem;
  }
}
</style>
