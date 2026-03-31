<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { GameLoop, init, initKeys, offKey, onKey } from 'kontra'
import { getThemeDefinition } from '@/themes'
import { usePreferencesStore } from '@/stores/preferences'
import {
  BEST_SCORE_KEY,
  DECO_COLORS,
  DECO_TYPES,
  OBSTACLE_DIMS,
  PARTICLE_COLORS,
  PHYSICS,
} from './config'
import type { Cloud, GroundDeco, Obstacle, Particle } from './types'
import { drawBride } from './drawBride'
import { drawCake, drawChampagne, drawRing } from './drawObstacles'
import { drawCloud, drawFlower, drawGrass, drawGround, drawSky } from './drawEnvironment'
import { drawParticle } from './drawParticles'

const emit = defineEmits<{
  (e: 'update:score', v: number): void
  (e: 'update:bestScore', v: number): void
  (e: 'update:gameState', v: 'idle' | 'playing' | 'over'): void
}>()

const preferencesStore = usePreferencesStore()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const wrapperRef = ref<HTMLDivElement | null>(null)

const jumpFn = ref<() => void>(() => {})
defineExpose({ jump: () => jumpFn.value() })

let loopCleanup: (() => void) | null = null

function startLoop() {
  const canvas = canvasRef.value
  const wrapper = wrapperRef.value
  if (!canvas || !wrapper) return

  // ── DPR-aware resize ──────────────────────────────────────
  // canvas.width/height = physical pixels; all logic uses CSS logical pixels.
  let dpr = window.devicePixelRatio || 1

  const resize = () => {
    dpr = window.devicePixelRatio || 1
    canvas.width = wrapper.clientWidth * dpr
    canvas.height = wrapper.clientHeight * dpr
    canvas.style.width = `${wrapper.clientWidth}px`
    canvas.style.height = `${wrapper.clientHeight}px`
  }
  resize()
  window.addEventListener('resize', resize)

  const { context: ctx } = init(canvas)
  initKeys()

  // Logical CSS pixel dimensions
  const W = () => wrapper.clientWidth
  const H = () => wrapper.clientHeight
  const groundY = () => H() * PHYSICS.GROUND_Y_RATIO

  // ── Sprite scale: 1.0 at 700 px wide, min 0.45 on small phones ──
  const gameScale = () => Math.min(1, Math.max(0.45, W() / 700))

  // Draw fn scaled around a pivot point (px, py)
  function scaleAround(px: number, py: number, s: number, draw: () => void) {
    ctx.save()
    ctx.translate(px, py)
    ctx.scale(s, s)
    ctx.translate(-px, -py)
    draw()
    ctx.restore()
  }

  // ── Mutable game state ──
  let playing = false
  let dead = false
  let localScore = 0
  let speedMult = 1
  const brideX = 80
  let brideY = groundY()
  let brideVy = 0
  let brideFrame = 0
  let squash = 1
  let obstacles: Obstacle[] = []
  let obstacleTimer = 0
  let particles: Particle[] = []

  const clouds: Cloud[] = Array.from({ length: 5 }, () => ({
    x: Math.random() * W(),
    y: 30 + Math.random() * groundY() * 0.4,
    w: 60 + Math.random() * 80,
    h: 20 + Math.random() * 20,
    speed: 20 + Math.random() * 30,
  }))

  const groundDecos: GroundDeco[] = Array.from({ length: 15 }, () => ({
    x: Math.random() * W() * 2,
    type: DECO_TYPES[Math.floor(Math.random() * DECO_TYPES.length)] || 'flower',
    color: DECO_COLORS[Math.floor(Math.random() * DECO_COLORS.length)] || '#fff',
    size: 4 + Math.random() * 6,
  }))

  // ── Particles ──
  function spawnParticle(x: number, y: number, type: Particle['type']) {
    const palette = PARTICLE_COLORS[type]
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 100,
      vy: -50 - Math.random() * 100,
      life: 0.6 + Math.random() * 0.8,
      maxLife: 0.6 + Math.random() * 0.8,
      size: type === 'heart' ? 6 + Math.random() * 6 : 3 + Math.random() * 4,
      color: palette?.[Math.floor(Math.random() * palette.length)] || '#fff',
      type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 4,
    })
  }

  function spawnTrail() {
    if (Math.random() < 0.06) spawnParticle(brideX - 5, brideY - 10, 'petal')
    if (Math.random() < 0.02)
      spawnParticle(brideX + Math.random() * 20, brideY - 40 - Math.random() * 20, 'sparkle')
  }

  // ── Jump ──
  function jump() {
    if (dead) {
      dead = false
      playing = true
      localScore = 0
      speedMult = 1
      obstacles = []
      obstacleTimer = 0
      brideY = groundY()
      brideVy = 0
      squash = 1
      emit('update:score', 0)
      emit('update:gameState', 'playing')
      return
    }
    if (!playing) {
      playing = true
      emit('update:gameState', 'playing')
    }
    if (brideY >= groundY() - 1) {
      brideVy = PHYSICS.JUMP_FORCE
      squash = 1.3
      for (let i = 0; i < 2; i++) spawnParticle(brideX, brideY, 'petal')
    }
  }

  jumpFn.value = jump
  onKey('space', jump)

  // ── Game loop ──
  const loop = GameLoop({
    update(dt: number) {
      if (!playing || dead) return

      localScore += dt * 10 * speedMult
      speedMult = 1 + localScore / 500
      emit('update:score', Math.floor(localScore))

      // Bride physics
      if (brideY < groundY()) brideVy += PHYSICS.GRAVITY * dt
      brideY += brideVy * dt
      if (brideY >= groundY()) {
        brideY = groundY()
        if (squash > 1.05) squash = 0.8
        brideVy = 0
      }
      squash += (1 - squash) * 5 * dt
      brideFrame++
      spawnTrail()

      // Obstacles — reduce speed on narrow (mobile) screens
      const mobileFactor = Math.min(1, Math.max(0.6, W() / 700))
      const spd = PHYSICS.BASE_SPEED * speedMult * mobileFactor
      obstacleTimer -= dt
      if (obstacleTimer <= 0) {
        const types = Object.keys(OBSTACLE_DIMS) as Obstacle['type'][]
        const type = types[Math.floor(Math.random() * types.length)] || 'cake'
        const dims = OBSTACLE_DIMS[type]?.() || { w: 42, h: 56 }
        obstacles.push({ x: W() + 20, type, ...dims })
        obstacleTimer = 1.2 + (Math.random() * 1.5) / Math.min(speedMult, 2.5)
      }
      for (const o of obstacles) o.x -= spd * dt
      obstacles = obstacles.filter((o) => o.x > -80)

      // Collision — hitboxes shrink with gameScale
      const s = gameScale()
      const bBox = { x: brideX - 10 * s, y: brideY - 68 * s, w: 20 * s, h: 68 * s }
      for (const o of obstacles) {
        const oBox = {
          x: o.x - (o.w / 2 - 4) * s,
          y: groundY() - (o.h - 4) * s,
          w: (o.w - 8) * s,
          h: (o.h - 4) * s,
        }
        const hit =
          bBox.x < oBox.x + oBox.w &&
          bBox.x + bBox.w > oBox.x &&
          bBox.y < oBox.y + oBox.h &&
          bBox.y + bBox.h > oBox.y
        if (hit) {
          dead = true
          playing = false
          const best = Number(localStorage.getItem(BEST_SCORE_KEY) || '0')
          const current = Math.floor(localScore)
          if (current > best) {
            localStorage.setItem(BEST_SCORE_KEY, String(current))
            emit('update:bestScore', current)
          }
          emit('update:gameState', 'over')
          for (let i = 0; i < 20; i++) {
            spawnParticle(brideX, brideY - 20, 'heart')
            spawnParticle(brideX, brideY - 20, 'petal')
          }
          break
        }
      }

      // Clouds
      for (const c of clouds) {
        c.x -= c.speed * dt * 0.3
        if (c.x < -c.w) {
          c.x = W() + c.w
          c.y = 30 + Math.random() * groundY() * 0.35
        }
      }

      // Ground decos
      for (const d of groundDecos) {
        d.x -= spd * dt * 0.5
        if (d.x < -20) d.x = W() + 20 + Math.random() * 100
      }

      // Particles
      for (const p of particles) {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vy += 80 * dt
        p.life -= dt
        p.rotation += p.rotationSpeed * dt
      }
      particles = particles.filter((p) => p.life > 0)
    },

    render() {
      // Clear physical pixels, then scale to logical (DPR + game scale)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.scale(dpr, dpr) // everything below is in logical CSS pixels

      const gy = groundY()
      const s = gameScale()
      const colors = getThemeDefinition(preferencesStore.theme).game

      // ── Background (always full canvas, no sprite scale) ──
      drawSky(ctx, W(), gy, colors)
      for (const c of clouds) drawCloud(ctx, c, colors)
      drawGround(ctx, W(), H(), gy, colors)

      // ── Ground decorations (scaled around their base) ──
      for (const d of groundDecos) {
        scaleAround(d.x, gy, s, () => {
          if (d.type === 'flower') drawFlower(ctx, d.x, gy + 8 + d.size, d.size, d.color)
          else if (d.type === 'grass') drawGrass(ctx, d.x, gy, d.size)
        })
      }

      // ── Obstacles (scaled around base of each obstacle) ──
      for (const o of obstacles) {
        scaleAround(o.x, gy, s, () => {
          if (o.type === 'cake') drawCake(ctx, o.x, o.w, o.h, gy)
          else if (o.type === 'ring') drawRing(ctx, o.x, o.w, o.h, gy)
          else drawChampagne(ctx, o.x, o.w, o.h, gy)
        })
      }

      // ── Bride (scaled around her feet) ──
      if (!dead) {
        scaleAround(brideX, brideY, s, () => {
          drawBride(ctx, brideX, brideY, brideFrame, squash, gy)
        })
      }

      // ── Particles ──
      for (const p of particles) drawParticle(ctx, p)

      // ── HUD score ──
      if (playing || dead) {
        const fontSize = Math.round(20 * Math.max(0.75, s))
        ctx.save()
        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.textAlign = 'left'
        ctx.fillStyle = colors.textShadow
        ctx.fillStyle = colors.text
        ctx.fillText(String(Math.floor(localScore)), 15, fontSize + 13)
        const best = Number(localStorage.getItem(BEST_SCORE_KEY) || '0')
        if (best > 0) {
          const smallFont = Math.round(14 * Math.max(0.75, s))
          ctx.font = `${smallFont}px sans-serif`
          ctx.fillStyle = colors.text
          ctx.globalAlpha = 0.5
          ctx.fillText(`Best result : ${best}`, 15, fontSize + 13 + smallFont + 4)
          ctx.globalAlpha = 1
        }
        ctx.restore()
      }

      ctx.restore() // remove DPR scale
    },
  })

  loop.start()

  loopCleanup = () => {
    loop.stop()
    offKey('space')
    window.removeEventListener('resize', resize)

  }
}

onMounted(() => startLoop())
onUnmounted(() => loopCleanup?.())
</script>

<template>
  <div ref="wrapperRef" class="game-canvas-wrapper">
    <canvas ref="canvasRef" class="game-canvas" />
  </div>
</template>

<style scoped>
.game-canvas-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.game-canvas {
  display: block;
  /* CSS size is set dynamically by resize(), don't override here */
}
</style>
