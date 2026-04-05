<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  value: number
  labelKey: string
  pad?: boolean
  index?: number
}>()

const { t } = useI18n()

const display = computed(() =>
  props.pad ? String(props.value).padStart(2, '0') : String(props.value),
)

const ticking = ref(false)
let tickTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.value, () => {
  ticking.value = true
  if (tickTimer) clearTimeout(tickTimer)
  tickTimer = setTimeout(() => { ticking.value = false }, 120)
})

onUnmounted(() => {
  if (tickTimer) clearTimeout(tickTimer)
})
</script>

<template>
  <div
    class="cd-tile"
    :class="{ 'cd-tile--tick': ticking }"
    :style="{ '--i': index ?? 0 }"
  >
    <span class="cd-tile__value">{{ display }}</span>
    <span class="cd-tile__label">{{ t(labelKey) }}</span>
  </div>
</template>

<style scoped>
.cd-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 58px;
  padding: 0.55rem 0.4rem;
  background: color-mix(in srgb, var(--p-primary-400, #a78bfa) 6%, var(--color-surface-soft));
  border: 1px solid color-mix(in srgb, var(--p-primary-400, #a78bfa) 15%, var(--color-border));
  border-radius: 12px;
  box-shadow: var(--shadow-card);
  animation: cdTileIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i) * 0.08s);
}

.cd-tile__value {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-text-strong);
  font-variant-numeric: tabular-nums;
  transition: opacity 0.18s cubic-bezier(0.22, 1, 0.36, 1), transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}

.cd-tile__label {
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.cd-tile--tick .cd-tile__value {
  opacity: 0.25;
  transform: translateY(-3px) scale(0.96);
}

@keyframes cdTileIn {
  0%   { opacity: 0; transform: scale(0.88) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@media (max-width: 480px) {
  .cd-tile {
    min-width: 46px;
    padding: 0.45rem 0.3rem;
  }

  .cd-tile__value {
    font-size: 1.25rem;
  }

  .cd-tile__label {
    font-size: 0.58rem;
    margin-top: 2px;
  }
}

@media (max-width: 360px) {
  .cd-tile {
    min-width: 40px;
    padding: 0.4rem 0.25rem;
  }

  .cd-tile__value {
    font-size: 1.1rem;
  }

  .cd-tile__label {
    font-size: 0.55rem;
  }
}
</style>
