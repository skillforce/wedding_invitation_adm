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
  <div v-if="weddingDate" class="countdown-wrap">
    <div v-if="isToday" class="countdown-today">
      {{ t('checklist.countdown.today') }}
    </div>

    <div v-else-if="isPassed" class="countdown-passed">
      {{ t('checklist.countdown.passed') }}
    </div>

    <div v-else-if="timeLeft" class="countdown">
      <p class="countdown-title">{{ t('checklist.countdown.title') }}</p>
      <div class="countdown-units">
        <template v-for="(unit, i) in COUNTDOWN_UNITS" :key="unit.key">
          <span v-if="i > 0" class="countdown-sep">:</span>
          <CountdownUnit
            :value="timeLeft[unit.key]"
            :label-key="unit.labelKey"
            :pad="unit.pad"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.countdown-wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 20px 24px;
}

.countdown {
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.countdown-title {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.countdown-units {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}


.countdown-sep {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-muted);
  align-self: flex-start;
  margin-top: 2px;
  line-height: 1.75rem;
}

.countdown-today {
  background: color-mix(in srgb, var(--p-green-500) 12%, var(--color-surface-soft));
  border: 1px solid color-mix(in srgb, var(--p-green-500) 35%, transparent);
  border-radius: 14px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--p-green-500);
  text-align: center;
}

.countdown-passed {
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-align: center;
}

@media (max-width: 480px) {
  .countdown-wrap {
    padding: 0 16px 16px;
  }

  .countdown {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>