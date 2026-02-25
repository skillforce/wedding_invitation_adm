<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProfileCard from '@/components/ProfileCard.vue'
import SidebarToggle from '@/components/SidebarToggle.vue'
import { navItems } from './sidebarConfig'
import logoutIconUrl from '@/assets/logout.svg'
import { useAppCommonStore } from '@/stores/app_common'

defineProps<{
  collapsed: boolean
  login?: string
}>()

const emit = defineEmits<{
  (event: 'toggle'): void
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

const onClickOption = async (path: string) => {
  appCommonStore.setSelectedSidebarOption(path)
  await router.push(path)
}
</script>

<template>
  <aside :class="['app-sidebar', { collapsed }]">
    <div class="sidebar-top">


      <ProfileCard :collapsed="collapsed" :login="login" />
    </div>

    <nav class="sidebar-nav">
      <button
        v-for="item in navItems"
        :key="item.path"
        class="nav-btn"
        :class="{ active: isActive(item.path), collapsed }"
        @click="onClickOption(item.path)"
      >
        <img :src="item.iconUrl" class="nav-icon" :alt="t('a11y.menuOptionIcon')" />
        <span v-if="!collapsed" class="nav-label">{{ t(item.labelKey) }}</span>
      </button>
    </nav>
    <div :class="['sidebar-controls', { collapsed }]" >
      <SidebarToggle :collapsed="collapsed" @toggle="emit('toggle')" />
    </div>
    <button
      class="nav-btn logout-btn"
      :class="{ collapsed }"
      :aria-label="t('nav.logout')"
      @click="emit('logout')"
    >
      <img :src="logoutIconUrl" class="nav-icon" :alt="t('a11y.logoutIcon')" />
      <span v-if="!collapsed" class="nav-label">{{ t('nav.logout') }}</span>
    </button>
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: 260px;
  border-right: 1px solid var(--color-border);
  background: var(--color-sidebar-bg);
  color: var(--color-text-primary);
  padding: 0.75rem;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  transition: width 0.2s ease;
}

.app-sidebar.collapsed {
  width: 78px;
}

.sidebar-top {
  display: grid;
  gap: 0.5rem;
}

.sidebar-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.sidebar-controls.collapsed {
  justify-content: center;
}

.sidebar-nav {
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

.nav-btn.collapsed {
  justify-content: center;
  padding: 0.5rem;
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

.logout-btn {
  margin-top: auto;
}

@media (max-width: 768px) {
  .app-sidebar {
    display: none;
  }
}
</style>
