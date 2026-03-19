import { defineStore } from 'pinia'
import {
  GUESTS_API,
  type GuestDetailViewDto,
  type NewGuestPayload,
  type UpdateGuestFormPayload,
} from '@/api/guests'
import { useAppCommonStore } from '@/stores/app_common'
import { useAuthStore } from '@/stores/auth'

interface GuestsState {
  guests: GuestDetailViewDto[]
  isLoading: boolean
  isAdding: boolean
  isUpdating: boolean
}

export const useGuestsStore = defineStore('guests', {
  state: (): GuestsState => ({
    guests: [],
    isLoading: false,
    isAdding: false,
    isUpdating: false,
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

    async addGuest(payload: NewGuestPayload) {
      const authStore = useAuthStore()
      if (!authStore.user) return

      const appCommon = useAppCommonStore()

      const trimmedName = payload.guest_name.trim()
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
        const affected = await GUESTS_API.createGuest({
          guest_name: trimmedName,
          user_id: authStore.user.id,
          guestForm: payload.guestForm,
        })
        const existingIds = new Set(this.guests.map((g) => g.id))
        this.guests = this.guests.map((g) => affected.find((a) => a.id === g.id) ?? g)
        const newlyAddedGuest = affected.filter((a) => !existingIds.has(a.id))
        this.guests.push(...newlyAddedGuest)
      } catch (error) {
        appCommon.showError(error)
      } finally {
        this.isAdding = false
        appCommon.hideSpinner()
      }
    },

    async updateGuestForm(id: string, payload: UpdateGuestFormPayload) {
      const appCommon = useAppCommonStore()
      this.isUpdating = true
      appCommon.showSpinner()

      try {
        const affected = await GUESTS_API.updateGuestForm(id, payload)
        this.guests = this.guests.map((g) => affected.find((a) => a.id === g.id) ?? g)
      } catch (error) {
        appCommon.showError(error)
      } finally {
        this.isUpdating = false
        appCommon.hideSpinner()
      }
    },

    async removeGuest(id: string) {
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

})
