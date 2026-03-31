// Obstacle / particle colors are theme-independent (vivid wedding items look
// great on both light and dark backgrounds).
export const OBSTACLE_COLORS = {
  cake: '#fff5e6',
  cakeFrost: '#ffc1e3',
  cakeCherry: '#ff4060',
  heart: '#ff4081',
  ring: '#ffd700',
  champagne: '#f5e6ca',
  champagneBubble: '#fff8dc',
} as const

export const PHYSICS = {
  GRAVITY: 1800,
  JUMP_FORCE: -620,
  BASE_SPEED: 300,
  GROUND_Y_RATIO: 0.75,
} as const

export const OBSTACLE_DIMS: Record<string, () => { w: number; h: number }> = {
  cake: () => ({ w: 42 + Math.random() * 12, h: 56 + Math.random() * 16 }),
  ring: () => ({ w: 36, h: 48 }),
  champagne: () => ({ w: 28, h: 64 + Math.random() * 12 }),
}

export const PARTICLE_COLORS: Record<string, string[]> = {
  heart: ['#ff4081', '#ff6090', '#ff80ab'],
  petal: ['#ffb6c1', '#ffc0cb', '#ffe0e8', '#fff0f5'],
  sparkle: ['#ffd700', '#fff', '#ffeb3b'],
}

export const DECO_COLORS = ['#ff6b9d', '#ffa0c8', '#c084fc', '#fbbf24', '#fb7185']

export const DECO_TYPES = ['flower', 'grass', 'butterfly'] as const

export const BOUQUET_COLORS = ['#ff6b9d', '#ff4081', '#e040fb', '#ff80ab', '#f48fb1']

export const BEST_SCORE_KEY = 'wedding-run-best'