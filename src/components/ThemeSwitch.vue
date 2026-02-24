<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { AppTheme } from "@/constants/app.ts";

const themeStore = useThemeStore()
const { isDarkTheme } = storeToRefs(themeStore)

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<template>
  <button
    type="button"
    class="theme-switch"
    :class="{ dark: isDarkTheme }"
    :aria-label="`Switch to ${isDarkTheme ? AppTheme.Dark : AppTheme.Light} theme`"
    @click="toggleTheme"
  >
    <span class="theme-switch-label">{{ isDarkTheme ? AppTheme.Dark : AppTheme.Light }}</span>
    <span class="theme-switch-track">
      <span class="theme-switch-thumb" />
    </span>
  </button>
</template>

<style scoped>
.theme-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--color-theme-switch-border);
  border-radius: 999px;
  padding: 0.25rem 0.35rem 0.25rem 0.6rem;
  background: var(--color-theme-switch-bg);
  color: var(--color-theme-switch-label);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.theme-switch-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.theme-switch-track {
  display: inline-flex;
  align-items: center;
  width: 2.1rem;
  height: 1.2rem;
  border-radius: 999px;
  padding: 2px;
  background: var(--color-theme-switch-track);
}

.theme-switch-thumb {
  width: 0.95rem;
  height: 0.95rem;
  border-radius: 50%;
  background: var(--color-theme-switch-thumb);
  transform: translateX(0);
  transition: transform 0.2s ease;
}

.theme-switch.dark .theme-switch-thumb {
  transform: translateX(0.9rem);
}
</style>
