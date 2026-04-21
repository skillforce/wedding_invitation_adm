<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ConfirmDialog from 'primevue/confirmdialog'
import PageHeader from '@/components/shared/PageHeader.vue'
import SelectUserPrompt from '@/components/shared/SelectUserPrompt.vue'
import ScenarioHeaderActions from '@/components/scenario/header/ScenarioHeaderActions.vue'
import ScenarioBody from '@/components/scenario/ScenarioBody.vue'
import { useScenarioStore } from '@/stores/scenario'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { useSelectedUser } from '@/composables/useSelectedUser'

const { t } = useI18n()
const store = useScenarioStore()
const { isSuperUser } = useCurrentUser()
const { selectedUserId } = useSelectedUser()

const isEditing = ref(false)
const showPrompt = computed(() => isSuperUser.value && selectedUserId.value === null)

watch(selectedUserId, (id) => {
  if (isSuperUser.value && id === null) return
  isEditing.value = false
  store.fetchScenario(id ?? undefined)
})

onMounted(() => {
  if (!isSuperUser.value || selectedUserId.value !== null) {
    store.fetchScenario(selectedUserId.value ?? undefined)
  }
})
</script>

<template>
  <div class="scenario-page">
    <ConfirmDialog />

    <PageHeader :title="t('scenario.title')">
      <ScenarioHeaderActions v-if="!showPrompt" />
    </PageHeader>

    <SelectUserPrompt v-if="showPrompt" />
    <ScenarioBody v-else v-model:is-editing="isEditing" />
  </div>
</template>

<style scoped>
.scenario-page {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.scenario-page :deep(.page-header-actions) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (max-width: 768px) {
  .scenario-page {
    padding: 0.4rem;
    gap: 0.75rem;
  }
}
</style>

<style>
.p-confirmdialog {
  max-width: min(24rem, calc(100vw - 2rem));
}
</style>
