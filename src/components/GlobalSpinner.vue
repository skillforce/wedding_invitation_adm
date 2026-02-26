<script setup lang="ts">
import { useAppCommonStore } from '@/stores/app_common'

const appCommon = useAppCommonStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="spinner-fade">
      <div v-if="appCommon.isLoading" class="spinner-backdrop" aria-hidden="true">
        <div class="spinner-ring">
          <div /><div /><div /><div />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.spinner-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99998;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

/* Lds-ring loader */
.spinner-ring {
  position: relative;
  width: 52px;
  height: 52px;
}

.spinner-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 44px;
  height: 44px;
  margin: 4px;
  border: 4px solid transparent;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spinner-rotate 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring div:nth-child(1) { animation-delay: -0.3s; }
.spinner-ring div:nth-child(2) { animation-delay: -0.2s; }
.spinner-ring div:nth-child(3) { animation-delay: -0.1s; }

@keyframes spinner-rotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.spinner-fade-enter-active,
.spinner-fade-leave-active {
  transition: opacity 0.18s ease;
}

.spinner-fade-enter-from,
.spinner-fade-leave-to {
  opacity: 0;
}
</style>