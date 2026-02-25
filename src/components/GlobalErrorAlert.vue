<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAppCommonStore } from '@/stores/app_common'

const DISMISS_MS = 5000

const appCommon = useAppCommonStore()
const progress = ref(100)

let rafId: number | null = null
let startTime: number | null = null

function startCountdown() {
  stopCountdown()
  progress.value = 100
  startTime = performance.now()

  const tick = (now: number) => {
    const elapsed = now - startTime!
    progress.value = Math.max(0, 100 - (elapsed / DISMISS_MS) * 100)

    if (elapsed >= DISMISS_MS) {
      appCommon.clearError()
    } else {
      rafId = requestAnimationFrame(tick)
    }
  }

  rafId = requestAnimationFrame(tick)
}

function stopCountdown() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  startTime = null
}

watch(
  () => appCommon.errorMessage,
  (msg) => {
    if (msg) {
      startCountdown()
    } else {
      stopCountdown()
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="error-alert">
      <div v-if="appCommon.errorMessage" class="global-error-alert">
        <div class="alert-body">
          <span class="alert-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
              <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clip-rule="evenodd" />
            </svg>
          </span>
          <span class="alert-text">{{ appCommon.errorMessage }}</span>
          <button class="alert-close" aria-label="Close" @click="appCommon.clearError()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
        <div class="alert-progress-bar">
          <div class="alert-progress-fill" :style="{ width: progress + '%' }" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.global-error-alert {
  position: fixed;
  top: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  min-width: 320px;
  max-width: min(560px, calc(100vw - 2rem));
  border-radius: 10px;
  overflow: hidden;
  background: #ff3b30;
  color: #fff;
  box-shadow:
    0 0 0 1px rgba(255, 59, 48, 0.4),
    0 8px 32px rgba(255, 59, 48, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

.alert-body {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
}

.alert-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  opacity: 0.92;
}

.alert-text {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;
}

.alert-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.18);
  border: none;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  padding: 4px;
  transition: background 0.15s ease;
}

.alert-close:hover {
  background: rgba(255, 255, 255, 0.32);
}

.alert-progress-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
}

.alert-progress-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.75);
  transition: width 0.05s linear;
}

.error-alert-enter-active,
.error-alert-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.error-alert-enter-from,
.error-alert-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px) scale(0.97);
}
</style>