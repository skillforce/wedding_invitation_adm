<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ visible: boolean }>()
const { t } = useI18n()

const phaseIndex = ref(0)
const phases = [
  () => t('seating.autoSeatPhase1'),
  () => t('seating.autoSeatPhase2'),
  () => t('seating.autoSeatPhase3'),
]

let interval: ReturnType<typeof setInterval> | null = null

watch(() => props.visible, (v) => {
  if (v) {
    phaseIndex.value = 0
    interval = setInterval(() => {
      phaseIndex.value = (phaseIndex.value + 1) % phases.length
    }, 900)
  } else {
    if (interval) clearInterval(interval)
    interval = null
  }
})

onBeforeUnmount(() => { if (interval) clearInterval(interval) })
</script>

<template>
  <Transition name="magic-overlay">
    <div v-if="visible" class="overlay">
      <!-- expanding rings -->
      <span v-for="i in 4" :key="'ring'+i" class="ring" :style="{ '--d': i }" />

      <!-- orbiting particles -->
      <span v-for="i in 10" :key="'orb'+i" class="orb" :style="{ '--i': i }" />

      <!-- constellation lines -->
      <svg class="constellation" viewBox="0 0 200 200">
        <line x1="60" y1="55" x2="140" y2="70" />
        <line x1="140" y1="70" x2="120" y2="140" />
        <line x1="120" y1="140" x2="50" y2="130" />
        <line x1="50" y1="130" x2="60" y2="55" />
        <line x1="60" y1="55" x2="120" y2="140" />
        <line x1="100" y1="40" x2="60" y2="55" />
        <line x1="100" y1="40" x2="140" y2="70" />
        <line x1="155" y1="120" x2="140" y2="70" />
        <line x1="155" y1="120" x2="120" y2="140" />
      </svg>

      <!-- central glow -->
      <div class="center">
        <div class="glow" />
        <svg class="sparkle-icon" viewBox="0 0 48 48" width="40" height="40">
          <path d="M24 2l3.5 14.5L42 20l-14.5 3.5L24 38l-3.5-14.5L6 20l14.5-3.5z"
                fill="currentColor" />
          <path d="M38 4l1.5 6L46 12l-6.5 1.5L38 20l-1.5-6.5L30 12l6.5-2z"
                fill="currentColor" opacity="0.5" />
          <path d="M12 34l1 4.5L18 40l-5 1L12 46l-1-5-4.5-1 4.5-1.5z"
                fill="currentColor" opacity="0.4" />
        </svg>
      </div>

      <!-- phase text -->
      <Transition name="phase-text" mode="out-in">
        <p class="phase" :key="phaseIndex">{{ phases[phaseIndex]() }}</p>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: absolute;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    ellipse at 50% 45%,
    color-mix(in srgb, var(--color-surface) 92%, transparent),
    color-mix(in srgb, var(--color-surface) 78%, transparent) 70%,
    color-mix(in srgb, var(--color-surface) 96%, transparent)
  );
  backdrop-filter: blur(8px);
  overflow: hidden;
}

/* ── expanding rings ─────────────────────────────────────────── */
.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1.5px solid var(--p-primary-400, #a78bfa);
  transform: translate(-50%, -50%) scale(1);
  opacity: 0;
  animation: ring-expand 3.2s ease-out infinite;
  animation-delay: calc(var(--d) * 0.7s);
}

@keyframes ring-expand {
  0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 0.6; }
  80%  { opacity: 0.08; }
  100% { transform: translate(-50%, -50%) scale(4.5); opacity: 0; }
}

/* ── orbiting particles ──────────────────────────────────────── */
.orb {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--p-primary-300, #c4b5fd);
  box-shadow: 0 0 8px 2px color-mix(in srgb, var(--p-primary-400, #a78bfa) 60%, transparent);
  transform-origin: 0 0;
  opacity: 0;
  animation: orbit 4s linear infinite;
  animation-delay: calc(var(--i) * -0.4s);
}

@keyframes orbit {
  0% {
    opacity: 0;
    transform:
      rotate(calc(var(--i) * 36deg))
      translateX(55px)
      scale(0.6);
  }
  15% { opacity: 0.9; }
  85% { opacity: 0.7; }
  100% {
    opacity: 0;
    transform:
      rotate(calc(var(--i) * 36deg + 360deg))
      translateX(55px)
      scale(0.6);
  }
}

/* ── constellation svg ───────────────────────────────────────── */
.constellation {
  position: absolute;
  width: 260px;
  height: 260px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0;
  animation: constellation-draw 2.8s ease-in-out infinite alternate;
}

.constellation line {
  stroke: var(--p-primary-400, #a78bfa);
  stroke-width: 0.6;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: dash-draw 2.6s ease forwards;
  opacity: 0.3;
}

.constellation line:nth-child(2) { animation-delay: 0.15s; }
.constellation line:nth-child(3) { animation-delay: 0.3s; }
.constellation line:nth-child(4) { animation-delay: 0.45s; }
.constellation line:nth-child(5) { animation-delay: 0.6s; }
.constellation line:nth-child(6) { animation-delay: 0.75s; }
.constellation line:nth-child(7) { animation-delay: 0.9s; }
.constellation line:nth-child(8) { animation-delay: 1.05s; }
.constellation line:nth-child(9) { animation-delay: 1.2s; }

@keyframes dash-draw {
  to { stroke-dashoffset: 0; }
}

@keyframes constellation-draw {
  0%   { opacity: 0.15; transform: translate(-50%, -50%) rotate(-2deg) scale(0.95); }
  100% { opacity: 0.35; transform: translate(-50%, -50%) rotate(2deg) scale(1.05); }
}

/* ── central glow + sparkle ──────────────────────────────────── */
.center {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.glow {
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--p-primary-500, #8b5cf6) 35%, transparent),
    transparent 70%
  );
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50%      { transform: scale(1.3); opacity: 1; }
}

.sparkle-icon {
  color: var(--p-primary-300, #c4b5fd);
  filter: drop-shadow(0 0 14px color-mix(in srgb, var(--p-primary-400, #a78bfa) 70%, transparent));
  animation: sparkle-spin 6s linear infinite;
  z-index: 1;
}

@keyframes sparkle-spin {
  0%   { transform: rotate(0deg) scale(1); }
  25%  { transform: rotate(90deg) scale(1.1); }
  50%  { transform: rotate(180deg) scale(1); }
  75%  { transform: rotate(270deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}

/* ── phase text ──────────────────────────────────────────────── */
.phase {
  margin: 1.4rem 0 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-title);
  letter-spacing: 0.04em;
  text-align: center;
  z-index: 2;
}

.phase-text-enter-active,
.phase-text-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.phase-text-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.phase-text-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── overlay transition ──────────────────────────────────────── */
.magic-overlay-enter-active {
  transition: opacity 0.35s ease;
}
.magic-overlay-leave-active {
  transition: opacity 0.5s ease;
}
.magic-overlay-enter-from,
.magic-overlay-leave-to {
  opacity: 0;
}
</style>