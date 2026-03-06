<template>
  <input
    class="phase-timeline-input"
    :value="timelineDraft"
    placeholder="Timeline (e.g. 12–9 months before)…"
    @input="$emit('update:timelineDraft', ($event.target as HTMLInputElement).value)"
    @change="store.updatePhaseTimeline(phaseId, timelineDraft)"
    @click.stop
  />
  <input
    class="phase-name-input"
    :value="nameDraft"
    placeholder="Section name…"
    @input="$emit('update:nameDraft', ($event.target as HTMLInputElement).value)"
    @change="store.renamePhase(phaseId, nameDraft)"
    @click.stop
  />
</template>

<script setup lang="ts">
import { useChecklistStore } from '@/stores/checklist'

defineProps<{
  phaseId: string
  timelineDraft: string
  nameDraft: string
}>()

defineEmits<{
  'update:timelineDraft': [v: string]
  'update:nameDraft': [v: string]
}>()

const store = useChecklistStore()
</script>

<style scoped>
.phase-timeline-input {
  display: block;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(122, 173, 140, 0.35);
  border-radius: 0;
  outline: none;
  padding: 1px 0 2px;
  margin-bottom: 4px;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.phase-timeline-input:focus { border-bottom-color: #7aad8c; }

.phase-timeline-input::placeholder {
  color: var(--color-text-muted);
  opacity: 0.4;
  text-transform: none;
  letter-spacing: 0;
}

.phase-name-input {
  display: block;
  width: 100%;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-title);
  background: transparent;
  border: none;
  border-bottom: 1.5px solid rgba(122, 173, 140, 0.5);
  border-radius: 0;
  outline: none;
  padding: 2px 0 4px;
  margin-bottom: 8px;
  transition: border-color 0.2s ease;
}

.phase-name-input:focus { border-bottom-color: #7aad8c; }
</style>
