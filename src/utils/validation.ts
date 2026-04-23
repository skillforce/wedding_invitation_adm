export const URL_RE = /^https?:\/\/.+/
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const normStr = (v: string | null | undefined): string => v ?? ''