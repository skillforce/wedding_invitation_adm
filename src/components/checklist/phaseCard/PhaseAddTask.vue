<template>
  <div class="add-task-row">
    <input
      v-model="newTaskTitle"
      class="add-task-input"
      placeholder="New task…"
      @keydown.enter.prevent="submit"
    />
    <button class="add-task-btn" :disabled="!newTaskTitle.trim()" @click="submit">
      <i class="pi pi-plus" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChecklistStore } from '@/stores/checklist.ts'

const props = defineProps<{ phaseId: string }>()

const store = useChecklistStore()
const newTaskTitle = ref('')

function submit() {
  const title = newTaskTitle.value.trim()
  if (!title) return
  store.addTask(props.phaseId, title)
  newTaskTitle.value = ''
}
</script>

<style scoped>
.add-task-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.add-task-input {
  flex: 1;
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid rgba(122, 173, 140, 0.4);
  background: rgba(122, 173, 140, 0.06);
  color: var(--color-text-primary);
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
}

.add-task-input::placeholder { color: var(--color-text-muted); }
.add-task-input:focus { border-color: #7aad8c; }

.add-task-btn {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: none;
  background: #7aad8c;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease;
}

.add-task-btn:disabled { opacity: 0.4; cursor: default; }
.add-task-btn:not(:disabled):hover { opacity: 0.85; }
</style>
