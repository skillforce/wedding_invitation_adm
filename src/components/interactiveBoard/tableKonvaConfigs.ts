import type { SeatingTable, SeatingGuest } from '@/stores/seating'
import { getThemeDefinition, type ThemeName } from '@/themes'

// ── Visual constants ──────────────────────────────────────────────────────────
export const SEAT_RADIUS = 18
export const SEAT_OFFSET = 38

// Rect table proportions (relative to radius)
export const RECT_W = 2.4   // width  = radius * RECT_W
export const RECT_H = 1.15  // height = radius * RECT_H

// Rotation snap
export const ROTATION_SNAP = 15 // degrees — increase to reduce sensitivity

// Zoom
export const SCALE_BY = 1.07
export const MIN_SCALE = 0.5
export const MAX_SCALE = 1.5

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
    offsetX: table.radius,
    offsetY: 8,
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
    offsetX: w / 2,
    y: 10,
    listening: false,
  }
}

// ── Guest / seat configs (shared) ─────────────────────────────────────────────
export function guestPosition(table: SeatingTable, index: number) {
  const total = table.guests.length
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  const dist = orbitRadius(table) + SEAT_OFFSET + SEAT_RADIUS
  return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
}

export function seatCircleConfig(
  table: SeatingTable,
  index: number,
  palette: KonvaThemePalette,
) {
  const { x, y } = guestPosition(table, index)
  return {
    x,
    y,
    radius: SEAT_RADIUS,
    fill: palette.seatFill,
    stroke: palette.seatStroke,
    strokeWidth: 1.5,
    listening: false,
  }
}

export function guestNameConfig(
  table: SeatingTable,
  guest: SeatingGuest,
  index: number,
  palette: KonvaThemePalette,
) {
  const { x, y } = guestPosition(table, index)
  const label = guest.name.length > 9 ? guest.name.slice(0, 8) + '…' : guest.name
  return {
    text: label,
    fontSize: 14,
    fontWeight: 'bold',
    fill: palette.guestNameFill,
    align: 'center',
    width: 52,
    offsetX: 26,
    offsetY: -SEAT_RADIUS - 3,
    x,
    y,
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
    opacity: 0.35,
    listening: false,
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
    radius: 9,
    fill: palette.rotationHandleFill,
    stroke: palette.rotationHandleStroke,
    strokeWidth: 1.5,
    draggable: true,
  }
}
