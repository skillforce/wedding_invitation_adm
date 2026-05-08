<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
import MobileDrawer from '@/components/sidebar/MobileDrawer.vue'
import MobileMenuButton from '@/components/sidebar/MobileMenuButton.vue'
import PullToRefreshIndicator from '@/components/global/PullToRefreshIndicator.vue'
import { useAuthStore } from '@/stores/auth'
import { useAppCommonStore } from '@/stores/app_common'
import { AppRoute } from '@/constants/app'
import { usePullToRefreshHost } from '@/composables/usePullToRefresh'

const authStore = useAuthStore()
const appCommonStore = useAppCommonStore()
const router = useRouter()
const isMobileSidebarOpen = ref(false)
const contentRef = ref<HTMLElement | null>(null)

usePullToRefreshHost(contentRef)

const login = computed(() => authStore.user?.login)

const onToggleSidebar = () => {
  appCommonStore.toggleSidebar()
}

const onOpenMobileSidebar = () => {
  isMobileSidebarOpen.value = true
}

const onCloseMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

const onLogout = async () => {
  await authStore.logout()
  isMobileSidebarOpen.value = false
  await router.push(AppRoute.Login)
}
</script>

<template>
  <div class="authorized-layout">
    <AppSidebar
      :collapsed="appCommonStore.isSidebarCollapsed"
      :login="login"
      @toggle="onToggleSidebar"
      @logout="onLogout"
    />

    <MobileDrawer
      :open="isMobileSidebarOpen"
      :login="login"
      @close="onCloseMobileSidebar"
      @logout="onLogout"
    />

    <main ref="contentRef" class="authorized-content">
      <div class="mobile-header">
        <MobileMenuButton @click="onOpenMobileSidebar" />
      </div>
      <RouterView />
    </main>

  </div>
  <PullToRefreshIndicator />
</template>

<style scoped>
.authorized-layout {
  height: 100dvh;
  overflow: hidden;
  display: grid;
  grid-template-columns: auto 1fr;
  background: var(--color-bg-app);
  padding: 0.75rem;
  gap: 0.75rem;
}

.authorized-content {
  padding: 10px 5px;
  overflow: auto;
  min-height: 0;
  overscroll-behavior-y: contain;
}

.mobile-header {
  display: none;
}

@media (max-width: 1024px) {
  .authorized-layout {
    grid-template-columns: 1fr;
    padding: 0.05rem;
  }

  .mobile-header {
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    height: calc(3rem + env(safe-area-inset-top));
    padding: env(safe-area-inset-top) 0.75rem 0;
    background: var(--color-bg-app);
  }

  .authorized-content {
    padding-top: calc(3rem + env(safe-area-inset-top) + 0.5rem);
  }
}
</style>
