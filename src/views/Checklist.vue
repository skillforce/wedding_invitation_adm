<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChecklistStore } from '@/stores/checklist'
import PageHeader from '@/components/shared/PageHeader.vue'
import ChecklistHero from '@/components/checklist/checklistHero/ChecklistHero.vue'
import ChecklistNormalView from '@/components/checklist/normalView/ChecklistNormalView.vue'
import ChecklistEditView from '@/components/checklist/editView/ChecklistEditView.vue'
import ChecklistEditFab from '@/components/checklist/ChecklistEditFab.vue'
import ChecklistEmptyState from '@/components/checklist/ChecklistEmptyState.vue'
import ConfirmDialog from 'primevue/confirmdialog'
import { useCurrentUser } from '@/composables/useCurrentUser'
import SelectUserPrompt from '@/components/shared/SelectUserPrompt.vue'
import { useSelectedUser } from '@/composables/useSelectedUser'
import { ChecklistFilter } from '@/types/checklist'

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
const { isSuperUser } = useCurrentUser()
const { selectedUserId } = useSelectedUser()

const showPrompt = computed(() => isSuperUser.value && selectedUserId.value === null)

const activeFilter = ref<ChecklistFilter>(ChecklistFilter.All)
const expandedPhases = reactive(loadExpandedPhases())
const isEditing = ref(false)

const plainPhases = computed(() => {
  const isUnfiltered = activeFilter.value === ChecklistFilter.All

  return store.phases
    .map((phase) => {
      let tasks = phase.tasks
      if (activeFilter.value === ChecklistFilter.Todo) tasks = tasks.filter((t) => !t.completed)
      if (activeFilter.value === ChecklistFilter.Done) tasks = tasks.filter((t) => t.completed)
      if (activeFilter.value === ChecklistFilter.High) tasks = tasks.filter((t) => t.priority === 'high')
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

watch(selectedUserId, (userId) => {
  if (isSuperUser.value && userId === null) return
  store.fetchChecklist(userId ?? undefined)
})

onMounted(() => {
  if (isSuperUser.value && selectedUserId.value === null) return
  store.fetchChecklist(selectedUserId.value ?? undefined)
})
</script>

<template>
  <div class="checklist-page">
    <PageHeader :title="t('checklist.title')" />
    <SelectUserPrompt v-if="showPrompt" />
    <template v-else>
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

        <ChecklistEmptyState v-if="plainPhases.length === 0 && !isEditing" />
      </main>

      <ChecklistEditFab :is-editing="isEditing" @toggle="isEditing = !isEditing" />
    </template>
    <ConfirmDialog :breakpoints="{ '640px': '70vw' }" />
  </div>
</template>

<style scoped>
.checklist-page {
  min-height: 100%;
}

.timeline-area {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 20px 50px;
}

@media (max-width: 768px) {
  .timeline-area { padding: 0 16px 60px; }
}

@media (max-width: 480px) {
  .timeline-area { padding: 0 12px 60px; }
}
</style>
