<script setup lang="ts">
import { ref } from 'vue'
import { BEST_SCORE_KEY } from '@/components/miniGame/config'
import type { GameState } from '@/components/miniGame/types'
import GameCanvas from '@/components/miniGame/GameCanvas.vue'
import GameOverlay from '@/components/miniGame/GameOverlay.vue'

const gameCanvasRef = ref<InstanceType<typeof GameCanvas> | null>(null)

const score = ref(0)
const bestScore = ref(Number(localStorage.getItem(BEST_SCORE_KEY) || '0'))
const gameState = ref<GameState>('idle')

function onJump() {
  gameCanvasRef.value?.jump()
}

function onGameStateUpdate(state: GameState) {
  gameState.value = state
}

function onBestScoreUpdate(value: number) {
  bestScore.value = value
}
</script>

<template>
  <div class="mini-game-page">
    <div
      class="game-wrapper"
      @pointerdown="gameState === 'playing' ? onJump() : undefined"
      @touchstart.prevent="gameState === 'playing' ? onJump() : undefined"
    >
      <GameCanvas
        ref="gameCanvasRef"
        @update:score="score = $event"
        @update:best-score="onBestScoreUpdate"
        @update:game-state="onGameStateUpdate"
      />
      <GameOverlay
        :game-state="gameState"
        :score="score"
        :best-score="bestScore"
        @jump="onJump"
      />
    </div>
  </div>
</template>

<style scoped>
.mini-game-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.game-wrapper {
  flex: 1;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: #ffe4ec;
  box-shadow: var(--shadow-card);
  min-height: 300px;
  touch-action: none;
}
</style>