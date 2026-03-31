import { BOUQUET_COLORS } from './config'

// Bride is drawn relative to (cx, cy) where cy = ground contact (feet level)
// Total height ~72px. Minimal animation: only subtle leg stride, no head bob.
export function drawBride(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  frame: number,
  squash: number,
  groundY: number,
) {
  ctx.save()
  ctx.translate(cx, cy)

  // Very gentle squash-stretch (max ±5%)
  const sx = 1 + (squash - 1) * 0.25
  const sy = 1 - (squash - 1) * 0.25
  ctx.scale(sx, sy)

  const isAir = cy < groundY - 2
  const stride = isAir ? 0 : Math.sin(frame * 0.35) * 0.18

  // ── 1. Veil (behind everything) ──────────────────────────
  {
    const veilX = 2
    const veilY = -67
    const drift = Math.sin(frame * 0.04) * 1.5 // very slow gentle drift
    ctx.save()
    // Outer veil layer
    ctx.globalAlpha = 0.22
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.moveTo(veilX, veilY)
    ctx.bezierCurveTo(veilX - 6, veilY + 10, veilX - 20 + drift, veilY + 35, veilX - 24 + drift, veilY + 65)
    ctx.lineTo(veilX - 10 + drift, veilY + 65)
    ctx.bezierCurveTo(veilX - 8 + drift, veilY + 35, veilX - 2, veilY + 12, veilX, veilY)
    ctx.fill()
    // Inner veil layer
    ctx.globalAlpha = 0.18
    ctx.beginPath()
    ctx.moveTo(veilX, veilY)
    ctx.bezierCurveTo(veilX - 3, veilY + 8, veilX - 12 + drift * 0.6, veilY + 28, veilX - 15 + drift * 0.6, veilY + 60)
    ctx.lineTo(veilX - 6 + drift * 0.6, veilY + 60)
    ctx.bezierCurveTo(veilX - 4, veilY + 28, veilX - 1, veilY + 8, veilX, veilY)
    ctx.fill()
    ctx.restore()
  }

  // ── 2. Left arm (behind body) ────────────────────────────
  {
    const armSwing = stride * 0.5
    ctx.save()
    ctx.translate(-7, -46)
    ctx.rotate(-0.25 + armSwing)
    // Upper arm
    ctx.fillStyle = '#FDDBB4'
    ctx.beginPath()
    ctx.ellipse(0, 8, 3, 9, 0, 0, Math.PI * 2)
    ctx.fill()
    // Forearm
    ctx.translate(0, 16)
    ctx.rotate(0.4)
    ctx.beginPath()
    ctx.ellipse(0, 6, 2.5, 7, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // ── 3. Dress skirt (A-line ballgown) ─────────────────────
  {
    const hemSway = Math.sin(frame * 0.35) * (isAir ? 0 : 1.5)
    const skirtGrad = ctx.createLinearGradient(-22, 0, 22, 0)
    skirtGrad.addColorStop(0, '#ddd0ee')
    skirtGrad.addColorStop(0.25, '#f8f0ff')
    skirtGrad.addColorStop(0.55, '#fefcff')
    skirtGrad.addColorStop(0.8, '#f0e8fb')
    skirtGrad.addColorStop(1, '#d8c8e8')
    ctx.fillStyle = skirtGrad
    ctx.beginPath()
    ctx.moveTo(-5, -36)
    ctx.bezierCurveTo(-14, -28, -22 + hemSway, -16, -22 + hemSway, -3)
    ctx.lineTo(22 - hemSway, -3)
    ctx.bezierCurveTo(22 - hemSway, -16, 14, -28, 5, -36)
    ctx.closePath()
    ctx.fill()

    // Skirt shading fold lines
    ctx.strokeStyle = 'rgba(160,120,200,0.15)'
    ctx.lineWidth = 0.8
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath()
      ctx.moveTo(i * 3, -34)
      ctx.bezierCurveTo(i * 5, -22, i * 9 + hemSway * 0.5, -12, i * 12 + hemSway, -4)
      ctx.stroke()
    }

    // Bottom ruffle
    ctx.strokeStyle = 'rgba(200,160,230,0.5)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(-22 + hemSway, -3)
    for (let i = 0; i <= 8; i++) {
      const rx = -22 + hemSway + (44 - hemSway * 2) * (i / 8)
      ctx.lineTo(rx, i % 2 === 0 ? -4 : -2)
    }
    ctx.stroke()

    // Lace trim on hem
    ctx.strokeStyle = 'rgba(220,180,240,0.6)'
    ctx.lineWidth = 0.7
    ctx.setLineDash([2, 3])
    ctx.beginPath()
    ctx.moveTo(-22 + hemSway, -6)
    ctx.lineTo(22 - hemSway, -6)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // ── 4. Shoes (peeking from hem) ───────────────────────────
  {
    ctx.fillStyle = '#c8a0d8'
    // Left shoe
    ctx.save()
    ctx.translate(-8, 0)
    ctx.rotate(stride * 0.6)
    ctx.beginPath()
    ctx.roundRect(-4, -4, 8, 4, [2, 2, 1, 1])
    ctx.fill()
    // heel
    ctx.fillStyle = '#a878c0'
    ctx.fillRect(-4, -2, 2, 2)
    ctx.restore()
    // Right shoe
    ctx.save()
    ctx.translate(8, 0)
    ctx.rotate(-stride * 0.6)
    ctx.fillStyle = '#c8a0d8'
    ctx.beginPath()
    ctx.roundRect(-4, -4, 8, 4, [2, 2, 1, 1])
    ctx.fill()
    ctx.fillStyle = '#a878c0'
    ctx.fillRect(2, -2, 2, 2)
    ctx.restore()
  }

  // ── 5. Bodice / corset ────────────────────────────────────
  {
    const bodGrad = ctx.createLinearGradient(-6, -50, 6, -36)
    bodGrad.addColorStop(0, '#f5eeff')
    bodGrad.addColorStop(0.4, '#fdfbff')
    bodGrad.addColorStop(1, '#e8d8f8')
    ctx.fillStyle = bodGrad
    ctx.beginPath()
    ctx.moveTo(-5, -36)
    ctx.bezierCurveTo(-6, -40, -7, -46, -6, -50)
    ctx.lineTo(6, -50)
    ctx.bezierCurveTo(7, -46, 6, -40, 5, -36)
    ctx.closePath()
    ctx.fill()

    // Corset seam lines
    ctx.strokeStyle = 'rgba(180,140,210,0.35)'
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.moveTo(-2, -50)
    ctx.lineTo(-1, -36)
    ctx.moveTo(2, -50)
    ctx.lineTo(1, -36)
    ctx.stroke()

    // Neckline (sweetheart)
    ctx.strokeStyle = 'rgba(200,160,230,0.5)'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(-6, -50)
    ctx.bezierCurveTo(-6, -53, -3, -53, 0, -51)
    ctx.bezierCurveTo(3, -53, 6, -53, 6, -50)
    ctx.stroke()
  }

  // ── 6. Right arm + bouquet ────────────────────────────────
  {
    ctx.save()
    ctx.translate(7, -44)
    ctx.rotate(0.3 - stride * 0.4)
    // Upper arm
    ctx.fillStyle = '#FDDBB4'
    ctx.beginPath()
    ctx.ellipse(0, 7, 3, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    // Forearm
    ctx.translate(1, 14)
    ctx.rotate(-0.5)
    ctx.beginPath()
    ctx.ellipse(0, 5, 2.5, 6, 0, 0, Math.PI * 2)
    ctx.fill()

    // Hand holding bouquet
    ctx.fillStyle = '#FDDBB4'
    ctx.beginPath()
    ctx.arc(0, 11, 3, 0, Math.PI * 2)
    ctx.fill()

    // Bouquet stems + ribbon
    ctx.strokeStyle = '#3d7a35'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(-1, 12); ctx.lineTo(-2, 19)
    ctx.moveTo(0, 12); ctx.lineTo(0, 20)
    ctx.moveTo(1, 12); ctx.lineTo(2, 19)
    ctx.stroke()

    // Ribbon wrap
    ctx.strokeStyle = '#ff80ab'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(-3, 14); ctx.lineTo(3, 15)
    ctx.moveTo(-3, 16); ctx.lineTo(3, 15)
    ctx.stroke()

    // Flowers
    const flowers: { fx: number; fy: number; c: string; r: number }[] = [
      { fx: -4, fy: 5, c: BOUQUET_COLORS[0] ?? '#ff6b9d', r: 3.5 },
      { fx: 4, fy: 4, c: BOUQUET_COLORS[1] ?? '#ff4081', r: 3 },
      { fx: 0, fy: 2, c: BOUQUET_COLORS[2] ?? '#e040fb', r: 4 },
      { fx: -3, fy: 0, c: BOUQUET_COLORS[3] ?? '#ff80ab', r: 2.5 },
      { fx: 3, fy: 1, c: BOUQUET_COLORS[4] ?? '#f48fb1', r: 3 },
      { fx: 0, fy: 7, c: BOUQUET_COLORS[0] ?? '#ff6b9d', r: 2.5 },
    ]
    // Draw petals
    for (const f of flowers) {
      ctx.fillStyle = f.c + '99'
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2
        ctx.beginPath()
        ctx.arc(f.fx + Math.cos(a) * f.r * 0.6, f.fy + Math.sin(a) * f.r * 0.6, f.r * 0.55, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = f.c
      ctx.beginPath()
      ctx.arc(f.fx, f.fy, f.r * 0.45, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fff176'
      ctx.beginPath()
      ctx.arc(f.fx, f.fy, f.r * 0.18, 0, Math.PI * 2)
      ctx.fill()
    }
    // Greenery leaves
    ctx.fillStyle = '#4caf50'
    ctx.beginPath()
    ctx.ellipse(-5, 8, 4, 2, -0.5, 0, Math.PI * 2)
    ctx.ellipse(5, 7, 3.5, 1.8, 0.4, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  // ── 7. Neck ───────────────────────────────────────────────
  {
    ctx.fillStyle = '#FDDBB4'
    ctx.beginPath()
    ctx.ellipse(0, -52, 3.5, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    // Neck shadow
    ctx.fillStyle = 'rgba(180,120,80,0.12)'
    ctx.beginPath()
    ctx.ellipse(-1.5, -50, 2, 4, 0.2, 0, Math.PI * 2)
    ctx.fill()
  }

  // ── 8. Head ───────────────────────────────────────────────
  {
    // Face base
    ctx.fillStyle = '#FDDBB4'
    ctx.beginPath()
    ctx.ellipse(0, -63, 9, 11, 0, 0, Math.PI * 2)
    ctx.fill()
    // Subtle jaw shadow
    ctx.fillStyle = 'rgba(180,120,70,0.1)'
    ctx.beginPath()
    ctx.ellipse(0, -57, 7, 5, 0, 0, Math.PI * 2)
    ctx.fill()

    // ── Eyes ────────────────────────────────────────────────
    for (const side of [-1, 1]) {
      const ex = side * 3.5
      const ey = -65

      // Eye white
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.ellipse(ex, ey, 2.8, 1.9, side * -0.08, 0, Math.PI * 2)
      ctx.fill()

      // Iris
      const irisGrad = ctx.createRadialGradient(ex, ey, 0, ex, ey, 1.5)
      irisGrad.addColorStop(0, '#8B5E3C')
      irisGrad.addColorStop(0.6, '#6B3F1E')
      irisGrad.addColorStop(1, '#3d2010')
      ctx.fillStyle = irisGrad
      ctx.beginPath()
      ctx.arc(ex, ey, 1.5, 0, Math.PI * 2)
      ctx.fill()

      // Pupil
      ctx.fillStyle = '#111'
      ctx.beginPath()
      ctx.arc(ex, ey, 0.7, 0, Math.PI * 2)
      ctx.fill()

      // Catchlight
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.beginPath()
      ctx.arc(ex - 0.5, ey - 0.6, 0.45, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(ex + 0.8, ey + 0.3, 0.2, 0, Math.PI * 2)
      ctx.fill()

      // Eyelid / lash line
      ctx.strokeStyle = '#2a1a0a'
      ctx.lineWidth = 0.9
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.ellipse(ex, ey, 2.8, 1.9, side * -0.08, Math.PI, Math.PI * 2)
      ctx.stroke()

      // Eyelashes (3 lashes)
      ctx.lineWidth = 0.5
      for (let l = -1; l <= 1; l++) {
        ctx.beginPath()
        ctx.moveTo(ex + l * 1.2, ey - 1.9)
        ctx.lineTo(ex + l * 1.6, ey - 3.2)
        ctx.stroke()
      }

      // Lower lash line (subtle)
      ctx.strokeStyle = 'rgba(80,40,10,0.35)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.ellipse(ex, ey, 2.8, 1.9, side * -0.08, 0, Math.PI)
      ctx.stroke()
    }

    // ── Eyebrows ────────────────────────────────────────────
    ctx.strokeStyle = '#4a2c10'
    ctx.lineWidth = 1
    ctx.lineCap = 'round'
    // Left brow
    ctx.beginPath()
    ctx.moveTo(-6, -69.5)
    ctx.quadraticCurveTo(-3.5, -71.5, -1.2, -70.5)
    ctx.stroke()
    // Right brow
    ctx.beginPath()
    ctx.moveTo(1.2, -70.5)
    ctx.quadraticCurveTo(3.5, -71.5, 6, -69.5)
    ctx.stroke()

    // ── Nose ────────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(160,100,60,0.4)'
    ctx.lineWidth = 0.7
    ctx.lineCap = 'round'
    ctx.beginPath()
    // Bridge
    ctx.moveTo(-0.8, -67.5)
    ctx.bezierCurveTo(-1.5, -64, -2.5, -62, -2, -61)
    ctx.moveTo(0.8, -67.5)
    ctx.bezierCurveTo(1.5, -64, 2.5, -62, 2, -61)
    // Nostrils
    ctx.moveTo(-2.5, -61)
    ctx.quadraticCurveTo(-1.5, -62, 0, -61.5)
    ctx.quadraticCurveTo(1.5, -62, 2.5, -61)
    ctx.stroke()

    // ── Lips ────────────────────────────────────────────────
    // Upper lip
    ctx.fillStyle = '#C96877'
    ctx.beginPath()
    ctx.moveTo(-3.5, -58.5)
    ctx.bezierCurveTo(-2, -60, -0.8, -59.5, 0, -58.8)
    ctx.bezierCurveTo(0.8, -59.5, 2, -60, 3.5, -58.5)
    ctx.bezierCurveTo(2, -57.8, 0.8, -58.2, 0, -57.8)
    ctx.bezierCurveTo(-0.8, -58.2, -2, -57.8, -3.5, -58.5)
    ctx.fill()
    // Lower lip
    ctx.fillStyle = '#E08090'
    ctx.beginPath()
    ctx.moveTo(-3.5, -58.5)
    ctx.bezierCurveTo(-2.5, -56, 0, -55, 3.5, -58.5)
    ctx.bezierCurveTo(2, -57.2, 0, -57, -3.5, -58.5)
    ctx.fill()
    // Lip highlight
    ctx.fillStyle = 'rgba(255,200,200,0.35)'
    ctx.beginPath()
    ctx.ellipse(0, -57.2, 2, 0.7, 0, 0, Math.PI * 2)
    ctx.fill()
    // Lip line
    ctx.strokeStyle = 'rgba(160,50,70,0.5)'
    ctx.lineWidth = 0.4
    ctx.beginPath()
    ctx.moveTo(-3.5, -58.5)
    ctx.lineTo(3.5, -58.5)
    ctx.stroke()

    // Blush
    ctx.fillStyle = 'rgba(255,160,160,0.18)'
    ctx.beginPath()
    ctx.ellipse(-6.5, -62, 3.5, 2, -0.2, 0, Math.PI * 2)
    ctx.ellipse(6.5, -62, 3.5, 2, 0.2, 0, Math.PI * 2)
    ctx.fill()
  }

  // ── 9. Hair ───────────────────────────────────────────────
  {
    // Base hair mass (updo)
    const hairGrad = ctx.createRadialGradient(-2, -72, 1, 0, -68, 12)
    hairGrad.addColorStop(0, '#8B5E3C')
    hairGrad.addColorStop(0.5, '#6B3F1E')
    hairGrad.addColorStop(1, '#3d2010')
    ctx.fillStyle = hairGrad

    // Back bun / updo shape
    ctx.beginPath()
    ctx.ellipse(0, -72, 10, 9, 0, Math.PI, Math.PI * 2)
    ctx.fill()

    // Side hair strands
    ctx.beginPath()
    ctx.moveTo(-9, -68)
    ctx.bezierCurveTo(-11, -63, -10, -58, -8, -55)
    ctx.bezierCurveTo(-10, -56, -11, -61, -10, -68)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(9, -68)
    ctx.bezierCurveTo(11, -63, 10, -58, 8, -55)
    ctx.bezierCurveTo(10, -56, 11, -61, 10, -68)
    ctx.fill()

    // Bun detail
    ctx.fillStyle = '#7a5030'
    ctx.beginPath()
    ctx.ellipse(3, -73, 5, 4.5, 0.3, 0, Math.PI * 2)
    ctx.fill()

    // Hair highlight
    ctx.fillStyle = 'rgba(200,160,100,0.25)'
    ctx.beginPath()
    ctx.ellipse(-2, -74, 4, 2.5, -0.4, 0, Math.PI * 2)
    ctx.fill()

    // Loose strand across forehead
    ctx.strokeStyle = '#6B3F1E'
    ctx.lineWidth = 0.8
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(-8, -72)
    ctx.bezierCurveTo(-6, -70, -4, -69, -2, -70)
    ctx.stroke()
  }

  // ── 10. Tiara ─────────────────────────────────────────────
  {
    // Base band
    ctx.strokeStyle = '#E8C840'
    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(0, -72, 9.5, Math.PI + 0.3, -0.3)
    ctx.stroke()

    // Tiara spires
    const spires = [
      { x: 0, y: -82, h: 10 },
      { x: -4.5, y: -79, h: 7 },
      { x: 4.5, y: -79, h: 7 },
      { x: -8, y: -76, h: 4 },
      { x: 8, y: -76, h: 4 },
    ]
    ctx.fillStyle = '#E8C840'
    for (const s of spires) {
      ctx.beginPath()
      ctx.moveTo(s.x - 1.2, s.y + s.h)
      ctx.lineTo(s.x, s.y)
      ctx.lineTo(s.x + 1.2, s.y + s.h)
      ctx.closePath()
      ctx.fill()
    }

    // Gems on tiara
    const gems = [
      { x: 0, y: -82, c: '#ff4081', r: 1.8 },
      { x: -4.5, y: -79, c: '#80d8ff', r: 1.4 },
      { x: 4.5, y: -79, c: '#80d8ff', r: 1.4 },
      { x: -8, y: -76, c: '#ea80ff', r: 1.1 },
      { x: 8, y: -76, c: '#ea80ff', r: 1.1 },
    ]
    for (const g of gems) {
      const gGrad = ctx.createRadialGradient(g.x - g.r * 0.3, g.y - g.r * 0.3, 0, g.x, g.y, g.r)
      gGrad.addColorStop(0, '#fff')
      gGrad.addColorStop(0.4, g.c)
      gGrad.addColorStop(1, g.c + 'aa')
      ctx.fillStyle = gGrad
      ctx.beginPath()
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()
}