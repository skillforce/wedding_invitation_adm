<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { GameState } from './types'

defineProps<{
  gameState: GameState
  score: number
  bestScore: number
}>()

const emit = defineEmits<{
  (e: 'jump'): void
}>()

const { t } = useI18n()

function onInteract(event: Event) {
  event.preventDefault()
  emit('jump')
}
</script>

<template>
  <!-- Idle screen -->
  <Transition name="fade">
    <div
      v-if="gameState === 'idle'"
      class="overlay"
      @pointerdown="onInteract"
      @touchstart.prevent="onInteract"
    >
      <div class="overlay-content">
        <h1 class="game-title">{{ t('miniGame.title') }}</h1>
        <p class="game-subtitle">{{ t('miniGame.subtitle') }}</p>
        <div class="heart-icon">💒</div>
      </div>
    </div>
  </Transition>

  <!-- Game over screen -->
  <Transition name="fade">
    <div
      v-if="gameState === 'over'"
      class="overlay overlay-over"
      @pointerdown="onInteract"
      @touchstart.prevent="onInteract"
    >
      <div class="overlay-content">
        <h2 class="game-over-title">{{ t('miniGame.gameOver') }}</h2>
        <div class="score-display">
          <span class="score-label">{{ t('miniGame.score') }}</span>
          <span class="score-value">{{ score }}</span>
        </div>
        <div v-if="bestScore > 0" class="score-display best">
          <span class="score-label">{{ t('miniGame.best') }}</span>
          <span class="score-value">{{ bestScore }}</span>
        </div>
        <p class="game-subtitle">{{ t('miniGame.restart') }}</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 228, 236, 0.85);
  backdrop-filter: blur(6px);
  z-index: 10;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}

.overlay-over {
  background: rgba(123, 45, 95, 0.15);
  backdrop-filter: blur(8px);
}

.overlay-content {
  text-align: center;
  padding: 2rem;
  pointer-events: none;
}

.game-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #7b2d5f;
  margin: 0 0 0.5rem;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.8);
}

.game-over-title {
  font-size: 2rem;
  font-weight: 800;
  color: #7b2d5f;
  margin: 0 0 1rem;
}

.game-subtitle {
  font-size: 1rem;
  color: #a04080;
  margin: 0.75rem 0 0;
}

.heart-icon {
  font-size: 3rem;
  margin-top: 1rem;
  animation: heartBounce 1.5s ease-in-out infinite;
}

.score-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 0.5rem 0;
}

.score-label {
  font-size: 1rem;
  color: #a04080;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.score-value {
  font-size: 2rem;
  font-weight: 800;
  color: #7b2d5f;
}

.score-display.best .score-value {
  font-size: 1.3rem;
  color: #d4a017;
}

.score-display.best .score-label {
  font-size: 0.85rem;
  color: #c09020;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes heartBounce {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.1);
  }
}
</style>