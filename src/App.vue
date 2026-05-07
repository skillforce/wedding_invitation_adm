<script setup lang="ts">
import GlobalControls from '@/components/global/GlobalControls.vue'
import UserSwitcherButton from '@/components/global/UserSwitcherButton.vue'
import GlobalAlert from '@/components/global/GlobalAlert.vue'
import NoNetworkAlert from '@/components/global/NoNetworkAlert.vue'
import GlobalSpinner from '@/components/global/GlobalSpinner.vue'
</script>

<template>
  <GlobalSpinner />
  <GlobalAlert />
  <NoNetworkAlert />
  <div class="router">
    <RouterView />
  </div>
  <div class="global-controls">
    <UserSwitcherButton />
    <GlobalControls />
  </div>
</template>

<style scoped>

.router {
  view-transition-name: page;
}

.global-controls {
  position: fixed;
  top: 0.5rem;
  right: 1.5rem;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  view-transition-name: controls;
}
@media (max-width: 768px) {
  .global-controls {
    top: calc(env(safe-area-inset-top) + 0.5rem);
    right: 0.5rem;
    align-items: flex-start;
  }
}
</style>
