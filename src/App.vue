<script setup lang="ts">
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import LocaleSwitch from '@/components/LocaleSwitch.vue'
import GlobalErrorAlert from '@/components/GlobalErrorAlert.vue'
</script>

<template>
  <GlobalErrorAlert />
  <RouterView />
  <div class="global-controls">
    <LocaleSwitch />
    <ThemeSwitch />
  </div>
</template>

<style scoped>
.global-controls {
  position: fixed;
  top: 0.7rem;
  right: 0.7rem;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
