<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import ProfileCard from '@/components/ProfileCard.vue'

const props = defineProps<{
  collapsed: boolean
  login?: string
  mobileOpen: boolean
}>()

const emit = defineEmits<{
  (event: 'toggle'): void
  (event: 'closeMobile'): void
  (event: 'logout'): void
}>()

const route = useRoute()
const router = useRouter()

const isDashboardActive = computed(() => route.path === '/dashboard')

const goToDashboard = async () => {
  await router.push('/dashboard')
  emit('closeMobile')
}
</script>

<template>
  <aside :class="['app-sidebar', { collapsed, 'mobile-open': mobileOpen }]">
    <div class="sidebar-top">
      <div class="sidebar-controls">
        <Button
          class="collapse-btn"
          :icon="collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
          rounded
          text
          aria-label="Toggle sidebar"
          @click="emit('toggle')"
        />

        <Button
          icon="pi pi-times"
          class="close-mobile-btn"
          rounded
          text
          aria-label="Close sidebar"
          @click="emit('closeMobile')"
        />
      </div>

      <ProfileCard v-if="!collapsed" :login="login" />
    </div>

    <nav class="sidebar-nav">
      <Button
        label="Dashboard"
        text
        class="nav-btn"
        :class="{ active: isDashboardActive }"
        @click="goToDashboard"
      />
    </nav>

    <Button
      label="Logout"
      icon="pi pi-sign-out"
      class="logout-btn"
      @click="emit('logout')"
    />
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: 260px;
  border-right: 1px solid #2e3442;
  background: #141923;
  color: #e4e7ef;
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
  justify-content: space-between;
}

.close-mobile-btn {
  display: none;
}

.sidebar-nav {
  display: grid;
  gap: 0.5rem;
  align-content: start;
}

.nav-btn,
.logout-btn {
  width: 100%;
  justify-content: flex-start;
  color: #000000;
}

.nav-btn.active {
  background: #1f2737;
  color: #ffffff;
}

.logout-btn {
  margin-top: auto;
}

.collapsed .nav-btn,
.collapsed .logout-btn {
  justify-content: center;
}

:deep(.p-button.p-button-text) {
  color: inherit;
}

:deep(.p-button.p-button-text:not(:disabled):hover) {
  background: #242f44;
}

@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 30;
    transform: translateX(-100%);
    width: 260px;
    transition: transform 0.2s ease;
  }

  .app-sidebar.mobile-open {
    transform: translateX(0);
  }

  .close-mobile-btn {
    display: inline-flex;
  }
}
</style>
