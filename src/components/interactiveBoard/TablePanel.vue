<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Slider from 'primevue/slider'
import { useSeatingStore, type SeatingTable } from '@/stores/seating'
import TableGuestList from './TableGuestList.vue'

const MIN_RADIUS = 40
const MAX_RADIUS = 120

const props = defineProps<{ table: SeatingTable }>()
const emit = defineEmits<{ close: [] }>()

const seatingStore = useSeatingStore()
const { t } = useI18n()

const editingName = ref(props.table.name)
const sizeValue = ref(props.table.radius)

watch(
  () => props.table.id,
  () => {
    editingName.value = props.table.name
    sizeValue.value = props.table.radius
  },
)

function onSizeChange(val: number | number[]) {
  if (typeof val !== 'number') return
  seatingStore.updateTableRadius(props.table.id, val)
}

function saveName() {
  if (editingName.value.trim()) {
    seatingStore.renameTable(props.table.id, editingName.value.trim())
  }
}

async function deleteTable() {
  await seatingStore.deleteTable(props.table.id)
  emit('close')
}
</script>

<template>
  <aside class="side-panel">
    <div class="drawer-handle" />

    <div class="panel-header">
      <input
        v-model="editingName"
        class="name-input"
        :placeholder="t('seating.tableNamePlaceholder')"
        @blur="saveName"
        @keydown.enter="($event.target as HTMLInputElement).blur()"
      />
      <button class="close-btn" :aria-label="t('a11y.closePanel')" @click="emit('close')">✕</button>
    </div>

    <div class="size-section">
      <div class="size-label">
        <span class="size-label-text">{{ t('seating.size') }}</span>
        <span class="size-value">{{ sizeValue }}</span>
      </div>
      <Slider
        v-model="sizeValue"
        :min="MIN_RADIUS"
        :max="MAX_RADIUS"
        :step="5"
        class="size-slider"
        @change="onSizeChange"
      />
    </div>

    <TableGuestList v-if="table.shape !== 'pillar'" :table="table" />

    <div class="panel-footer">
      <button class="delete-table-btn" @click="deleteTable">{{ t('seating.deleteTable') }}</button>
    </div>
  </aside>
</template>

<style scoped>
.side-panel {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 264px;
  background: var(--board-panel-bg);
  backdrop-filter: blur(14px);
  border-left: 1px solid var(--board-panel-border);
  z-index: 20;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 18px;
  overflow-y: auto;
}

@media (max-width: 639px) {
  .side-panel {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100vw;
    height: auto;
    max-height: 62dvh;
    border-left: none;
    border-top: 1px solid var(--board-panel-border);
    border-radius: 16px 16px 0 0;
    padding: 10px 16px 24px;
    gap: 14px;
    overflow-x: hidden;
  }
}

.drawer-handle {
  display: none;
  width: 36px;
  height: 4px;
  background: var(--board-panel-handle);
  border-radius: 2px;
  margin: 0 auto;
  flex-shrink: 0;
}

@media (max-width: 639px) {
  .drawer-handle {
    display: block;
  }
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 30px 0;
}

.name-input {
  flex: 1;
  min-width: 0;
  background: var(--board-input-bg);
  border: 1px solid var(--board-input-border);
  border-radius: 7px;
  padding: 7px 10px;
  color: var(--board-input-text);
  font-size: 16px;
  font-weight: 700;
  font-family: Georgia, serif;
  outline: none;
  transition: border-color 0.18s;
}

.name-input:focus {
  border-color: var(--board-input-border-focus);
}

.close-btn {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: none;
  background: var(--board-close-bg);
  color: var(--board-close-text);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: background 0.15s, color 0.15s;
}

.close-btn:hover {
  background: var(--board-close-hover-bg);
  color: var(--board-close-hover-text);
}

.size-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.size-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.size-label-text {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--board-section-text);
}

.size-value {
  font-size: 12px;
  font-weight: 700;
  color: var(--board-input-text);
  background: var(--board-input-bg);
  border: 1px solid var(--board-input-border);
  border-radius: 5px;
  padding: 2px 8px;
  min-width: 36px;
  text-align: center;
}

.size-slider {
  width: 100%;
}

.panel-footer {
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid var(--board-panel-border);
}

.delete-table-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 7px;
  background: #ef4444;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.35);
}

.delete-table-btn:hover {
  background: #dc2626;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.5);
}

.delete-table-btn:active {
  transform: scale(0.97);
}
</style>
