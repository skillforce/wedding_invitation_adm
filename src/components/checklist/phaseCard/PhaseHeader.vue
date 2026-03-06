<template>
  <div class="phase-header" @click="!isEditing && $emit('toggle')">
    <PhaseIconPicker :phase-id="phase.id" :icon="phase.icon" :is-editing="isEditing" />

    <div class="phase-meta">
      <PhaseHeaderEditMode
        v-if="isEditing"
        :phase-id="phase.id"
        :timeline-draft="timelineDraft"
        :name-draft="nameDraft"
        @update:timelineDraft="timelineDraft = $event"
        @update:nameDraft="nameDraft = $event"
      />
      <PhaseHeaderViewMode v-else :phase="phase" />

      <PhaseProgressBar :done="doneTasks" :total="phase.tasks.length" />
    </div>

    <PhaseHeaderActions
      :is-editing="isEditing"
      :is-open="isOpen"
      @toggle="$emit('toggle')"
      @remove="$emit('remove')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useChecklistStore } from '@/stores/checklist.ts'
import type { Phase } from '@/stores/checklist.ts'
import PhaseIconPicker from './PhaseIconPicker.vue'
import PhaseHeaderViewMode from './PhaseHeaderViewMode.vue'
import PhaseHeaderEditMode from './PhaseHeaderEditMode.vue'
import PhaseProgressBar from './PhaseProgressBar.vue'
import PhaseHeaderActions from './PhaseHeaderActions.vue'

const props = defineProps<{
  phase: Phase
  isOpen: boolean
  isEditing: boolean
}>()

defineEmits<{ toggle: []; remove: [] }>()

const store = useChecklistStore()

const nameDraft = ref(props.phase.name)
const timelineDraft = ref(props.phase.timeline)

watch(
  () => props.isEditing,
  (editing, prevEditing) => {
    if (editing) {
      nameDraft.value = props.phase.name
      timelineDraft.value = props.phase.timeline
    } else if (prevEditing) {
      store.renamePhase(props.phase.id, nameDraft.value)
      store.updatePhaseTimeline(props.phase.id, timelineDraft.value)
    }
  },
)

const doneTasks = computed(() => props.phase.tasks.filter((task) => task.completed).length)
</script>

<style scoped>
.phase-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  border-radius: 16px 16px 0 0;
}

.phase-meta { flex: 1; min-width: 0; }

@media (max-width: 480px) {
  .phase-header { padding: 14px; gap: 10px; }
}
</style>
