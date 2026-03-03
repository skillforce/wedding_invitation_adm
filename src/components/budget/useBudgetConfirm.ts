import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'
import { useBudgetStore } from '@/stores/budget'

export function useBudgetConfirm() {
  const confirm = useConfirm()
  const { t } = useI18n()
  const store = useBudgetStore()

  function confirmDeleteSection(id: number, name: string) {
    confirm.require({
      header: t('budget.confirmDeleteHeader'),
      message: t('budget.confirmDeleteSection', { name }),
      rejectLabel: t('budget.cancel'),
      acceptLabel: t('budget.delete'),
      acceptClass: 'p-button-danger',
      accept: () => store.deleteSection(id),
    })
  }

  function confirmDeleteItem(id: number, name: string) {
    confirm.require({
      header: t('budget.confirmDeleteHeader'),
      message: t('budget.confirmDeleteItem', { name }),
      rejectLabel: t('budget.cancel'),
      acceptLabel: t('budget.delete'),
      acceptClass: 'p-button-danger',
      accept: () => store.deleteItem(id),
    })
  }

  return { confirmDeleteSection, confirmDeleteItem }
}