<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProfileCard from '@/components/ProfileCard.vue'
import { navItems } from './sidebarConfig'
import logoutIconUrl from '@/assets/logout.svg'
import closeIconUrl from '@/assets/close.svg'
import { useAppCommonStore } from '@/stores/app_common'

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
  <aside :class="['mobile-drawer', { open }]">
    <div class="drawer-top">
      <div class="drawer-header">
        <button class="close-btn" aria-label="Close menu" @click="emit('close')">
          <img :src="closeIconUrl" class="close-icon" alt="" />
        </button>
      </div>

      <ProfileCard :login="login" />
    </div>

    <nav class="drawer-nav">
      <button
        v-for="item in navItems"
        :key="item.path"
        class="nav-btn"
        :class="{ active: isActive(item.path) }"
        @click="navigate(item.path)"
      >
        <img :src="item.iconUrl" class="nav-icon" alt="menu's option icon" />
        <span class="nav-label">{{ item.label }}</span>
      </button>
    </nav>

    <button class="nav-btn logout-btn" @click="emit('logout')">
      <img :src="logoutIconUrl" class="nav-icon" alt="logout button icon" />
      <span class="nav-label">Logout</span>
    </button>
  </aside>
</template>

<style scoped>
.mobile-drawer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  max-height: 80dvh;
  border-radius: 16px 16px 0 0;
  background: var(--color-sidebar-bg);
  color: var(--color-text-primary);
  padding: 0.75rem;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  transform: translateY(100%);
  transition: transform 0.25s ease;
}

.mobile-drawer.open {
  transform: translateY(0);
}

.drawer-top {
  display: grid;
  gap: 0.5rem;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: var(--color-hover);
}

.close-icon {
  width: 20px;
  height: 20px;
  filter: var(--color-icon-filter);
}

.close-btn:hover .close-icon {
  filter: var(--color-icon-filter-active);
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

.logout-btn {
  margin-top: auto;
}

@media (min-width: 769px) {
  .mobile-drawer {
    display: none;
  }
}
</style>
