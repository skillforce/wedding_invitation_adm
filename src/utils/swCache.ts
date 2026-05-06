export const API_READ_CACHE = 'api-read-cache'

export async function clearApiCache(): Promise<void> {
  if (!('caches' in window)) return
  await caches.delete(API_READ_CACHE)
}
