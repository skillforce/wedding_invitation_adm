<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import CountdownUnit from './CountdownUnit.vue'
import { COUNTDOWN_UNITS } from './countdownConfig'

const { t } = useI18n()
const authStore = useAuthStore()

const weddingDate = computed(() => {
  const raw = authStore.user?.profile?.weddingDate
  if (!raw) return null
  const d = new Date(raw)
  d.setHours(0, 0, 0, 0)
  return d
})

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const timeLeft = ref<TimeLeft | null>(null)
const isPassed = ref(false)
const isToday = ref(false)

function calculate() {
  if (!weddingDate.value) return

  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  const diff = weddingDate.value.getTime() - today.getTime()

  if (diff === 0) {
    isToday.value = true
    isPassed.value = false
    timeLeft.value = null
    return
  }

  if (diff < 0) {
    isPassed.value = true
    isToday.value = false
    timeLeft.value = null
    return
  }

  isPassed.value = false
  isToday.value = false

  const totalSeconds = Math.floor((weddingDate.value.getTime() - now.getTime()) / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  timeLeft.value = { days, hours, minutes, seconds }
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  calculate()
  timer = setInterval(calculate, 1000)
})

onUnmounted(() => {
  if (timer !== null) clearInterval(timer)
})
</script>

<template>
  <div v-if="weddingDate" class="cd-wrap">
    <!-- TODAY STATE -->
    <div v-if="isToday" class="cd-card cd-card--today">
      <div class="cd-today">
        <i class="pi pi-heart-fill cd-today__icon" />
        <span class="cd-today__text">{{ t('checklist.countdown.today') }}</span>
      </div>
    </div>

    <!-- PASSED STATE -->
    <div v-else-if="isPassed" class="cd-card cd-card--passed">
      <i class="pi pi-check-circle cd-passed__icon" />
      <span class="cd-passed__text">{{ t('checklist.countdown.passed') }}</span>
    </div>

    <!-- COUNTDOWN STATE -->
    <div v-else-if="timeLeft" class="cd-card">
      <p class="cd-card__title">{{ t('checklist.countdown.title') }}</p>
      <div class="cd-grid">
        <template v-for="(unit, i) in COUNTDOWN_UNITS" :key="unit.key">
          <span v-if="i > 0" class="cd-sep" :style="{ '--i': i }">:</span>
          <CountdownUnit
            :value="timeLeft[unit.key]"
            :label-key="unit.labelKey"
            :pad="unit.pad"
            :index="i"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cd-wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 20px 24px;
}

.cd-card {
  position: relative;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  box-shadow: var(--shadow-card);
  text-align: center;
  animation: phaseIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  overflow: hidden;
}

.cd-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 24px;
  right: 24px;
  height: 2px;
  border-radius: 0 0 2px 2px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--p-primary-400, #a78bfa) 55%, transparent),
    transparent
  );
}

.cd-card__title {
  margin: 0 0 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.cd-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.cd-sep {
  font-size: 1.75rem;
  font-weight: 700;
  color: color-mix(in srgb, var(--p-primary-400, #a78bfa) 40%, var(--color-text-muted));
  align-self: flex-start;
  margin-top: 6px;
  line-height: 2rem;
  animation: cdTileIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i) * 0.08s);
}

/* TODAY STATE */
.cd-card--today {
  background: color-mix(in srgb, var(--p-green-500) 10%, var(--color-surface-soft));
  border-color: color-mix(in srgb, var(--p-green-500) 30%, transparent);
}

.cd-card--today::before {
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--p-green-500) 55%, transparent),
    transparent
  );
}

.cd-today {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.25rem 0;
}

.cd-today__icon {
  font-size: 1.5rem;
  color: var(--p-green-500);
  animation: cdPulse 2s ease-in-out infinite;
}

.cd-today__text {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--p-green-500);
}

/* PASSED STATE */
.cd-card--passed {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0.65;
}

.cd-passed__icon {
  font-size: 1rem;
  color: var(--color-text-muted);
}

.cd-passed__text {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

/* KEYFRAMES */
@keyframes phaseIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes cdTileIn {
  0%   { opacity: 0; transform: scale(0.88) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes cdPulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.2); }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .cd-card {
    padding: 1.25rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .cd-wrap {
    padding: 0 12px 16px;
  }

  .cd-card {
    padding: 0.875rem 0.75rem;
  }

  .cd-grid {
    gap: 0.25rem;
  }

  .cd-sep {
    font-size: 1.25rem;
    margin-top: 4px;
    line-height: 1.6rem;
  }
}

@media (max-width: 360px) {
  .cd-card {
    padding: 0.75rem;
    border-radius: 12px;
  }
}
</style>
