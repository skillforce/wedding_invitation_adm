<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChecklistStore } from '@/stores/checklist'
import ChecklistHero from '@/components/checklist/checklistHero/ChecklistHero.vue'
import ChecklistNormalView from '@/components/checklist/ChecklistNormalView.vue'
import ChecklistEditView from '@/components/checklist/ChecklistEditView.vue'
import ChecklistEditFab from '@/components/checklist/ChecklistEditFab.vue'

const EXPANDED_PHASES_STORAGE_KEY = 'wedding-checklist-expanded-phases'

function loadExpandedPhases(): Set<string> {
  try {
    const raw = localStorage.getItem(EXPANDED_PHASES_STORAGE_KEY)
    if (!raw) return new Set<string>()

    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set<string>()
  }
}

function saveExpandedPhases(ids: Set<string>) {
  localStorage.setItem(EXPANDED_PHASES_STORAGE_KEY, JSON.stringify([...ids]))
}

const { t } = useI18n()
const store = useChecklistStore()

const activeFilter = ref<'all' | 'todo' | 'done' | 'high'>('all')
const expandedPhases = reactive(loadExpandedPhases())
const isEditing = ref(false)

const plainPhases = computed(() => {
  const isUnfiltered = activeFilter.value === 'all'

  return store.phases
    .map((phase) => {
      let tasks = phase.tasks
      if (activeFilter.value === 'todo') tasks = tasks.filter((t) => !t.completed)
      if (activeFilter.value === 'done') tasks = tasks.filter((t) => t.completed)
      if (activeFilter.value === 'high') tasks = tasks.filter((t) => t.priority === 'high')
      return { ...phase, tasks }
    })
    .filter((phase) => isUnfiltered || phase.tasks.length > 0)
})

function togglePhase(id: string) {
  if (expandedPhases.has(id)) {
    expandedPhases.delete(id)
  } else {
    expandedPhases.add(id)
  }
}

watch(
  () => store.phases.map((phase) => phase.id),
  (phaseIds) => {
    const validIds = new Set(phaseIds)

    for (const expandedId of [...expandedPhases]) {
      if (!validIds.has(expandedId)) {
        expandedPhases.delete(expandedId)
      }
    }

    saveExpandedPhases(expandedPhases)
  },
  { immediate: true },
)

watch(
  () => [...expandedPhases],
  () => {
    saveExpandedPhases(expandedPhases)
  },
  { deep: true },
)

onMounted(() => {
  store.fetchChecklist()
})
</script>

<template>
  <div class="checklist-page">
    <ChecklistHero
      :done-pct="store.donePct"
      :done-count="store.doneCount"
      :total-count="store.totalCount"
      :active-filter="activeFilter"
      @filter-change="activeFilter = $event"
    />

    <main class="timeline-area">
      <ChecklistNormalView
        v-if="!isEditing"
        :phases="plainPhases"
        :expanded-phases="expandedPhases"
        @toggle-phase="togglePhase"
      />

      <ChecklistEditView
        v-else
        :phases="store.phases"
        :expanded-phases="expandedPhases"
        @toggle-phase="togglePhase"
      />

      <div v-if="plainPhases.length === 0 && !isEditing" class="empty-state">
        <i class="pi pi-search" />
        <p>{{ t('checklist.empty') }}</p>
      </div>
    </main>

    <ChecklistEditFab :is-editing="isEditing" @toggle="isEditing = !isEditing" />
  </div>
</template>

<style scoped>
.checklist-page {
  min-height: 100%;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.timeline-area {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 20px 50px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-muted);
}

.empty-state i {
  font-size: 36px;
  display: block;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
}

@media (max-width: 768px) {
  .timeline-area { padding: 0 16px 60px; }
}

@media (max-width: 480px) {
  .timeline-area { padding: 0 12px 60px; }
}
</style>
