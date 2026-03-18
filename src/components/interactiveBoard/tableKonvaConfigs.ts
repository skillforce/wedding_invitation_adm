import type { SeatingTable } from '@/stores/seating'
import { getThemeDefinition, type ThemeName } from '@/themes'
import type { Stage } from 'konva/lib/Stage'
import { useWorkspace } from '@/composables/useWorkspace'
// ── Visual constants ──────────────────────────────────────────────────────────
export const SEAT_RADIUS = 20
export const SEAT_OFFSET = 40
export const SEAT_BADGE_RADIUS = 15
const SEAT_BADGE_RED = '#ff3b30'
const SEAT_BADGE_RED_HOVER = '#ff453a'
const SEAT_BADGE_STROKE = 'rgba(255, 255, 255, 0.95)'
const SEAT_BADGE_HIGHLIGHT = 'rgba(255, 255, 255, 0.38)'

// Rect table proportions (relative to radius)
export const RECT_W = 2.4   // width  = radius * RECT_W
export const RECT_H = 1.15  // height = radius * RECT_H

// Rotation snap
export const ROTATION_SNAP = 15 // degrees — increase to reduce sensitivity

// Zoom
export const SCALE_BY = 1.07
export const MIN_SCALE = 0.4
export const MAX_SCALE = 1

export type KonvaThemePalette = ReturnType<typeof getKonvaThemePalette>

export function getKonvaThemePalette(themeName: ThemeName) {
  return getThemeDefinition(themeName).konva
}

// ── Shared helpers ────────────────────────────────────────────────────────────
/** Effective orbit radius for seating — handles both shapes */
function orbitRadius(table: SeatingTable): number {
  if (table.shape === 'rect') {
    const hw = (table.radius * RECT_W) / 2
    const hh = (table.radius * RECT_H) / 2
    return Math.sqrt(hw * hw + hh * hh)
  }
  return table.radius
}

/**
 * Distance from center to the rect edge in the given direction angle.
 * Uses the "rectangle ray-cast" formula.
 */
function rectEdgeDist(table: SeatingTable, angle: number): number {
  const w = table.radius * RECT_W
  const h = table.radius * RECT_H
  const ca = Math.abs(Math.cos(angle))
  const sa = Math.abs(Math.sin(angle))
  if (ca < 1e-10) return h / 2
  if (sa < 1e-10) return w / 2
  return Math.min(w / 2 / ca, h / 2 / sa)
}

// ── Group config ──────────────────────────────────────────────────────────────
export function tableGroupConfig(table: SeatingTable) {
  return { x: table.x, y: table.y, draggable: true, rotation: table.rotation ?? 0 }
}

export function tableDragBoundFunc(
  pos: { x: number; y: number },
  stage: Stage,
) {
  const { workspaceWidth, workspaceHeight } = useWorkspace()
  const scale = stage.scaleX()
  const stagePos = stage.position()

  const canvasX = (pos.x - stagePos.x) / scale
  const canvasY = (pos.y - stagePos.y) / scale

  const clampedX = Math.max(0, Math.min(workspaceWidth.value, canvasX))
  const clampedY = Math.max(0, Math.min(workspaceHeight.value, canvasY))

  return {
    x: clampedX * scale + stagePos.x,
    y: clampedY * scale + stagePos.y,
  }
}

// ── Circle table configs ──────────────────────────────────────────────────────
export function selectionRingConfig(
  table: SeatingTable,
  isSelected: boolean,
  palette: KonvaThemePalette,
) {
  return {
    radius: table.radius + 9,
    stroke: palette.selectionStroke,
    strokeWidth: 2,
    dash: [6, 4],
    fill: 'transparent',
    listening: false,
    opacity: isSelected ? 1 : 0,
  }
}

export function tableCircleConfig(
  table: SeatingTable,
  palette: KonvaThemePalette,
) {
  return {
    radius: table.radius,
    fill: palette.tableFill,
    stroke: palette.tableStroke,
    strokeWidth: 2.5,
    shadowBlur: 12,
    shadowColor: palette.tableShadowColor,
    shadowOffsetY: 4,
    shadowOpacity: 1,
  }
}

