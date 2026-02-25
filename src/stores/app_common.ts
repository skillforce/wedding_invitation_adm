import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AppRoute } from '@/constants/app'
import { ApiError } from '@/api/consts'
import i18n from '@/i18n'

const SIDEBAR_OPTION_STORAGE_KEY = 'sidebar-selected-option'
const DEFAULT_SIDEBAR_OPTION = AppRoute.Guests

export const useAppCommonStore = defineStore('app_common', () => {
  const selectedSidebarOption = ref<string>(DEFAULT_SIDEBAR_OPTION)
  const errorMessage = ref<string | null>(null)

  function setSelectedSidebarOption(path: string) {
    if (!path) {
      return
    }

    selectedSidebarOption.value = path
  }

  function showError(error: unknown) {
    if (error instanceof ApiError && error.serverMessage) {
      errorMessage.value = error.serverMessage
    } else if (error instanceof Error && error.message && i18n.global.te(error.message)) {
      errorMessage.value = i18n.global.t(error.message)
    } else {
      errorMessage.value = i18n.global.t('errors.internalServerError')
    }
  }

  function clearError() {
    errorMessage.value = null
  }

  return {
    selectedSidebarOption,
    errorMessage,
    setSelectedSidebarOption,
    showError,
    clearError,
  }
}, {
  persist: {
    key: SIDEBAR_OPTION_STORAGE_KEY,
    pick: ['selectedSidebarOption'],
    serializer: {
      serialize: (state) => {
        const option = (state as { selectedSidebarOption?: string }).selectedSidebarOption
        return option || DEFAULT_SIDEBAR_OPTION
      },
      deserialize: (value) => ({
        selectedSidebarOption: value || DEFAULT_SIDEBAR_OPTION,
      }),
    },
  },
})