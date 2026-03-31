import type { GameColors } from '@/themes'
import type { Cloud } from './types'

export function drawSky(ctx: CanvasRenderingContext2D, W: number, groundY: number, colors: GameColors) {
  const grad = ctx.createLinearGradient(0, 0, 0, groundY)
  grad.addColorStop(0, colors.sky[0])
  grad.addColorStop(0.5, colors.sky[1])
  grad.addColorStop(1, colors.sky[2])
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, groundY)
}

export function drawGround(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  groundY: number,
  colors: GameColors,
) {
  const grad = ctx.createLinearGradient(0, groundY, 0, H)
  grad.addColorStop(0, colors.ground)
  grad.addColorStop(1, colors.groundDark)
  ctx.fillStyle = grad
  ctx.fillRect(0, groundY, W, H - groundY)

  ctx.strokeStyle = colors.groundLine
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, groundY)
  ctx.lineTo(W, groundY)
  ctx.stroke()

  ctx.setLineDash([8, 12])
  ctx.strokeStyle = colors.groundLine
  ctx.globalAlpha = 0.4
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, groundY + 15)
  ctx.lineTo(W, groundY + 15)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1
}

export function drawCloud(ctx: CanvasRenderingContext2D, c: Cloud, colors: GameColors) {
  ctx.fillStyle = colors.cloud
  ctx.beginPath()
  ctx.ellipse(c.x, c.y, c.w / 2, c.h / 2, 0, 0, Math.PI * 2)
  ctx.ellipse(c.x - c.w * 0.25, c.y + 3, c.w * 0.3, c.h * 0.4, 0, 0, Math.PI * 2)
  ctx.ellipse(c.x + c.w * 0.25, c.y + 2, c.w * 0.35, c.h * 0.45, 0, 0, Math.PI * 2)
  ctx.fill()
}

export function drawFlower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.fillStyle = color
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2
    ctx.beginPath()
    ctx.arc(x + Math.cos(a) * size * 0.5, y + Math.sin(a) * size * 0.5, size * 0.4, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = '#ffd54f'
  ctx.beginPath()
  ctx.arc(x, y, size * 0.25, 0, Math.PI * 2)
  ctx.fill()
}

export function drawGrass(ctx: CanvasRenderingContext2D, x: number, groundY: number, size: number) {
  ctx.strokeStyle = '#7cb342'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(x, groundY + 5)
  ctx.quadraticCurveTo(x - 3, groundY + 5 - size * 1.5, x - 2, groundY + 5 - size * 2)
  ctx.moveTo(x, groundY + 5)
  ctx.quadraticCurveTo(x + 2, groundY + 5 - size * 1.2, x + 4, groundY + 5 - size * 1.8)
  ctx.stroke()
}