export function tableNameConfig(
  table: SeatingTable,
  palette: KonvaThemePalette,
) {
  return {
    text: table.name,
    fontSize: 16,
    fontFamily: 'Georgia, serif',
    fill: palette.tableNameFill,
    fontStyle: 'bold',
    align: 'center',
    width: table.radius * 2,
    wrap: 'none',
    ellipsis: true,
    offsetX: table.radius,
    offsetY: 8,
    listening: false,
  }
}

export function overcrowdedCircleConfig(table: SeatingTable) {
  return {
    radius: table.radius,
    fill: '#fff4f2',
    stroke: '#ff3b30',
    strokeWidth: 3,
    shadowBlur: 18,
    shadowColor: 'rgba(255, 59, 48, 0.28)',
    shadowOffsetY: 5,
    shadowOpacity: 1,
  }
}

export function overcrowdedRectConfig(table: SeatingTable) {
  const w = table.radius * RECT_W
  const h = table.radius * RECT_H
  return {
    x: -w / 2,
    y: -h / 2,
    width: w,
    height: h,
    cornerRadius: 8,
    fill: '#fff4f2',
    stroke: '#ff3b30',
    strokeWidth: 3,
    shadowBlur: 18,
    shadowColor: 'rgba(255, 59, 48, 0.28)',
    shadowOffsetY: 5,
    shadowOpacity: 1,
  }
}

export function overcrowdedIconConfig(table: SeatingTable) {
  return {
    text: '!!!',
    fontSize: Math.max(24, Math.round(table.radius * 0.56)),
    fontStyle: 'bold',
    fontFamily: 'SF Pro Display, Helvetica Neue, Arial, sans-serif',
    fill: '#ff3b30',
    align: 'center',
    verticalAlign: 'middle',
    width: table.radius * 1.3,
    offsetX: table.radius * 0.65,
    offsetY: table.shape === 'rect' ? table.radius * 0.22 : table.radius * 0.42,
    y: table.shape === 'rect' ? -table.radius * 0.22 : -table.radius * 0.34,
    listening: false,
  }
}

export function overcrowdedLabelConfig(table: SeatingTable) {
  return {
    text: table.name,
    fontSize: table.shape === 'rect' ? 11 : 13,
    fontStyle: 'bold',
    fontFamily: 'Georgia, serif',
    fill: '#7a1c16',
    align: 'center',
    width: table.shape === 'rect' ? table.radius * RECT_W : table.radius * 2,
    wrap: 'none',
    ellipsis: true,
    offsetX: table.shape === 'rect' ? (table.radius * RECT_W) / 2 : table.radius,
    y: table.shape === 'rect' ? 12 : 8,
    listening: false,
  }
}

// ── Rect (newlyweds) table configs ────────────────────────────────────────────
export function selectionRingRectConfig(
  table: SeatingTable,
  isSelected: boolean,
  palette: KonvaThemePalette,
) {
  const w = table.radius * RECT_W + 18
  const h = table.radius * RECT_H + 18
  return {
    x: -w / 2,
    y: -h / 2,
    width: w,
    height: h,
    cornerRadius: 14,
    stroke: palette.selectionStroke,
    strokeWidth: 2,
    dash: [6, 4],
    fill: 'transparent',
    listening: false,
    opacity: isSelected ? 1 : 0,
  }
}

export function tableRectConfig(
  table: SeatingTable,
  palette: KonvaThemePalette,
) {
  const w = table.radius * RECT_W
  const h = table.radius * RECT_H
  return {
    x: -w / 2,
    y: -h / 2,
    width: w,
    height: h,
    cornerRadius: 8,
    fill: palette.tableFill,
    stroke: palette.tableStroke,
    strokeWidth: 2.5,
    shadowBlur: 12,
    shadowColor: palette.tableShadowColor,
    shadowOffsetY: 4,
    shadowOpacity: 1,
  }
}

/** Two red dots inside the rect, side by side */
export function newlywedsDotConfig(
  dotIndex: 0 | 1,
  palette: KonvaThemePalette,
) {
  const spacing = 22
  return {
    x: dotIndex === 0 ? -spacing / 2 : spacing / 2,
    y: -8,
    radius: 7,
    fill: palette.newlywedsDotFill,
    stroke: palette.newlywedsDotStroke,
    strokeWidth: 1.5,
    listening: false,
  }
}

