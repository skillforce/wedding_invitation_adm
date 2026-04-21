<script setup lang="ts">
import { useScenarioStore } from '@/stores/scenario'
import ScenarioTimeline from './timeline/ScenarioTimeline.vue'
import ScenarioEmptyState from './ScenarioEmptyState.vue'
import AddPointButton from './add-point/AddPointButton.vue'
import ScenarioSeedButton from './ScenarioSeedButton.vue'
import ChecklistEditFab from '@/components/checklist/ChecklistEditFab.vue'

defineProps<{ isEditing: boolean }>()
defineEmits<{ 'update:isEditing': [value: boolean] }>()

const store = useScenarioStore()
</script>

<template>
  <div class="scenario-content">
    <ScenarioTimeline
      v-if="store.points.length > 0"
      :points="store.points"
      :is-editing="isEditing"
    />
    <ScenarioEmptyState v-else-if="!isEditing" />

    <div v-if="isEditing" class="edit-actions">
      <AddPointButton />
      <ScenarioSeedButton />
    </div>
  </div>

  <ChecklistEditFab
    :is-editing="isEditing"
    @toggle="$emit('update:isEditing', !isEditing)"
  />
</template>



<style scoped>
.scenario-content {
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.edit-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
