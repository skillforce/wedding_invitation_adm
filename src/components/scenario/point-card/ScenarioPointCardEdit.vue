<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useConfirm } from 'primevue/useconfirm'
import ScenarioIconPicker from '../icon-picker/ScenarioIconPicker.vue'
import { useScenarioStore } from '@/stores/scenario'
import { SCENARIO_NOTE_MAX_LENGTH } from '@/constants/scenario'
import type { ScenarioPoint } from '@/types/scenario'

const props = defineProps<{ point: ScenarioPoint }>()

const { t } = useI18n()
const store = useScenarioStore()
const confirm = useConfirm()
const NOTE_MAX = SCENARIO_NOTE_MAX_LENGTH

function onTimeChange(e: Event) {
  const val = (e.target as HTMLInputElement).value
  if (val) store.updatePointTime(props.point.id, val)
}

function onTitleInput(e: Event) {
  store.updatePointTitle(props.point.id, (e.target as HTMLInputElement).value)
}

function onNoteInput(e: Event) {
  store.updatePointNote(props.point.id, (e.target as HTMLInputElement).value)
}

function confirmDelete() {
  confirm.require({
    message: t('scenario.confirmDelete', { title: props.point.title }),
    header: t('scenario.deletePoint'),
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => store.removePoint(props.point.id),
  })
}
</script>

<template>
  <div class="edit-row">
    <ScenarioIconPicker
      :icon="point.icon"
      :is-editing="true"
      @select="(v) => store.updatePointIcon(point.id, v)"
    />

    <label class="time-field">
      <input
        type="time"
        step="60"
        class="time-input"
        :value="point.time"
        @change="onTimeChange"
      />
    </label>

    <button type="button" class="delete-btn" :aria-label="t('scenario.deletePoint')" @click="confirmDelete">
      <i class="pi pi-trash" />
    </button>
  </div>

  <div class="edit-fields">
    <input
      type="text"
      class="title-input"
      :value="point.title"
      maxlength="50"
      :placeholder="t('scenario.newPoint')"
      @input="onTitleInput"
    />

    <div class="note-wrap">
      <input
        type="text"
        class="note-input"
        :value="point.note"
        :maxlength="NOTE_MAX"
        :placeholder="t('scenario.notePlaceholder')"
        @input="onNoteInput"
      />
      <span class="note-counter" :class="{ 'note-counter--full': point.note.length >= NOTE_MAX }">
        {{ point.note.length }}/{{ NOTE_MAX }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.edit-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-field {
  flex: 1;
}

.time-input {
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-soft);
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 600;
  color-scheme: inherit;
  outline: none;
  transition: border-color 0.15s;
}

.time-input:focus {
  border-color: var(--scenario-icon-accent);
}

.delete-btn {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.delete-btn:hover {
  background: rgba(220, 80, 80, 0.12);
  color: #e08080;
}

.edit-fields {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-input,
.note-input {
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-soft);
  color: var(--color-text-primary);
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.title-input:focus,
.note-input:focus {
  border-color: var(--scenario-icon-accent);
}

.note-wrap {
  position: relative;
}

.note-wrap .note-input {
  padding-right: 52px;
}

.note-counter {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.note-counter--full {
  color: #e8927a;
  font-weight: 700;
}
</style>