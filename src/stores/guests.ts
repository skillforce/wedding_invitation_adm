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

  getters: {
    guestById(): Map<string, GuestDetailViewDto> {
      const map = new Map<string, GuestDetailViewDto>()
      for (const g of this.guests) {
        map.set(String(g.id), g)
      }
      return map
    },
  },

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
        const affectedById = new Map(affected.map((a) => [a.id, a]))
        for (let i = 0; i < this.guests.length; i++) {
          const updated = affectedById.get(this.guests[i]!.id)
          if (updated) {
            this.guests[i] = updated
            affectedById.delete(updated.id)
          }
        }
        if (affectedById.size > 0) {
          this.guests.push(...affectedById.values())
        }
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
        const affectedById = new Map(affected.map((a) => [a.id, a]))
        for (let i = 0; i < this.guests.length; i++) {
          const updated = affectedById.get(this.guests[i]!.id)
          if (updated) {
            this.guests[i] = updated
          }
        }
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
