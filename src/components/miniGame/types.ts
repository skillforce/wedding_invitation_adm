export interface Obstacle {
  x: number
  type: 'cake' | 'ring' | 'champagne'
  w: number
  h: number
}

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  type: 'heart' | 'petal' | 'sparkle'
  rotation: number
  rotationSpeed: number
}

export interface Cloud {
  x: number
  y: number
  w: number
  h: number
  speed: number
}

export interface GroundDeco {
  x: number
  type: 'flower' | 'grass' | 'butterfly'
  color: string
  size: number
}

export type GameState = 'idle' | 'playing' | 'over'