export function tableNameRectConfig(
  table: SeatingTable,
  palette: KonvaThemePalette,
) {
  const w = table.radius * RECT_W
  return {
    text: table.name,
    fontSize: 13,
    fontFamily: 'Georgia, serif',
    fill: palette.tableNameFill,
    fontStyle: 'bold',
    align: 'center',
    width: w,
    wrap: 'none',
    ellipsis: true,
    offsetX: w / 2,
    y: 10,
    listening: false,
  }
}

export function truncateGuestName(name: string, chars = 3): string {
  const parts = name.split(/\s+/)
  if (parts.length <= 1) return name
  const [first, ...rest] = parts
  return [first, ...rest.map((p) => (p.length > chars ? p.slice(0, chars) + '.' : p))].join(' ')
}

// ── Guest / seat configs (shared) ─────────────────────────────────────────────
export function guestPosition(table: SeatingTable, index: number) {
  const total = table.guests.length
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  const dist = orbitRadius(table) + SEAT_OFFSET + SEAT_RADIUS
  return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
}

export function   seatCircleConfig(
  table: SeatingTable,
  index: number,
  palette: KonvaThemePalette,
  isHovered = false,
) {
  const { x, y } = guestPosition(table, index)
  return {
    x,
    y,
    radius: SEAT_RADIUS,
    fill: isHovered ? palette.seatHoverFill : palette.seatFill,
    stroke: palette.seatStroke,
    strokeWidth: 1.5,
    listening: false,
  }
}

export function guestNameConfig(
  table: SeatingTable,
  guestLabel: string,
  index: number,
  palette: KonvaThemePalette,
  isHovered = false,
) {
  const { x, y } = guestPosition(table, index)
  const label = isHovered ? guestLabel : truncateGuestName(guestLabel, 4)
  const width = isHovered ? 180 : 85
  return {
    text: label,
    fontSize: isHovered ? 15 : 16,
    fontWeight: 'bold',
    fill: palette.guestNameFill,
    align: 'center',
    width,
    wrap: 'none',
    ellipsis: !isHovered,
    offsetX: width / 2,
    offsetY: -SEAT_RADIUS - 3,
    x,
    y,
    listening: false,
  }
}

export function seatBadgeCircleConfig(
  table: SeatingTable,
  index: number,
  isHovered = false,
) {
  const { x, y } = guestPosition(table, index)
  return {
    x: x + SEAT_RADIUS - 2,
    y: y - SEAT_RADIUS + 2,
    radius: SEAT_BADGE_RADIUS,
    fill: isHovered ? SEAT_BADGE_RED_HOVER : SEAT_BADGE_RED,
    stroke: SEAT_BADGE_STROKE,
    strokeWidth:2,
    shadowColor: 'rgba(120, 0, 0, 0.35)',
    shadowBlur: 7,
    shadowOffsetY: 1.5,
    shadowOpacity: 1,
    listening: false,
  }
}

export function seatBadgeHighlightConfig(table: SeatingTable, index: number) {
  const { x, y } = guestPosition(table, index)
  return {
    x: x + SEAT_RADIUS - 5,
    y: y - SEAT_RADIUS - 1,
    radius: 6,
    fill: SEAT_BADGE_HIGHLIGHT,
    listening: false,
  }
}

export function seatBadgeTextConfig(
  table: SeatingTable,
  index: number,
  additionalSeats: number,
) {
  const { x, y } = guestPosition(table, index)
  return {
    x: x + SEAT_RADIUS - 2,
    y: y - SEAT_RADIUS -1,
    text: `+${additionalSeats}`,
    fontSize: additionalSeats > 9 ? 13 : 15,
    fontStyle: 'bold',
    fontFamily: 'SF Pro Display, Helvetica Neue, Arial, sans-serif',
    fill: '#ffffff',
    align: 'center',
    verticalAlign: 'middle',
    width: SEAT_BADGE_RADIUS * 2 + 4,
    offsetX: SEAT_BADGE_RADIUS + 2,
    offsetY: 4.5,
    listening: false,
  }
}

