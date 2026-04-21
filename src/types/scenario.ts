export type ScenarioPointIcon =
  | 'breakfast' | 'cake' | 'ceremony' | 'cocktail' | 'dinner'
  | 'dress' | 'entrance' | 'exit' | 'firework' | 'first'
  | 'ido' | 'limo' | 'lunch' | 'party' | 'photo'
  | 'session' | 'sun-rise' | 'toast'

export interface ScenarioPoint {
  id: string
  time: string
  title: string
  icon: ScenarioPointIcon
  note: string
  duration: number | null
}