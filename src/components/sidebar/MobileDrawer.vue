<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProfileCard from '@/components/ProfileCard.vue'
import NavButton from './NavButton.vue'
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
        <NavButton
          v-for="item in navItems"
          :key="item.path"
          :icon-url="item.iconUrl"
          :label="t(item.labelKey)"
          :active="isActive(item.path)"
          @click="navigate(item.path)"
        />
      </nav>

      <NavButton
        :icon-url="logoutIconUrl"
        :label="t('nav.logout')"
        :icon-alt="t('a11y.logoutIcon')"
        @click="emit('logout')"
      />
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

</style>
