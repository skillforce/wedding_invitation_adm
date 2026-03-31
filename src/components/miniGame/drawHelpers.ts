export function drawMiniHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y + size / 4)
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4)
  ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.7, x, y + size * 0.7)
  ctx.bezierCurveTo(x, y + size * 0.7, x + size / 2, y + size / 2, x + size / 2, y + size / 4)
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4)
  ctx.fill()
}
