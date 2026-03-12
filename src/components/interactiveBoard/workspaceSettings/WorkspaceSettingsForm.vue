<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import type { WorkspaceShape } from '@/stores/seating'

defineProps<{
  shapeOptions: { label: string; value: WorkspaceShape }[]
  draftShape: WorkspaceShape
  draftMaxTablesAmount: number | null
  draftMaxSeatsPerTableAmount: number | null
  minTablesAmount: number
  maxTablesAmount: number
  minSeatsPerTableAmount: number
  maxSeatsPerTableAmount: number
  tableLimitError: string | null
  seatLimitError: string | null
  isSaving: boolean
  isDirty: boolean
  isValid: boolean
}>()

const emit = defineEmits<{
  'update:draftShape': [value: WorkspaceShape]
  'update:draftMaxTablesAmount': [value: number | null]
  'update:draftMaxSeatsPerTableAmount': [value: number | null]
  close: []
  save: []
}>()

const { t } = useI18n()
</script>

<template>
  <section class="workspace-settings">
    <div class="settings-header">
      <div>
        <p class="settings-kicker">{{ t('seating.workspaceSettingsKicker') }}</p>
        <h2 class="settings-title">{{ t('seating.workspaceSettings') }}</h2>
      </div>
    </div>

    <div class="settings-grid">
      <label class="field field--wide">
        <span class="field-label">{{ t('seating.workspaceShape') }}</span>
        <Select
          :model-value="draftShape"
          :options="shapeOptions"
          option-label="label"
          option-value="value"
          append-to="body"
          @update:model-value="emit('update:draftShape', $event)"
        />
      </label>

      <label class="field">
        <span class="field-label">{{ t('seating.maxTablesAmount') }}</span>
        <InputNumber
          :model-value="draftMaxTablesAmount"
          :min="minTablesAmount"
          :max="maxTablesAmount"
          :use-grouping="false"
          :invalid="Boolean(tableLimitError)"
          @update:model-value="emit('update:draftMaxTablesAmount', $event)"
        />
        <small v-if="tableLimitError" class="field-error">{{ tableLimitError }}</small>
      </label>

      <label class="field">
        <span class="field-label">{{ t('seating.maxSeatsPerTableAmount') }}</span>
        <InputNumber
          :model-value="draftMaxSeatsPerTableAmount"
          :min="minSeatsPerTableAmount"
          :max="maxSeatsPerTableAmount"
          :use-grouping="false"
          :invalid="Boolean(seatLimitError)"
          @update:model-value="emit('update:draftMaxSeatsPerTableAmount', $event)"
        />
        <small v-if="seatLimitError" class="field-error">{{ seatLimitError }}</small>
      </label>
    </div>

    <div class="settings-footer">
      <Button :label="t('budget.cancel')" severity="secondary" text @click="emit('close')" />
      <Button
        :label="t('budget.save')"
        :loading="isSaving"
        :disabled="!isValid || !isDirty"
        @click="emit('save')"
      />
    </div>
  </section>
</template>

<style scoped>
.workspace-settings {
  display: grid;
  gap: 1rem;
}

.settings-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.settings-kicker {
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.settings-title {
  margin: 0;
  font-size: 1.2rem;
  color: var(--color-text-primary);
}

.settings-grid {
  display: grid;
  gap: 0.9rem;
}

.field {
  display: grid;
  gap: 0.45rem;
}

.field--wide {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.field :deep(.p-inputnumber),
.field :deep(.p-select) {
  width: 100%;
}

.field-error {
  color: #f87171;
  font-size: 0.78rem;
}

.settings-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

@media (max-width: 639px) {
  .settings-header {
    align-items: stretch;
    flex-direction: column;
  }

  .settings-footer {
    justify-content: stretch;
  }

  .settings-footer :deep(.p-button) {
    flex: 1;
  }
}
</style>
