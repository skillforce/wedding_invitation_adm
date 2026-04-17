<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import Popover from 'primevue/popover'
import BottomDrawer from '@/components/shared/BottomDrawer.vue'
import { useUsersStore } from '@/stores/users'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { useSelectedUser } from '@/composables/useSelectedUser'
import { usePreferencesStore } from '@/stores/preferences'
import usersIconUrl from '@/assets/usersManagement.svg'

const { t } = useI18n()
const usersStore = useUsersStore()
const { isSuperUser } = useCurrentUser()
const { selectedUserId } = useSelectedUser()

const preferencesStore = usePreferencesStore()
const { isDarkTheme } = storeToRefs(preferencesStore)

const popoverRef = ref<InstanceType<typeof Popover> | null>(null)
const isDrawerOpen = ref(false)
const isMobile = ref(false)

const options = computed(() =>
  usersStore.users.map((u) => ({ label: u.login, value: String(u.id) })),
)

const selectValue = computed({
  get: () => selectedUserId.value === null ? '' : String(selectedUserId.value),
  set: (val: string) => { selectedUserId.value = val === '' ? null : Number(val) },
})

function syncViewportMode() {
  if (typeof window === 'undefined') return
  isMobile.value = window.innerWidth < 640
}

function toggle(event: MouseEvent) {
  if (isMobile.value) {
    isDrawerOpen.value = !isDrawerOpen.value
    return
  }
  popoverRef.value?.toggle(event)
}

function hide() {
  popoverRef.value?.hide()
  isDrawerOpen.value = false
}

watch(isSuperUser, async (val) => {
  if (val && !usersStore.users.length) {
    await usersStore.fetchUsers()
  }
})

onMounted(() => {
  syncViewportMode()
  window.addEventListener('resize', syncViewportMode)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewportMode)
})
</script>

<template>
  <template v-if="isSuperUser">
    <button
      type="button"
      class="user-switcher-btn"
      :class="isDarkTheme ? 'theme-dark' : 'theme-light'"
      :aria-label="t('userSwitcher.label')"
      @click="toggle"
    >
      <img :src="usersIconUrl" class="users-icon" alt="" />
    </button>

    <Popover ref="popoverRef">
      <div class="switcher-panel">
        <span class="panel-label">{{ t('userSwitcher.label') }}</span>
        <label class="user-switcher">
          <select v-model="selectValue" class="user-switcher-select" :aria-label="t('userSwitcher.label')">
            <option value="">{{ t('userSwitcher.placeholder') }}</option>
            <option v-for="option in options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>
      </div>
    </Popover>

    <BottomDrawer :open="isDrawerOpen" @close="hide">
      <div class="switcher-panel">
        <span class="panel-label">{{ t('userSwitcher.label') }}</span>
        <label class="user-switcher">
          <select v-model="selectValue" class="user-switcher-select" :aria-label="t('userSwitcher.label')">
            <option value="">{{ t('userSwitcher.placeholder') }}</option>
            <option v-for="option in options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>
      </div>
    </BottomDrawer>
  </template>
</template>

<style scoped>
.user-switcher-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.user-switcher-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.07);
}

.users-icon {
  width: 1.4rem;
  height: 1.4rem;
}

.user-switcher-btn.theme-dark .users-icon {
  filter: invert(85%) sepia(30%) saturate(600%) hue-rotate(10deg) brightness(105%)
    drop-shadow(0 0 5px rgba(232, 185, 60, 0.8)) drop-shadow(0 0 2px rgba(255, 230, 100, 0.5));
}

.user-switcher-btn.theme-dark:hover .users-icon {
  filter: invert(85%) sepia(30%) saturate(600%) hue-rotate(10deg) brightness(115%)
    drop-shadow(0 0 8px rgba(232, 185, 60, 1)) drop-shadow(0 0 3px rgba(255, 240, 130, 0.8));
}

.user-switcher-btn.theme-light .users-icon {
  filter: invert(30%) sepia(60%) saturate(500%) hue-rotate(110deg) brightness(90%)
    drop-shadow(0 0 5px rgba(45, 160, 90, 0.7)) drop-shadow(0 0 2px rgba(100, 220, 140, 0.4));
}

.user-switcher-btn.theme-light:hover .users-icon {
  filter: invert(30%) sepia(60%) saturate(500%) hue-rotate(110deg) brightness(100%)
    drop-shadow(0 0 8px rgba(45, 160, 90, 1)) drop-shadow(0 0 3px rgba(100, 220, 140, 0.7));
}

.switcher-panel {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.panel-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

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
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  width: 100%;
}

.user-switcher-select option {
  color: #0f1728;
}
</style>