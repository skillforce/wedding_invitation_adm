import { defineStore } from 'pinia'
import { GUESTS_API, type GuestDetailViewDto } from '@/api/guests'
import { useAppCommonStore } from '@/stores/app_common'
import { useAuthStore } from '@/stores/auth'

interface GuestsState {
  guests: GuestDetailViewDto[]
  isLoading: boolean
  isAdding: boolean
  activeTab: 'manage' | 'responses'
}

export const useGuestsStore = defineStore('guests', {
  state: (): GuestsState => ({
    guests: [],
    isLoading: false,
    isAdding: false,
    activeTab: 'manage',
  }),

  actions: {
    async fetchGuests() {
      const appCommon = useAppCommonStore()
      this.isLoading = true
      appCommon.showSpinner()

      try {
        this.guests = await GUESTS_API.getAllGuests()
      } catch (error) {
        appCommon.showError(error)
      } finally {
        this.isLoading = false
        appCommon.hideSpinner()
      }
    },

    async addGuest(name: string) {
      const authStore = useAuthStore()
      if (!authStore.user) return

      const appCommon = useAppCommonStore()

      const trimmedName = name.trim()
      const isDuplicate = this.guests.some(
        (g) => g.name.trim().toLowerCase() === trimmedName.toLowerCase(),
      )
      if (isDuplicate) {
        appCommon.showError(new Error('errors.guests.duplicateGuest'))
        return
      }

      this.isAdding = true
      appCommon.showSpinner()

      try {
        const newGuest = await GUESTS_API.createGuest({
          guest_name: trimmedName,
          user_id: authStore.user.id,
        })
        this.guests.push(newGuest)
      } catch (error) {
        appCommon.showError(error)
      } finally {
        this.isAdding = false
        appCommon.hideSpinner()
      }
    },

    async removeGuest(id: number) {
      const appCommon = useAppCommonStore()
      appCommon.showSpinner()

      try {
        await GUESTS_API.deleteGuest(id)
        this.guests = this.guests.filter((g) => g.id !== id)
      } catch (error) {
        appCommon.showError(error)
      } finally {
        appCommon.hideSpinner()
      }
    },
  },

  persist: {
    key: 'guests-ui',
    pick: ['activeTab'],
  },
})