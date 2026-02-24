<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from 'primevue/button'
import { useSeatingStore, type SeatingTable } from '@/stores/seating'

const props = defineProps<{ table: SeatingTable }>()
const emit = defineEmits<{ close: [] }>()

const seatingStore = useSeatingStore()

const editingName = ref(props.table.name)
const newGuestName = ref('')
const newGuestInputRef = ref<HTMLInputElement | null>(null)

watch(
  () => props.table.id,
  () => {
    editingName.value = props.table.name
    newGuestName.value = ''
  },
)

function saveName() {
  if (editingName.value.trim()) {
    seatingStore.renameTable(props.table.id, editingName.value.trim())
  }
}

function addGuest() {
  if (!newGuestName.value.trim()) return
  seatingStore.addGuest(props.table.id, newGuestName.value.trim())
  newGuestName.value = ''
  newGuestInputRef.value?.focus()
}

function removeGuest(guestId: string) {
  seatingStore.removeGuest(props.table.id, guestId)
}


</script>

<template>
  <aside class="side-panel">
    <!-- Drag handle — visible only on mobile -->
    <div class="drawer-handle" />

    <div class="panel-header">
      <input
        v-model="editingName"
        class="name-input"
        placeholder="Table name…"
        @blur="saveName"
        @keydown.enter="($event.target as HTMLInputElement).blur()"
      />
      <button class="close-btn" aria-label="Close panel" @click="emit('close')">✕</button>
    </div>

    <div class="panel-section">
      <p class="section-label">
        Guests
        <span class="guest-count">{{ table.guests.length }}</span>
      </p>

      <ul class="guest-list">
        <li v-if="table.guests.length === 0" class="guest-empty">No guests yet</li>
        <li v-for="guest in table.guests" :key="guest.id" class="guest-item">
          <span class="guest-name">{{ guest.name }}</span>
          <button class="remove-btn" aria-label="Remove guest" @click="removeGuest(guest.id)">✕</button>
        </li>
      </ul>

      <div class="add-guest-form">
        <input
          ref="newGuestInputRef"
          v-model="newGuestName"
          class="guest-input"
          placeholder="Guest name…"
          @keydown.enter="addGuest"
        />
        <Button
          icon="pi pi-user-plus"
          size="small"
          :disabled="!newGuestName.trim()"
          aria-label="Add guest"
          @click="addGuest"
        />
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* ── Side panel (desktop) ─────────────────────────────────────────────────── */
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

/* ── Bottom drawer (mobile) ───────────────────────────────────────────────── */
@media (max-width: 639px) {
  .side-panel {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    max-height: 62dvh;
    border-left: none;
    border-top: 1px solid var(--board-panel-border);
    border-radius: 16px 16px 0 0;
    padding: 10px 16px 24px;
    gap: 14px;
  }
}

/* ── Drawer handle ────────────────────────────────────────────────────────── */
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

/* ── Panel header ─────────────────────────────────────────────────────────── */
.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-input {
  flex: 1;
  min-width: 0;
  background: var(--board-input-bg);
  border: 1px solid var(--board-input-border);
  border-radius: 7px;
  padding: 7px 10px;
  color: var(--board-input-text);
  font-size: 14px;
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

/* ── Panel section ────────────────────────────────────────────────────────── */
.panel-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-label {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--board-section-text);
  display: flex;
  align-items: center;
  gap: 7px;
}

.guest-count {
  background: var(--board-badge-bg);
  color: var(--board-badge-text);
  border-radius: 10px;
  padding: 1px 7px;
  font-size: 10px;
  font-weight: 600;
}

/* ── Guest list ───────────────────────────────────────────────────────────── */
.guest-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.guest-empty {
  font-size: 12px;
  color: var(--board-empty-text);
  padding: 10px 0;
  text-align: center;
  font-style: italic;
}

.guest-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--board-item-bg);
  border: 1px solid var(--board-item-border);
  border-radius: 7px;
  padding: 7px 10px;
  gap: 8px;
}

.guest-name {
  font-size: 13px;
  color: var(--board-item-text);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  color: var(--board-remove-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
}

.remove-btn:hover {
  background: var(--board-remove-hover-bg);
  color: var(--board-remove-hover-text);
}

/* ── Add guest form ───────────────────────────────────────────────────────── */
.add-guest-form {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 2px;
}

.guest-input {
  flex: 1;
  min-width: 0;
  background: var(--board-guest-input-bg);
  border: 1px solid var(--board-guest-input-border);
  border-radius: 7px;
  padding: 7px 10px;
  color: var(--board-input-text);
  font-size: 12px;
  outline: none;
  transition: border-color 0.18s;
}

.guest-input:focus {
  border-color: var(--board-guest-input-focus);
}

.guest-input::placeholder {
  color: var(--board-placeholder);
}

</style>
