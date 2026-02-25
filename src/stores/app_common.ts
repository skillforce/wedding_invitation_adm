import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AppRoute } from '@/constants/app'

const SIDEBAR_OPTION_STORAGE_KEY = 'sidebar-selected-option'
const DEFAULT_SIDEBAR_OPTION = AppRoute.Guests

export const useAppCommonStore = defineStore('app_common', () => {
  const selectedSidebarOption = ref<string>(DEFAULT_SIDEBAR_OPTION)

  function setSelectedSidebarOption(path: string) {
    if (!path) {
      return
    }

    selectedSidebarOption.value = path
  }

  return {
    selectedSidebarOption,
    setSelectedSidebarOption,
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
