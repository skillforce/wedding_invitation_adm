<template>
  <div v-if="!isEditing" class="check-orb" :class="{ 'check-orb--done': completed }">
    <Transition name="pop">
      <i v-if="completed" class="pi pi-check check-icon" />
    </Transition>
  </div>
  <i v-else class="pi pi-bars drag-handle" />
</template>

<script setup lang="ts">
defineProps<{
  isEditing?: boolean
  completed: boolean
}>()
</script>

<style scoped>
.check-orb {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--color-border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.check-orb--done {
  background: var(--cl-done, #7aad8c);
  border-color: var(--cl-done, #7aad8c);
}

.check-icon {
  font-size: 11px;
  color: #fff;
}

.drag-handle {
  flex-shrink: 0;
  font-size: 13px;
  color: var(--color-text-muted);
  opacity: 0.5;
  cursor: grab;
}

.pop-enter-active { animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-leave-active { animation: popIn 0.2s ease reverse; }
@keyframes popIn {
  0%   { transform: scale(0) rotate(-45deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg);   opacity: 1; }
}
</style>
