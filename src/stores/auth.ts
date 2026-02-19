import { defineStore } from 'pinia'
import { AUTH_API, type MeResponseDto } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
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
      localStorage.setItem('token', accessToken)
      await this.fetchMe()
    },

    async fetchMe() {
      if (!this.token) {
        throw new Error('Unauthorized')
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
      localStorage.removeItem('token')
    },
  },
})
