<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
import MobileDrawer from '@/components/sidebar/MobileDrawer.vue'
import MobileMenuButton from '@/components/sidebar/MobileMenuButton.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)

const login = computed(() => authStore.user?.login)

const onToggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const onOpenMobileSidebar = () => {
  isMobileSidebarOpen.value = true
}

const onCloseMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

const onLogout = async () => {
  authStore.logout()
  isMobileSidebarOpen.value = false
  await router.push('/')
}
</script>

<template>
  <div class="authorized-layout">
    <AppSidebar
      :collapsed="isSidebarCollapsed"
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

    <main class="authorized-content">
      <div class="mobile-header">
        <MobileMenuButton @click="onOpenMobileSidebar" />
      </div>
      <RouterView />
    </main>

    <div
      v-if="isMobileSidebarOpen"
      class="mobile-backdrop"
      @click="onCloseMobileSidebar"
    />
  </div>
</template>

<style scoped>
.authorized-layout {
  min-height: 100dvh;
  display: grid;
  grid-template-columns: auto 1fr;
  background: #111827;
}

.authorized-content {
  padding: 10px 5px ;
  overflow: auto;
}

.mobile-header {
  display: none;
}

.mobile-backdrop {
  display: none;
}

@media (max-width: 768px) {
  .authorized-layout {
    grid-template-columns: 1fr;
  }

  .mobile-header {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 0.75rem;
  }

  .mobile-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(8, 11, 16, 0.45);
    z-index: 20;
  }
}
</style>
