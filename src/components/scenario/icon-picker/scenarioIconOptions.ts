import type { ScenarioPointIcon } from '@/types/scenario'

const modules = import.meta.glob('@/assets/scenario/*.svg', { eager: true, import: 'default' })

export interface ScenarioIconOption {
  value: ScenarioPointIcon
  url: string
  labelKey: string
}

export const SCENARIO_ICONS: ScenarioIconOption[] = Object.entries(modules).map(([path, url]) => {
  const key = path.split('/').pop()!.replace('.svg', '') as ScenarioPointIcon
  return {
    value: key,
    url: url as string,
    labelKey: `scenario.icons.${key}`,
  }
}).sort((a, b) => a.value.localeCompare(b.value))

export function getIconUrl(key: ScenarioPointIcon): string {
  return SCENARIO_ICONS.find((i) => i.value === key)?.url ?? ''
}