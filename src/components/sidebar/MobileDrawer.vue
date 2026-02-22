<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import ProfileCard from '@/components/ProfileCard.vue'
import { navItems } from './sidebarConfig'
import logoutIconUrl from '@/assets/logout.svg'
import closeIconUrl from '@/assets/close.svg'

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

const isActive = (path: string) => route.path === path

const navigate = async (path: string) => {
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
  background: #141923;
  color: #e4e7ef;
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
  color: #e4e7ef;
  cursor: pointer;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: #242f44;
}

.close-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1) opacity(0.6);
}

.close-btn:hover .close-icon {
  filter: brightness(0) invert(1);
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

@media (min-width: 769px) {
  .mobile-drawer {
    display: none;
  }
}
</style>
