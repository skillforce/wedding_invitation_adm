export interface CountdownUnitConfig {
  key: 'days' | 'hours' | 'minutes' | 'seconds'
  labelKey: string
  pad: boolean
}

export const COUNTDOWN_UNITS: CountdownUnitConfig[] = [
  { key: 'days',    labelKey: 'checklist.countdown.days',    pad: false },
  { key: 'hours',   labelKey: 'checklist.countdown.hours',   pad: true  },
  { key: 'minutes', labelKey: 'checklist.countdown.minutes', pad: true  },
  { key: 'seconds', labelKey: 'checklist.countdown.seconds', pad: true  },
]