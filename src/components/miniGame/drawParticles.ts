import type { Particle } from './types'
import { drawMiniHeart } from './drawHelpers'

export function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  const alpha = p.life / p.maxLife
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)

  if (p.type === 'heart') {
    drawMiniHeart(ctx, 0, -p.size / 2, p.size, p.color)
  } else if (p.type === 'petal') {
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // 4-point sparkle star
    ctx.fillStyle = p.color
    ctx.beginPath()
    const s = p.size
    ctx.moveTo(0, -s)
    ctx.lineTo(s * 0.3, -s * 0.3)
    ctx.lineTo(s, 0)
    ctx.lineTo(s * 0.3, s * 0.3)
    ctx.lineTo(0, s)
    ctx.lineTo(-s * 0.3, s * 0.3)
    ctx.lineTo(-s, 0)
    ctx.lineTo(-s * 0.3, -s * 0.3)
    ctx.closePath()
    ctx.fill()
  }

  ctx.restore()
}