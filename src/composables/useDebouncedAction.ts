export function useDebouncedAction<K, Args extends unknown[]>(
  fn: (key: K, ...args: Args) => void | Promise<void>,
  delay = 1000,
) {
  const timers = new Map<K, ReturnType<typeof setTimeout>>()

  function call(key: K, ...args: Args) {
    const existing = timers.get(key)
    if (existing) clearTimeout(existing)

    timers.set(
      key,
      setTimeout(() => {
        timers.delete(key)
        fn(key, ...args)
      }, delay),
    )
  }

  function cancel(key: K) {
    const existing = timers.get(key)
    if (existing) {
      clearTimeout(existing)
      timers.delete(key)
    }
  }

  function cancelAll() {
    for (const timer of timers.values()) clearTimeout(timer)
    timers.clear()
  }

  return { call, cancel, cancelAll }
}
