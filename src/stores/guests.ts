import { defineStore } from 'pinia'
import { GUESTS_API, type GuestsViewDto } from '@/api/guests'
import { useAppCommonStore } from '@/stores/app_common'

interface GuestsState {
  guests: GuestsViewDto[]
  isLoading: boolean
}

export const useGuestsStore = defineStore('guests', {
  state: (): GuestsState => ({
    guests: [],
    isLoading: false,
  }),

  actions: {
    async fetchGuests() {
      this.isLoading = true

      try {
        this.guests = await GUESTS_API.getAllGuests()
      } catch (error) {
        useAppCommonStore().showError(error)
      } finally {
        this.isLoading = false
      }
    },
  },
})