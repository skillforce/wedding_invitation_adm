import { defineStore } from 'pinia'
import { AUTH_API, type MeResponseDto } from '@/api/auth'

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
      const { accessToken } = await AUTH_API.login({ login, password })
      this.token = accessToken
      this.user = await AUTH_API.me(accessToken)
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
        this.logout()
      } finally {
        this.isAuthChecked = true
      }
    },

    logout() {
      this.token = null
      this.user = null
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
