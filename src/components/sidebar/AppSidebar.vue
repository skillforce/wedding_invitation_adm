<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import SidebarCollapseButton from './SidebarCollapseButton.vue'
import NavButton from './NavButton.vue'
import { navItems, miniGameNavItem } from './sidebarConfig'
import logoutIconUrl from '@/assets/logout.svg'
import { useAppCommonStore } from '@/stores/app_common'
import { useCurrentUser } from '@/composables/useCurrentUser'

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
const { isSuperUser } = useCurrentUser()

const visibleNavItems = computed(() =>
  navItems.filter((item) => !item.superUserOnly || isSuperUser.value),
)

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
  <div class="sidebar-wrapper">
    <aside :class="['app-sidebar', { collapsed }]">
      <div class="sidebar-top">
        <ProfileCard :collapsed="collapsed" :login="login" />
      </div>

      <nav class="sidebar-nav">
        <NavButton
          v-for="item in visibleNavItems"
          :key="item.path"
          :icon-url="item.iconUrl"
          :label="t(item.labelKey)"
          :active="isActive(item.path)"
          :collapsed="collapsed"
          @click="onClickOption(item.path)"
        />
      </nav>

      <NavButton
        :icon-url="miniGameNavItem.iconUrl"
        :label="t(miniGameNavItem.labelKey)"
        :active="isActive(miniGameNavItem.path)"
        :collapsed="collapsed"
        @click="onClickOption(miniGameNavItem.path)"
      />

      <NavButton
        :icon-url="logoutIconUrl as string"
        :label="t('nav.logout')"
        :icon-alt="t('a11y.logoutIcon')"
        :collapsed="collapsed"
        class="logout-btn"
        @click="emit('logout')"
      />
    </aside>
    <SidebarCollapseButton :collapsed="collapsed" @toggle="emit('toggle')" />
  </div>
</template>

<style scoped>
.sidebar-wrapper {
  position: relative;
}

.app-sidebar {
  width: 260px;
  overflow: hidden;
  border-radius: 30px;
  border: 1px solid var(--color-border);
  background: var(--color-sidebar-bg);
  color: var(--color-text-primary);
  padding: 0.75rem;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  transition: width 0.2s ease;
  box-shadow: var(--shadow-card);
  height: 100%;
}

.app-sidebar.collapsed {
  width: 90px;
}

.sidebar-top {
  display: grid;
  gap: 0.5rem;
}

.sidebar-nav {
  display: grid;
  gap: 0.5rem;
  align-content: start;
  overflow: hidden;
  min-height: 0;
}

.logout-btn {
  margin-top: auto;
}

@media (max-width: 1024px) {
  .sidebar-wrapper {
    display: none;
  }
}
</style>
