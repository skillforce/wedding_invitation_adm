import { apiFetch, parseApiError } from '@/api/consts'

export interface CurrencyRateResponse {
  base: 'USD'
  rates: {
    BYN: number
    RUB: number
  }
  updatedAt: string
}

export const CURRENCY_API = {
  async getRates(): Promise<CurrencyRateResponse> {
    const res = await apiFetch('/currency/rates')
    if (!res.ok) throw await parseApiError(res)
    return res.json()
  },
}