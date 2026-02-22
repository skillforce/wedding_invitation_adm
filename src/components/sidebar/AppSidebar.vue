<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import ProfileCard from '@/components/ProfileCard.vue'
import SidebarToggle from '@/components/SidebarToggle.vue'
import { navItems } from './sidebarConfig'
import logoutIconUrl from '@/assets/logout.svg'

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

const isActive = (path: string) => route.path === path

const navigate = (path: string) => router.push(path)
</script>

<template>
  <aside :class="['app-sidebar', { collapsed }]">
    <div class="sidebar-top">
      <div :class="['sidebar-controls', { collapsed }]" >
        <SidebarToggle :collapsed="collapsed" @toggle="emit('toggle')" />
      </div>

      <ProfileCard v-if="!collapsed" :login="login" />
    </div>

    <nav class="sidebar-nav">
      <button
        v-for="item in navItems"
        :key="item.path"
        class="nav-btn"
        :class="{ active: isActive(item.path), collapsed }"
        @click="navigate(item.path)"
      >
        <img :src="item.iconUrl" class="nav-icon" alt="" />
        <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
      </button>
    </nav>

    <button
      class="nav-btn logout-btn"
      :class="{ collapsed }"
      @click="emit('logout')"
    >
      <img :src="logoutIconUrl" class="nav-icon" alt="" />
      <span v-if="!collapsed" class="nav-label">Logout</span>
    </button>
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
  color: #e4e7ef;
  cursor: pointer;
  transition: background 0.2s ease;
}

.nav-btn:hover {
  background: #242f44;
}

.nav-btn.active {
  background: #1f2737;
}

.nav-btn.collapsed {
  justify-content: center;
  padding: 0.5rem;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  filter: brightness(0) invert(1) opacity(0.6);
  transition: filter 0.2s ease;
}

.nav-btn.active .nav-icon,
.nav-btn:hover .nav-icon {
  filter: brightness(0) invert(1);
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
