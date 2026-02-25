<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSeatingStore } from '@/stores/seating'
import burgerIconUrl from '@/assets/burger_menu_icon.svg'
import BottomDrawer from '@/components/shared/BottomDrawer.vue'

defineProps<{ isFitted: boolean }>()
const emit = defineEmits<{ addTable: []; exportPdf: []; fitCanvas: [] }>()

const seatingStore = useSeatingStore()
const open = ref(false)
const { t } = useI18n()

function close() {
  open.value = false
}

function addTable() {
  emit('addTable')
  close()
}

function fitCanvas() {
  emit('fitCanvas')
  close()
}

function exportPdf() {
  emit('exportPdf')
  close()
}

function exportData() {
  const divider = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  const lines: string[] = []
  lines.push(`💒 ${t('seating.exportTitle')}`)
  lines.push(divider)
  lines.push('')
  const totalGuests = seatingStore.tables.reduce((sum, t) => sum + t.guests.length, 0)
  const totalTables = seatingStore.tables.length
  lines.push(`📊 ${t('seating.exportSummary', { tables: totalTables, guests: totalGuests })}`)
  lines.push(divider)
  lines.push('')
  for (const table of seatingStore.tables) {
    const tableIcon = table.shape === 'rect' ? '👑' : '🪑'
    lines.push(`${tableIcon} ${table.name}`)
    if (table.guests.length === 0) {
      lines.push(`   - ${t('seating.exportNoGuests')}`)
    } else {
      lines.push(`   👥 ${t('seating.exportGuestCount', { count: table.guests.length })}`)
      table.guests.forEach((guest, idx) => {
        lines.push(`   ${idx + 1}. ${guest.name}`)
      })
    }
    lines.push(divider)
    lines.push('')
  }
  const content = lines.join('\n')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = t('seating.textFileName')
  a.click()
  URL.revokeObjectURL(url)
  close()
}
</script>

<template>
  <div class="board-mobile-menu">
    <BottomDrawer :open="open" @close="close">
      <nav class="drawer-nav">
        <button class="action-btn" @click="addTable">
          <i class="pi pi-plus" />
          <span>{{ t('seating.addTable') }}</span>
        </button>
        <button class="action-btn" :disabled="isFitted" @click="fitCanvas">
          <i class="pi pi-expand" />
          <span>{{ t('seating.workspace') }}</span>
        </button>
        <button class="action-btn" @click="exportData">
          <i class="pi pi-download" />
          <span>{{ t('seating.exportData') }}</span>
        </button>
        <button class="action-btn" @click="exportPdf">
          <i class="pi pi-file-pdf" />
          <span>{{ t('seating.savePdf') }}</span>
        </button>
      </nav>
    </BottomDrawer>

    <button class="fab" :aria-label="t('a11y.openMenu')" @click="open = true">
      <img :src="burgerIconUrl" class="fab-icon" :alt="t('a11y.openMenu')" />
    </button>
  </div>
</template>

<style scoped>
.board-mobile-menu {
  display: none;
}

@media (max-width: 639px) {
  .board-mobile-menu {
    display: block;
  }

  .fab {
    position: absolute;
    top: 20px;
    left: 16px;
    z-index: var(--z-drawer-trigger);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid var(--board-toolbar-border);
    background: var(--board-toolbar-bg);
    backdrop-filter: blur(8px);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fab-icon {
    width: 22px;
    height: 22px;
    filter: var(--color-icon-filter);
  }

  .drawer-nav {
    display: grid;
    gap: 0.5rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--color-text-primary);
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .action-btn:hover:not(:disabled) {
    background: var(--color-hover);
  }

  .action-btn:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .action-btn .pi {
    font-size: 1rem;
    flex-shrink: 0;
  }
}
</style>
