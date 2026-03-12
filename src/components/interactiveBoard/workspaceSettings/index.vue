<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWorkspace } from '@/composables/useWorkspace'
import { useSeatingStore, type WorkspaceShape } from '@/stores/seating'
import WorkspaceSettingsDesktop from './WorkspaceSettingsDesktop.vue'
import WorkspaceSettingsForm from './WorkspaceSettingsForm.vue'
import WorkspaceSettingsMobile from './WorkspaceSettingsMobile.vue'

const props = defineProps<{
  open: boolean
  isMobile: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const seatingStore = useSeatingStore()
const {
  workspaceShape,
  maxTablesAmount,
  maxSeatsPerTableAmount,
  MIN_TABLES_AMOUNT,
  MAX_TABLES_AMOUNT,
  MIN_SEATS_PER_TABLE_AMOUNT,
  MAX_SEATS_PER_TABLE_AMOUNT,
  updateWorkspace,
} = useWorkspace()

const shapeOptions = computed<{ label: string; value: WorkspaceShape }[]>(() => [
  { label: t('seating.workspaceShapeRect'), value: 'rect' },
  { label: t('seating.workspaceShapeCircle'), value: 'circle' },
])

const draftShape = ref<WorkspaceShape>('rect')
const draftMaxTablesAmount = ref<number | null>(null)
const draftMaxSeatsPerTableAmount = ref<number | null>(null)
const isSaving = ref(false)

const currentTablesCount = computed(() => seatingStore.tables.length)
const currentMaxReservedSeats = computed(() => Math.max(0, ...seatingStore.tables.map((table) => table.guests.length)))

function syncDraft() {
  draftShape.value = workspaceShape.value
  draftMaxTablesAmount.value = maxTablesAmount.value
  draftMaxSeatsPerTableAmount.value = maxSeatsPerTableAmount.value
}

watch(() => props.open, (open) => {
  if (open) syncDraft()
})

const tableLimitError = computed(() => {
  const value = draftMaxTablesAmount.value
  if (value === null) return t('seating.maxTablesAmountRangeError', {
    min: MIN_TABLES_AMOUNT.value,
    max: MAX_TABLES_AMOUNT.value,
  })
  if (value < currentTablesCount.value) {
    return t('seating.maxTablesAmountCurrentError', { count: currentTablesCount.value })
  }
  if (value < MIN_TABLES_AMOUNT.value || value > MAX_TABLES_AMOUNT.value) {
    return t('seating.maxTablesAmountRangeError', {
      min: MIN_TABLES_AMOUNT.value,
      max: MAX_TABLES_AMOUNT.value,
    })
  }
  return null
})

const seatLimitError = computed(() => {
  const value = draftMaxSeatsPerTableAmount.value
  if (value === null) return t('seating.maxSeatsPerTableAmountRangeError', {
    min: MIN_SEATS_PER_TABLE_AMOUNT.value,
    max: MAX_SEATS_PER_TABLE_AMOUNT.value,
  })
  if (value < currentMaxReservedSeats.value) {
    return t('seating.maxSeatsPerTableAmountCurrentError', { count: currentMaxReservedSeats.value })
  }
  if (value < MIN_SEATS_PER_TABLE_AMOUNT.value || value > MAX_SEATS_PER_TABLE_AMOUNT.value) {
    return t('seating.maxSeatsPerTableAmountRangeError', {
      min: MIN_SEATS_PER_TABLE_AMOUNT.value,
      max: MAX_SEATS_PER_TABLE_AMOUNT.value,
    })
  }
  return null
})

const isValid = computed(() => !tableLimitError.value && !seatLimitError.value)

const isDirty = computed(() => (
  draftShape.value !== workspaceShape.value ||
  draftMaxTablesAmount.value !== maxTablesAmount.value ||
  draftMaxSeatsPerTableAmount.value !== maxSeatsPerTableAmount.value
))

async function save() {
  if (!isValid.value || !isDirty.value) return

  isSaving.value = true
  try {
    await updateWorkspace({
      shape: draftShape.value,
      maxTablesAmount: draftMaxTablesAmount.value ?? maxTablesAmount.value,
      maxSeatsPerTableAmount: draftMaxSeatsPerTableAmount.value ?? maxSeatsPerTableAmount.value,
    })
    emit('close')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <WorkspaceSettingsMobile v-if="isMobile" :open="open" @close="emit('close')">
    <WorkspaceSettingsForm
      :shape-options="shapeOptions"
      :draft-shape="draftShape"
      :draft-max-tables-amount="draftMaxTablesAmount"
      :draft-max-seats-per-table-amount="draftMaxSeatsPerTableAmount"
      :min-tables-amount="MIN_TABLES_AMOUNT"
      :max-tables-amount="MAX_TABLES_AMOUNT"
      :min-seats-per-table-amount="MIN_SEATS_PER_TABLE_AMOUNT"
      :max-seats-per-table-amount="MAX_SEATS_PER_TABLE_AMOUNT"
      :table-limit-error="tableLimitError"
      :seat-limit-error="seatLimitError"
      :is-saving="isSaving"
      :is-dirty="isDirty"
      :is-valid="isValid"
      @update:draft-shape="draftShape = $event"
      @update:draft-max-tables-amount="draftMaxTablesAmount = $event"
      @update:draft-max-seats-per-table-amount="draftMaxSeatsPerTableAmount = $event"
      @close="emit('close')"
      @save="save"
    />
  </WorkspaceSettingsMobile>

  <WorkspaceSettingsDesktop v-else :open="open" @close="emit('close')">
    <WorkspaceSettingsForm
      :shape-options="shapeOptions"
      :draft-shape="draftShape"
      :draft-max-tables-amount="draftMaxTablesAmount"
      :draft-max-seats-per-table-amount="draftMaxSeatsPerTableAmount"
      :min-tables-amount="MIN_TABLES_AMOUNT"
      :max-tables-amount="MAX_TABLES_AMOUNT"
      :min-seats-per-table-amount="MIN_SEATS_PER_TABLE_AMOUNT"
      :max-seats-per-table-amount="MAX_SEATS_PER_TABLE_AMOUNT"
      :table-limit-error="tableLimitError"
      :seat-limit-error="seatLimitError"
      :is-saving="isSaving"
      :is-dirty="isDirty"
      :is-valid="isValid"
      @update:draft-shape="draftShape = $event"
      @update:draft-max-tables-amount="draftMaxTablesAmount = $event"
      @update:draft-max-seats-per-table-amount="draftMaxSeatsPerTableAmount = $event"
      @close="emit('close')"
      @save="save"
    />
  </WorkspaceSettingsDesktop>
</template>
