<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAppCommonStore } from '@/stores/app_common.ts'
import alertErrorUrl from '@/assets/alert_error.svg'
import alertSuccessUrl from '@/assets/alert_success.svg'
import closeUrl from '@/assets/close.svg'

const DISMISS_MS = 5000
const appCommon = useAppCommonStore()

interface AlertConfig {
  key: 'error' | 'success'
  iconUrl: string
  cssClass: string
  getMessage: () => string | null
  clear: () => void
}

const ALERTS: AlertConfig[] = [
  {
    key: 'error',
    iconUrl: alertErrorUrl,
    cssClass: 'alert--error',
    getMessage: () => appCommon.errorMessage,
    clear: () => appCommon.clearError(),
  },
  {
    key: 'success',
    iconUrl: alertSuccessUrl,
    cssClass: 'alert--success',
    getMessage: () => appCommon.successMessage,
    clear: () => appCommon.clearSuccess(),
  },
]

const progress = ref<Record<string, number>>({ error: 100, success: 100 })
const rafIds: Record<string, number | null> = { error: null, success: null }
const startTimes: Record<string, number | null> = { error: null, success: null }

function startCountdown(key: string, onDone: () => void) {
  stopCountdown(key)
  progress.value[key] = 100
  startTimes[key] = performance.now()
  const tick = (now: number) => {
    const elapsed = now - startTimes[key]!
    progress.value[key] = Math.max(0, 100 - (elapsed / DISMISS_MS) * 100)
    if (elapsed >= DISMISS_MS) onDone()
    else rafIds[key] = requestAnimationFrame(tick)
  }
  rafIds[key] = requestAnimationFrame(tick)
}

function stopCountdown(key: string) {
  if (rafIds[key] !== null) { cancelAnimationFrame(rafIds[key]!); rafIds[key] = null }
  startTimes[key] = null
}

const messages = computed(() => ({
  error: appCommon.errorMessage,
  success: appCommon.successMessage,
}))

watch(() => messages.value.error, (msg) => {
  if (msg) startCountdown('error', () => appCommon.clearError())
  else stopCountdown('error')
})

watch(() => messages.value.success, (msg) => {
  if (msg) startCountdown('success', () => appCommon.clearSuccess())
  else stopCountdown('success')
})
</script>

<template>
  <Teleport to="body">
    <div class="alerts-container">
      <TransitionGroup name="alert">
        <div
          v-for="alert in ALERTS.filter(a => a.getMessage())"
          :key="alert.key"
          class="alert"
          :class="alert.cssClass"
        >
          <div class="alert-body">
            <img :src="alert.iconUrl" class="alert-icon" alt="" aria-hidden="true" />
            <span class="alert-text">{{ alert.getMessage() }}</span>
            <button class="alert-close" aria-label="Close" @click="alert.clear()">
              <img :src="closeUrl" alt="" aria-hidden="true" width="16" height="16" />
            </button>
          </div>
          <div class="alert-progress-bar">
            <div class="alert-progress-fill" :style="{ width: progress[alert.key] + '%' }" />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.alerts-container {
  position: fixed;
  top: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 320px;
  max-width: min(560px, calc(100vw - 2rem));
}

.alert {
  border-radius: 10px;
  overflow: hidden;
  color: #fff;
}

.alert--error {
  background: #ff3b30;
  box-shadow:
    0 0 0 1px rgba(255, 59, 48, 0.4),
    0 8px 32px rgba(255, 59, 48, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

.alert--success {
  background: #34c759;
  box-shadow:
    0 0 0 1px rgba(52, 199, 89, 0.4),
    0 8px 32px rgba(52, 199, 89, 0.35),
    0 2px 8px rgba(0, 0, 0, 0.25);
}

.alert-body {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1rem;
}

.alert-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  opacity: 0.92;
  filter: brightness(0) invert(1);
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
  cursor: pointer;
  padding: 4px;
  transition: background 0.15s ease;
}

.alert-close img {
  filter: brightness(0) invert(1);
  display: block;
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

.alert-enter-active,
.alert-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}
</style>