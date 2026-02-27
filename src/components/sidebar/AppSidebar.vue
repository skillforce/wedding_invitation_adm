<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProfileCard from '@/components/ProfileCard.vue'
import SidebarToggle from '@/components/SidebarToggle.vue'
import NavButton from './NavButton.vue'
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
      <NavButton
        v-for="item in navItems"
        :key="item.path"
        :icon-url="item.iconUrl"
        :label="t(item.labelKey)"
        :active="isActive(item.path)"
        :collapsed="collapsed"
        @click="onClickOption(item.path)"
      />
    </nav>
    <div :class="['sidebar-controls', { collapsed }]">
      <SidebarToggle :collapsed="collapsed" @toggle="emit('toggle')" />
    </div>
    <NavButton
      :icon-url="logoutIconUrl"
      :label="t('nav.logout')"
      :icon-alt="t('a11y.logoutIcon')"
      :collapsed="collapsed"
      class="logout-btn"
      @click="emit('logout')"
    />
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

.logout-btn {
  margin-top: auto;
}

@media (max-width: 768px) {
  .app-sidebar {
    display: none;
  }
}
</style>
