import { ref } from 'vue'
import { defineStore } from 'pinia'
import { CURRENCY_API, type CurrencyRateResponse } from '@/api/currency'
import type { BudgetCurrency } from '@/types/budget'

export const useCurrencyStore = defineStore('currency', () => {
  const rates = ref<CurrencyRateResponse | null>(null)
  const loading = ref(false)

  async function fetchRates() {
    loading.value = true
    try {
      rates.value = await CURRENCY_API.getRates()
    } catch (e) {
      console.error('Failed to fetch currency rates', e)
    } finally {
      loading.value = false
    }
  }

  function getRate(c: BudgetCurrency): number | null {
    if (c === 'USD') return 1
    return rates.value?.rates[c] ?? null
  }

  function convert(amount: number, from: BudgetCurrency, to: BudgetCurrency): number | null {
    if (from === to) return amount
    const fromRate = getRate(from)
    const toRate = getRate(to)
    if (fromRate === null || toRate === null) return null
    return (amount / fromRate) * toRate
  }

  return { rates, loading, fetchRates, convert }
})