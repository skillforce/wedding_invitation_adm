import { defineStore } from 'pinia'
import { GUESTS_API, type GuestsViewDto } from '@/api/guests'

interface GuestsState {
  guests: GuestsViewDto[]
  isLoading: boolean
  errorKey: string
}

export const useGuestsStore = defineStore('guests', {
  state: (): GuestsState => ({
    guests: [],
    isLoading: false,
    errorKey: '',
  }),

  actions: {
    async fetchGuests() {
      this.isLoading = true
      this.errorKey = ''

      try {
        this.guests = await GUESTS_API.getAllGuests()
      } catch (error) {
        this.errorKey =
          error instanceof Error ? error.message : 'errors.guests.failedToLoad'
      } finally {
        this.isLoading = false
      }
    },
  },
})
