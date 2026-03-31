import { OBSTACLE_COLORS } from './config'
import { drawMiniHeart } from './drawHelpers'

// ─── Wedding Cake ─────────────────────────────────────────────────────────────
export function drawCake(
  ctx: CanvasRenderingContext2D,
  x: number,
  w: number,
  h: number,
  groundY: number,
) {
  const tiers = [
    { yFrac: 0, hFrac: 0.38, wFrac: 1 },
    { yFrac: 0.38, hFrac: 0.33, wFrac: 0.68 },
    { yFrac: 0.71, hFrac: 0.29, wFrac: 0.4 },
  ]

  const board = 3
  // Cake board
  ctx.fillStyle = '#f0e0d0'
  ctx.beginPath()
  ctx.roundRect(x - w / 2 - 2, groundY - board, w + 4, board, 1)
  ctx.fill()
  ctx.strokeStyle = '#dcc8b0'
  ctx.lineWidth = 0.5
  ctx.stroke()

  for (let t = 0; t < tiers.length; t++) {
    const tier = tiers[t] || { yFrac: 0, hFrac: 0, wFrac: 0 }
    const tw = w * tier.wFrac
    const th = h * tier.hFrac
    const ty = groundY - board - h * tier.yFrac! - th
    const tx = x - tw / 2

    // Fondant base — side face (slightly darker)
    const sideGrad = ctx.createLinearGradient(tx, ty, tx + tw, ty)
    sideGrad.addColorStop(0, '#e8d8cc')
    sideGrad.addColorStop(0.15, '#fdf6f0')
    sideGrad.addColorStop(0.5, '#fffaf8')
    sideGrad.addColorStop(0.85, '#f5eae2')
    sideGrad.addColorStop(1, '#e0cfc4')
    ctx.fillStyle = sideGrad
    ctx.beginPath()
    ctx.roundRect(tx, ty, tw, th, [2, 2, 0, 0])
    ctx.fill()

    // Top face (elliptical perspective cap)
    const capH = Math.max(3, tw * 0.12)
    ctx.fillStyle = '#fffcfb'
    ctx.beginPath()
    ctx.ellipse(x, ty, tw / 2, capH, 0, 0, Math.PI * 2)
    ctx.fill()

    // Piping — top edge
    ctx.fillStyle = t === 0 ? '#ffc1e3' : t === 1 ? '#f8a8d4' : '#f090c4'
    for (let i = 0; i <= Math.floor(tw / 5); i++) {
      const px = tx + i * (tw / Math.floor(tw / 5))
      ctx.beginPath()
      ctx.arc(px, ty - capH + 1, 1.8, 0, Math.PI * 2)
      ctx.fill()
    }

    // Piping — bottom edge
    ctx.fillStyle = '#fff0f8'
    for (let i = 0; i <= Math.floor(tw / 5); i++) {
      const px = tx + i * (tw / Math.floor(tw / 5))
      ctx.beginPath()
      ctx.arc(px, ty + th, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }

    // Decorative dots / pearls on sides
    if (t < 2) {
      ctx.fillStyle = '#e8b8d8'
      const rows = Math.max(1, Math.floor(th / 8))
      for (let row = 1; row <= rows; row++) {
        const dotY = ty + (th / (rows + 1)) * row
        const dotsCount = Math.floor(tw / 8)
        for (let d = 0; d < dotsCount; d++) {
          const dotX = tx + 5 + d * (tw - 10) / Math.max(1, dotsCount - 1)
          ctx.beginPath()
          ctx.arc(dotX, dotY, 1.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    // Fondant outline
    ctx.strokeStyle = 'rgba(180,140,120,0.25)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.roundRect(tx, ty, tw, th, [2, 2, 0, 0])
    ctx.stroke()
  }

  // Top tier sugar rose topper
  const topTier = tiers[2] || { wFrac: 0, hFrac: 0 }
  const topTW = w * topTier.wFrac
  const topTY = groundY - board - h
  const roseX = x
  const roseY = topTY - 6

  // Rose petals
  const roseColors = ['#ff4d80', '#ff6090', '#ff80a0', '#ffa0b8']
  for (let layer = 3; layer >= 0; layer--) {
    const r = 3 + layer * 0.8
    const petals = 5 + layer
    ctx.fillStyle = roseColors[Math.min(layer, roseColors.length - 1)] || '#ff4d80'
    for (let p = 0; p < petals; p++) {
      const a = (p / petals) * Math.PI * 2 + layer * 0.4
      ctx.beginPath()
      ctx.ellipse(
        roseX + Math.cos(a) * r * 0.55,
        roseY + Math.sin(a) * r * 0.55,
        r * 0.55,
        r * 0.35,
        a,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }
  }
  ctx.fillStyle = '#ff2060'
  ctx.beginPath()
  ctx.arc(roseX, roseY, 2.2, 0, Math.PI * 2)
  ctx.fill()

  // Small heart above
  drawMiniHeart(ctx, roseX - 3, topTY - 16, 6, OBSTACLE_COLORS.heart)
  void topTW
}

// ─── Engagement Ring ──────────────────────────────────────────────────────────
export function drawRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  w: number,
  h: number,
  groundY: number,
) {
  const cy = groundY - h * 0.48
  const rx = w * 0.44
  const ry = h * 0.44

  // Band shadow
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.ellipse(x + 1, cy + 1, rx, ry, 0, 0, Math.PI * 2)
  ctx.stroke()

  // Band — back half (darker)
  ctx.strokeStyle = '#B8960C'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.ellipse(x, cy, rx, ry, 0, 0, Math.PI)
  ctx.stroke()

  // Band — front half (lighter)
  const bandGrad = ctx.createLinearGradient(x - rx, cy, x + rx, cy)
  bandGrad.addColorStop(0, '#C8A000')
  bandGrad.addColorStop(0.3, '#FFE55C')
  bandGrad.addColorStop(0.5, '#FFF5A0')
  bandGrad.addColorStop(0.7, '#FFE040')
  bandGrad.addColorStop(1, '#C8A000')
  ctx.strokeStyle = bandGrad
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.ellipse(x, cy, rx, ry, 0, Math.PI, Math.PI * 2)
  ctx.stroke()

  // Band highlight (thin inner shine)
  ctx.strokeStyle = 'rgba(255,255,220,0.6)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.ellipse(x, cy, rx - 2, ry - 1, 0, Math.PI + 0.4, Math.PI * 2 - 0.4)
  ctx.stroke()

  // Diamond mount (prongs base)
  const dtx = x
  const dty = cy - ry
  ctx.fillStyle = '#D4A800'
  ctx.beginPath()
  ctx.roundRect(dtx - 6, dty - 4, 12, 6, 1)
  ctx.fill()

  // Prongs (4)
  ctx.strokeStyle = '#E8C030'
  ctx.lineWidth = 1.2
  ctx.lineCap = 'round'
  for (const px of [-5, -2.5, 2.5, 5]) {
    ctx.beginPath()
    ctx.moveTo(dtx + px, dty - 2)
    ctx.lineTo(dtx + px * 0.6, dty - 11)
    ctx.stroke()
  }

  // Diamond — brilliant cut (top-down view)
  const dx = dtx
  const dy = dty - 11
  const ds = 7.5 // half-size

  // Table (top facet)
  const tableGrad = ctx.createLinearGradient(dx - ds * 0.5, dy - ds * 0.5, dx + ds * 0.5, dy + ds * 0.5)
  tableGrad.addColorStop(0, '#e8f8ff')
  tableGrad.addColorStop(0.5, '#c0eeff')
  tableGrad.addColorStop(1, '#90d8f8')
  ctx.fillStyle = tableGrad
  ctx.beginPath()
  ctx.moveTo(dx, dy - ds)         // top
  ctx.lineTo(dx + ds, dy)          // right
  ctx.lineTo(dx, dy + ds)          // bottom
  ctx.lineTo(dx - ds, dy)          // left
  ctx.closePath()
  ctx.fill()

  // Facet lines
  ctx.strokeStyle = 'rgba(100,180,220,0.7)'
  ctx.lineWidth = 0.6
  const corners = [
    [dx, dy - ds],
    [dx + ds, dy],
    [dx, dy + ds],
    [dx - ds, dy],
  ]
  for (const [fx, fy] of corners) {
    ctx.beginPath()
    ctx.moveTo(dx, dy)
    ctx.lineTo(fx || 0, fy || dy)
    ctx.stroke()
  }
  // Star facets
  ctx.strokeStyle = 'rgba(200,240,255,0.8)'
  ctx.lineWidth = 0.4
  for (let i = 0; i < 4; i++) {
    const a1 = (i / 4) * Math.PI * 2
    const a2 = ((i + 0.5) / 4) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(dx + Math.cos(a1) * ds, dy + Math.sin(a1) * ds)
    ctx.lineTo(dx + Math.cos(a2) * ds * 0.6, dy + Math.sin(a2) * ds * 0.6)
    ctx.stroke()
  }

  // Diamond outline
  ctx.strokeStyle = 'rgba(80,160,200,0.5)'
  ctx.lineWidth = 0.7
  ctx.beginPath()
  ctx.moveTo(dx, dy - ds)
  ctx.lineTo(dx + ds, dy)
  ctx.lineTo(dx, dy + ds)
  ctx.lineTo(dx - ds, dy)
  ctx.closePath()
  ctx.stroke()

  // Sparkle / flash
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.beginPath()
  ctx.arc(dx - ds * 0.3, dy - ds * 0.3, 1.2, 0, Math.PI * 2)
  ctx.fill()
  // Cross sparkle
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 0.7
  ctx.beginPath()
  ctx.moveTo(dx + ds * 0.6, dy - ds * 0.7)
  ctx.lineTo(dx + ds * 0.6, dy - ds * 0.3)
  ctx.moveTo(dx + ds * 0.4, dy - ds * 0.5)
  ctx.lineTo(dx + ds * 0.8, dy - ds * 0.5)
  ctx.stroke()
}

// ─── Champagne Flute ──────────────────────────────────────────────────────────
export function drawChampagne(
  ctx: CanvasRenderingContext2D,
  x: number,
  w: number,
  h: number,
  groundY: number,
) {
  const glassH = h * 0.72
  const stemH = h * 0.22
  const baseH = h * 0.06
  const bowlW = w * 0.9

  const top = groundY - glassH - stemH - baseH
  const bowlBottom = groundY - stemH - baseH

  // ── Base ──
  ctx.fillStyle = '#b0c8e0'
  ctx.beginPath()
  ctx.ellipse(x, groundY - baseH / 2, bowlW * 0.7, baseH, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(120,160,200,0.5)'
  ctx.lineWidth = 0.5
  ctx.stroke()

  // Base shine
  ctx.fillStyle = 'rgba(220,240,255,0.5)'
  ctx.beginPath()
  ctx.ellipse(x - 3, groundY - baseH / 2, bowlW * 0.25, baseH * 0.4, 0, 0, Math.PI * 2)
  ctx.fill()

  // ── Stem ──
  const stemGrad = ctx.createLinearGradient(x - 3, 0, x + 3, 0)
  stemGrad.addColorStop(0, 'rgba(180,210,240,0.6)')
  stemGrad.addColorStop(0.4, 'rgba(230,245,255,0.9)')
  stemGrad.addColorStop(0.6, 'rgba(230,245,255,0.9)')
  stemGrad.addColorStop(1, 'rgba(160,195,230,0.6)')
  ctx.fillStyle = stemGrad
  ctx.beginPath()
  ctx.roundRect(x - 2, bowlBottom, 4, stemH, 1)
  ctx.fill()
  ctx.strokeStyle = 'rgba(140,180,220,0.4)'
  ctx.lineWidth = 0.5
  ctx.stroke()

  // ── Champagne liquid fill (clipped to bowl shape) ──
  ctx.save()
  const liquidTop = top + glassH * 0.18  // ~82% full
  const liquidBottomW = bowlW * 0.28
  const liquidTopW = bowlW * 0.9

  ctx.beginPath()
  ctx.moveTo(x - liquidBottomW, bowlBottom)
  ctx.bezierCurveTo(x - liquidBottomW * 1.1, bowlBottom - glassH * 0.3, x - liquidTopW / 2, liquidTop + 4, x - liquidTopW / 2, liquidTop)
  ctx.lineTo(x + liquidTopW / 2, liquidTop)
  ctx.bezierCurveTo(x + liquidTopW / 2, liquidTop + 4, x + liquidBottomW * 1.1, bowlBottom - glassH * 0.3, x + liquidBottomW, bowlBottom)
  ctx.closePath()
  ctx.clip()

  // Liquid gradient
  const liqGrad = ctx.createLinearGradient(x - liquidTopW / 2, 0, x + liquidTopW / 2, 0)
  liqGrad.addColorStop(0, '#c8a830')
  liqGrad.addColorStop(0.2, '#f0d060')
  liqGrad.addColorStop(0.5, '#f8e888')
  liqGrad.addColorStop(0.8, '#e8c848')
  liqGrad.addColorStop(1, '#b89820')
  ctx.fillStyle = liqGrad
  ctx.fillRect(x - liquidTopW, liquidTop, liquidTopW * 2, bowlBottom - liquidTop)

  // Foam / meniscus at top of liquid
  ctx.fillStyle = 'rgba(255,250,220,0.7)'
  ctx.beginPath()
  ctx.ellipse(x, liquidTop, liquidTopW / 2 - 1, 2.5, 0, 0, Math.PI * 2)
  ctx.fill()

  // Bubble streams (3 columns)
  const now = Date.now()
  ctx.fillStyle = 'rgba(255,255,200,0.75)'
  for (let col = -1; col <= 1; col++) {
    const bx = x + col * 4
    for (let b = 0; b < 5; b++) {
      const phase = (now / 600 + b * 0.4 + col * 0.7) % 1
      const by = bowlBottom - 4 - phase * (bowlBottom - liquidTop - 8)
      const br = 0.8 + b * 0.15
      ctx.beginPath()
      ctx.arc(bx + Math.sin(phase * 6 + col) * 1.5, by, br, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()

  // ── Glass bowl outline (crystal) ──
  ctx.strokeStyle = 'rgba(180,220,250,0.65)'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(x - bowlW * 0.28, bowlBottom)
  ctx.bezierCurveTo(
    x - bowlW * 0.32, bowlBottom - glassH * 0.3,
    x - bowlW / 2, top + 8,
    x - bowlW / 2, top,
  )
  ctx.lineTo(x + bowlW / 2, top)
  ctx.bezierCurveTo(
    x + bowlW / 2, top + 8,
    x + bowlW * 0.32, bowlBottom - glassH * 0.3,
    x + bowlW * 0.28, bowlBottom,
  )
  ctx.stroke()

  // Rim line
  ctx.strokeStyle = 'rgba(200,235,255,0.8)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x - bowlW / 2, top)
  ctx.lineTo(x + bowlW / 2, top)
  ctx.stroke()

  // Glass sheen (left highlight)
  ctx.strokeStyle = 'rgba(240,250,255,0.55)'
  ctx.lineWidth = 1.5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x - bowlW * 0.38, bowlBottom - glassH * 0.15)
  ctx.bezierCurveTo(
    x - bowlW * 0.42, bowlBottom - glassH * 0.45,
    x - bowlW * 0.44, bowlBottom - glassH * 0.7,
    x - bowlW * 0.42, top + 6,
  )
  ctx.stroke()

  // Bottom bowl reflection
  ctx.strokeStyle = 'rgba(220,240,255,0.4)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.ellipse(x, bowlBottom, bowlW * 0.25, 1.5, 0, 0, Math.PI * 2)
  ctx.stroke()
}
