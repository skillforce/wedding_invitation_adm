<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProfileCard from '@/components/ProfileCard.vue'
import { navItems } from './sidebarConfig'
import logoutIconUrl from '@/assets/logout.svg'
import { useAppCommonStore } from '@/stores/app_common'
import BottomDrawer from '@/components/shared/BottomDrawer.vue'

defineProps<{
  open: boolean
  login?: string
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'logout'): void
}>()

const route = useRoute()
const router = useRouter()
const appCommonStore = useAppCommonStore()
const { t } = useI18n()

watch(
  () => route.path,
  (path) => {
    if (navItems.some((item) => item.path === path)) {
      appCommonStore.setSelectedSidebarOption(path)
    }
  },
  { immediate: true },
)

const isActive = (path: string) => appCommonStore.selectedSidebarOption === path

const navigate = async (path: string) => {
  appCommonStore.setSelectedSidebarOption(path)
  await router.push(path)
  emit('close')
}
</script>

<template>
  <BottomDrawer :open="open" @close="emit('close')">
    <div class="drawer-body">
      <ProfileCard :login="login" />

      <nav class="drawer-nav">
        <button
          v-for="item in navItems"
          :key="item.path"
          class="nav-btn"
          :class="{ active: isActive(item.path) }"
          @click="navigate(item.path)"
        >
          <img :src="item.iconUrl" class="nav-icon" :alt="t('a11y.menuOptionIcon')" />
          <span class="nav-label">{{ t(item.labelKey) }}</span>
        </button>
      </nav>

      <button class="nav-btn logout-btn" :aria-label="t('nav.logout')" @click="emit('logout')">
        <img :src="logoutIconUrl" class="nav-icon" :alt="t('a11y.logoutIcon')" />
        <span class="nav-label">{{ t('nav.logout') }}</span>
      </button>
    </div>
  </BottomDrawer>
</template>

<style scoped>
.drawer-body {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 0.75rem;
  height: 100%;
}

.drawer-nav {
  display: grid;
  gap: 0.5rem;
  align-content: start;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background 0.2s ease;
}

.nav-btn:hover {
  background: var(--color-hover);
}

.nav-btn.active {
  background: var(--color-active);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  filter: var(--color-icon-filter);
  transition: filter 0.2s ease;
}

.nav-btn.active .nav-icon,
.nav-btn:hover .nav-icon {
  filter: var(--color-icon-filter-active);
}

.nav-label {
  font-size: 0.9rem;
  white-space: nowrap;
}
</style>
