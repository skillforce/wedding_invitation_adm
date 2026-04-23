import { useGuestsStore } from '@/stores/guests'
import { useUsersStore } from '@/stores/users'
import { useSeatingStore } from '@/stores/seating'
import { useScenarioStore } from '@/stores/scenario'
import { useBudgetStore } from '@/stores/budget'
import { useChecklistStore } from '@/stores/checklist'
import { useSelectedUserStore } from '@/stores/selectedUser'
import { useAppCommonStore } from '@/stores/app_common'

export function resetAllStores() {
  useGuestsStore().reset()
  useUsersStore().reset()
  useSeatingStore().reset()
  useScenarioStore().reset()
  useBudgetStore().reset()
  useChecklistStore().reset()
  useSelectedUserStore().reset()
  // clear any lingering spinner / alert left by the interrupted session
  const appCommon = useAppCommonStore()
  appCommon.hideSpinner()
  appCommon.clearError()
  appCommon.clearSuccess()
}