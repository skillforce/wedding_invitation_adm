export type PhaseIconGroup =
  | 'highlights'
  | 'people'
  | 'moments'
  | 'places'
  | 'planning'
  | 'details'

export interface PhaseIconOption {
  value: string
  label: string
  group: PhaseIconGroup
}

export const PHASE_ICON_GROUPS: Array<{ value: PhaseIconGroup; label: string }> = [
  { value: 'highlights', label: 'Highlights' },
  { value: 'people', label: 'People' },
  { value: 'moments', label: 'Moments' },
  { value: 'places', label: 'Places' },
  { value: 'planning', label: 'Planning' },
  { value: 'details', label: 'Details' },
]

export const PHASE_ICON_OPTIONS: PhaseIconOption[] = [
  { value: 'pi pi-sparkles', label: 'Sparkles', group: 'highlights' },
  { value: 'pi pi-star', label: 'Star', group: 'highlights' },
  { value: 'pi pi-star-fill', label: 'Filled star', group: 'highlights' },
  { value: 'pi pi-bolt', label: 'Bolt', group: 'highlights' },
  { value: 'pi pi-sun', label: 'Sun', group: 'highlights' },
  { value: 'pi pi-verified', label: 'Verified', group: 'highlights' },
  { value: 'pi pi-heart', label: 'Heart', group: 'people' },
  { value: 'pi pi-heart-fill', label: 'Filled heart', group: 'people' },
  { value: 'pi pi-users', label: 'Group', group: 'people' },
  { value: 'pi pi-user', label: 'Person', group: 'people' },
  { value: 'pi pi-phone', label: 'Phone', group: 'people' },
  { value: 'pi pi-thumbs-up', label: 'Thumbs up', group: 'people' },
  { value: 'pi pi-camera', label: 'Camera', group: 'moments' },
  { value: 'pi pi-video', label: 'Video', group: 'moments' },
  { value: 'pi pi-ticket', label: 'Ticket', group: 'moments' },
  { value: 'pi pi-image', label: 'Image', group: 'moments' },
  { value: 'pi pi-gift', label: 'Gift', group: 'moments' },
  { value: 'pi pi-home', label: 'Home', group: 'places' },
  { value: 'pi pi-map', label: 'Map', group: 'places' },
  { value: 'pi pi-globe', label: 'Globe', group: 'places' },
  { value: 'pi pi-building', label: 'Building', group: 'places' },
  { value: 'pi pi-shop', label: 'Shop', group: 'places' },
  { value: 'pi pi-compass', label: 'Compass', group: 'places' },
  { value: 'pi pi-calendar', label: 'Calendar', group: 'planning' },
  { value: 'pi pi-clock', label: 'Clock', group: 'planning' },
  { value: 'pi pi-list', label: 'Checklist', group: 'planning' },
  { value: 'pi pi-check-circle', label: 'Check circle', group: 'planning' },
  { value: 'pi pi-bookmark', label: 'Bookmark', group: 'planning' },
  { value: 'pi pi-file-edit', label: 'Edit file', group: 'planning' },
  { value: 'pi pi-sliders-h', label: 'Adjustments', group: 'planning' },
  { value: 'pi pi-sitemap', label: 'Structure', group: 'planning' },
  { value: 'pi pi-palette', label: 'Palette', group: 'details' },
  { value: 'pi pi-envelope', label: 'Envelope', group: 'details' },
  { value: 'pi pi-car', label: 'Car', group: 'details' },
  { value: 'pi pi-shopping-cart', label: 'Cart', group: 'details' },
  { value: 'pi pi-tag', label: 'Tag', group: 'details' },
  { value: 'pi pi-dollar', label: 'Dollar', group: 'details' },
  { value: 'pi pi-wallet', label: 'Wallet', group: 'details' },
  { value: 'pi pi-receipt', label: 'Receipt', group: 'details' },
  { value: 'pi pi-briefcase', label: 'Briefcase', group: 'details' },
  { value: 'pi pi-bell', label: 'Bell', group: 'details' },
  { value: 'pi pi-directions', label: 'Directions', group: 'details' },
  { value: 'pi pi-flag', label: 'Flag', group: 'details' },
  { value: 'pi pi-hammer', label: 'Hammer', group: 'details' },
  { value: 'pi pi-hashtag', label: 'Hashtag', group: 'details' },
  { value: 'pi pi-headphones', label: 'Headphones', group: 'details' },
  { value: 'pi pi-lightbulb', label: 'Lightbulb', group: 'details' },
  { value: 'pi pi-link', label: 'Link', group: 'details' },
  { value: 'pi pi-megaphone', label: 'Megaphone', group: 'details' },
  { value: 'pi pi-pen-to-square', label: 'Pen square', group: 'details' },
  { value: 'pi pi-percentage', label: 'Percentage', group: 'details' },
  { value: 'pi pi-prime', label: 'Prime', group: 'details' },
  { value: 'pi pi-print', label: 'Print', group: 'details' },
  { value: 'pi pi-send', label: 'Send', group: 'details' },
  { value: 'pi pi-shield', label: 'Shield', group: 'details' },
  { value: 'pi pi-truck', label: 'Truck', group: 'details' },
  { value: 'pi pi-wifi', label: 'Wifi', group: 'details' },
]
