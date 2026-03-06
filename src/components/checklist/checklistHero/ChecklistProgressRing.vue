<template>
  <div class="progress-ring-wrap">
    <svg viewBox="0 0 120 120" class="progress-ring">
      <circle
        class="ring-bg"
        cx="60" cy="60" r="52"
        fill="none"
        stroke-width="10"
      />
      <circle
        class="ring-fill"
        cx="60" cy="60" r="52"
        fill="none"
        stroke-width="10"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
      <text x="60" y="56" class="ring-pct" text-anchor="middle" dominant-baseline="middle">
        {{ donePct }}%
      </text>
      <text x="60" y="72" class="ring-label" text-anchor="middle">
        {{ t('checklist.done') }}
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  donePct: number
}>()

const { t } = useI18n()

const radius = 52
const circumference = 2 * Math.PI * radius
const dashOffset = computed(() => circumference * (1 - props.donePct / 100))
</script>

<style scoped>
.progress-ring-wrap {
  flex-shrink: 0;
  width: 180px;
  height: 180px;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  stroke: var(--color-border);
}

.ring-fill {
  stroke: #7aad8c;
  transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.ring-pct {
  font-size: 20px;
  font-weight: 700;
  fill: var(--color-title);
  transform: rotate(90deg);
  transform-origin: 60px 60px;
}

.ring-label {
  font-size: 11px;
  fill: var(--color-text-muted);
  transform: rotate(90deg);
  transform-origin: 60px 60px;
}

@media (max-width: 480px) {
  .progress-ring-wrap {
    width: 130px;
    height: 130px;
    align-self: center;
  }
}
</style>