export function connectorConfig(
  table: SeatingTable,
  index: number,
  palette: KonvaThemePalette,
) {
  const total = table.guests.length
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  // x1/y1: start at the actual shape edge (rect edge or circle circumference)
  const edge = table.shape === 'rect' ? rectEdgeDist(table, angle) : table.radius
  const x1 = Math.cos(angle) * edge
  const y1 = Math.sin(angle) * edge
  // x2/y2: end just before the seat circle
  const orbit = orbitRadius(table)
  const dist = orbit + SEAT_OFFSET + SEAT_RADIUS
  const x2 = Math.cos(angle) * (dist - SEAT_RADIUS)
  const y2 = Math.sin(angle) * (dist - SEAT_RADIUS)
  return {
    points: [x1, y1, x2, y2],
    stroke: palette.connectorStroke,
    strokeWidth: 1,
    opacity:0.65,
    listening: false,
  }
}

// ── Pillar configs (ribbed square) ────────────────────────────────────────────
const PILLAR_SIZE_RATIO = 0.65

export function pillarSelectionRingConfig(
  table: SeatingTable,
  isSelected: boolean,
  palette: KonvaThemePalette,
) {
  const s = table.radius * PILLAR_SIZE_RATIO + 10
  return {
    x: -s,
    y: -s,
    width: s * 2,
    height: s * 2,
    stroke: palette.selectionStroke,
    strokeWidth: 2,
    dash: [6, 4],
    fill: 'transparent',
    listening: false,
    opacity: isSelected ? 1 : 0,
  }
}

export function pillarSquareConfig(
  table: SeatingTable,
  palette: KonvaThemePalette,
) {
  const s = table.radius * PILLAR_SIZE_RATIO
  return {
    x: -s,
    y: -s,
    width: s * 2,
    height: s * 2,
    fill: palette.pillarFill,
    stroke: palette.pillarStroke,
    strokeWidth: 2.5,
    shadowBlur: 14,
    shadowColor: palette.pillarShadowColor,
    shadowOffsetY: 5,
    shadowOpacity: 1,
  }
}

export function pillarRibConfigs(
  table: SeatingTable,
  palette: KonvaThemePalette,
) {
  const s = table.radius * PILLAR_SIZE_RATIO
  const ribCount = Math.max(2, Math.round(s / 12))
  const gap = (s * 2) / (ribCount + 1)
  const ribs: { points: number[]; stroke: string; strokeWidth: number; opacity: number; listening: boolean }[] = []

  for (let i = 1; i <= ribCount; i++) {
    const x = -s + gap * i
    ribs.push({
      points: [x, -s, x, s],
      stroke: palette.pillarStroke,
      strokeWidth: 1,
      opacity: 0.35,
      listening: false,
    })
  }
  return ribs
}

export function pillarNameConfig(
  table: SeatingTable,
) {
  const s = table.radius * PILLAR_SIZE_RATIO
  return {
    text: table.name,
    fontSize: 16,
    fontFamily: 'Georgia, serif',
    fill: '#ffffff',
    fontStyle: 'bold',
    align: 'center',
    width: s * 2,
    wrap: 'none',
    ellipsis: true,
    offsetX: s,
    y:-10,
    listening: false,
    opacity: 0.85,
  }
}

// ── Rotation handle (rect tables only) ───────────────────────────────────────
export function rotationHandleLineConfig(
  table: SeatingTable,
  palette: KonvaThemePalette,
) {
  const h = table.radius * RECT_H
  return {
    points: [0, -(h / 2), 0, -(h / 2 + 18)],
    stroke: palette.rotationHandleLine,
    strokeWidth: 1,
    opacity: 0.45,
    listening: false,
    dash: [3, 3],
  }
}

export function rotationHandleConfig(
  table: SeatingTable,
  palette: KonvaThemePalette,
) {
  const h = table.radius * RECT_H
  return {
    x: 0,
    y: -(h / 2 + 28),
    radius: 13,
    fill: palette.rotationHandleFill,
    stroke: palette.rotationHandleStroke,
    strokeWidth: 1.5,
    draggable: true,
  }
}
