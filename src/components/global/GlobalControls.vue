<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Popover from 'primevue/popover'
import BottomDrawer from '@/components/shared/BottomDrawer.vue'
import LocaleSwitch from '@/components/global/LocaleSwitch.vue'
import ThemeSwitch from '@/components/global/ThemeSwitch.vue'
import { usePreferencesStore } from '@/stores/preferences'

const preferencesStore = usePreferencesStore()
const { isDarkTheme, locale } = storeToRefs(preferencesStore)

watch([isDarkTheme, locale], () => hide())

const popoverRef = ref<InstanceType<typeof Popover> | null>(null)
const isDrawerOpen = ref(false)
const isMobile = ref(false)

function syncViewportMode() {
  if (typeof window === 'undefined') return
  isMobile.value = window.innerWidth < 640
}

function toggle(event: MouseEvent) {
  if (isMobile.value) {
    isDrawerOpen.value = !isDrawerOpen.value
    return
  }
  popoverRef.value?.toggle(event)
}

function hide() {
  popoverRef.value?.hide()
  isDrawerOpen.value = false
}

onMounted(() => {
  syncViewportMode()
  window.addEventListener('resize', syncViewportMode)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewportMode)
})
</script>

<template>
  <button
    type="button"
    class="global-controls-btn"
    :class="isDarkTheme ? 'theme-dark' : 'theme-light'"
    aria-label="Settings"
    @click="toggle"
  >
    <i class="pi pi-cog" />
  </button>

  <Popover ref="popoverRef">
    <div class="controls-panel">
      <LocaleSwitch />
      <ThemeSwitch />
    </div>
  </Popover>

  <BottomDrawer :open="isDrawerOpen" @close="hide">
    <div class="controls-panel">
      <LocaleSwitch />
      <ThemeSwitch />
    </div>
  </BottomDrawer>
</template>

<style scoped>
.global-controls-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.global-controls-btn .pi {
  font-size: 1.3rem;
  transition: filter 0.2s ease;
}

.global-controls-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.07);
}

/* ── Dark theme: gold icon ────────────────────────── */
.global-controls-btn.theme-dark .pi {
  color: #e8c44a;
  filter: drop-shadow(0 0 5px rgba(232, 185, 60, 0.8)) drop-shadow(0 0 2px rgba(255, 230, 100, 0.5));
}

.global-controls-btn.theme-dark:hover .pi {
  filter: drop-shadow(0 0 8px rgba(232, 185, 60, 1)) drop-shadow(0 0 3px rgba(255, 240, 130, 0.8));
}

/* ── Light theme: green icon ──────────────────────── */
.global-controls-btn.theme-light .pi {
  color: #2d7a50;
  filter: drop-shadow(0 0 5px rgba(45, 160, 90, 0.7)) drop-shadow(0 0 2px rgba(100, 220, 140, 0.4));
}

.global-controls-btn.theme-light:hover .pi {
  filter: drop-shadow(0 0 8px rgba(45, 160, 90, 1)) drop-shadow(0 0 3px rgba(100, 220, 140, 0.7));
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.25rem 0;
}
</style>
