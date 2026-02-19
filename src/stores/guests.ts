import { defineStore } from 'pinia'
import { GUESTS_API, type GuestsViewDto } from '@/api/guests'
import { useAuthStore } from '@/stores/auth'

interface GuestsState {
  guests: GuestsViewDto[]
  isLoading: boolean
  error: string
}

export const useGuestsStore = defineStore('guests', {
  state: (): GuestsState => ({
    guests: [],
    isLoading: false,
    error: '',
  }),

  actions: {
    async fetchGuests() {
      this.isLoading = true
      this.error = ''

      try {
        const authStore = useAuthStore()
        if (!authStore.token) {
          throw new Error('Unauthorized')
        }

        this.guests = await GUESTS_API.getAllGuests(authStore.token)
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : 'Failed to load guests'
      } finally {
        this.isLoading = false
      }
    },
  },
})
