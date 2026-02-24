<script setup lang="ts">
import ThemeSwitch from '@/components/ThemeSwitch.vue'
</script>

<template>
  <RouterView />
  <ThemeSwitch class="global-theme-switch" />
</template>

<style scoped>
.global-theme-switch {
  position: fixed;
  top: 0.7rem;
  right: 0.7rem;
  z-index: 60;
}
</style>
