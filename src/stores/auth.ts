import { defineStore } from 'pinia'
import { AUTH_API, type MeResponseDto } from '@/api/auth'
import { PROFILE_API, type UpdateProfileDto } from '@/api/profile'
import { useSelectedUserStore } from '@/stores/selectedUser'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as MeResponseDto | null,
    isAuthChecked: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
  },

  actions: {
    async login(login: string, password: string) {
      const { accessToken, id, profile } = await AUTH_API.login({ login, password })
      this.token = accessToken
      this.user = { id, login, profile }
      if (!profile.isSuperUser) {
        useSelectedUserStore().selectedUserId = null
      }
    },

    async fetchMe() {
      if (!this.token) {
        throw new Error('errors.auth.unauthorized')
      }

      this.user = await AUTH_API.me(this.token)
    },

    async checkAuthOnAppOpen() {
      if (!this.token) {
        this.isAuthChecked = true
        return
      }

      try {
        await this.fetchMe()
      } catch {
        this.token = null
        this.user = null
      } finally {
        this.isAuthChecked = true
      }
    },

    async logout() {
      await AUTH_API.logout()
      this.token = null
      this.user = null
    },

    async updateProfile(data: UpdateProfileDto) {
      const updatedProfile = await PROFILE_API.updateProfile(data)
      if (this.user) {
        this.user = { ...this.user, profile: updatedProfile }
      }
    },

    async uploadProfileImage(file: File) {
      const updatedProfile = await PROFILE_API.uploadProfileImage(file)
      if (this.user) {
        this.user = { ...this.user, profile: updatedProfile }
      }
    },
  },
  persist: {
    key: 'token',
    pick: ['token'],
    serializer: {
      serialize: (state) => {
        const token = (state as { token?: string | null }).token
        return token || ''
      },
      deserialize: (value) => ({
        token: value || null,
      }),
    },
  },
})
