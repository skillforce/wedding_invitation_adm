<template>
  <header class="hero">
    <div class="hero-inner">
      <ChecklistHeroText :done-count="doneCount" :total-count="totalCount" />
      <ChecklistProgressRing :done-pct="donePct" />
    </div>

    <ChecklistFilters :active-filter="activeFilter" @filter-change="$emit('filter-change', $event)" />
  </header>
</template>

<script setup lang="ts">
import ChecklistHeroText from './ChecklistHeroText.vue'
import ChecklistProgressRing from './ChecklistProgressRing.vue'
import ChecklistFilters from './ChecklistFilters.vue'
import type { FilterValue } from "@/components/checklist/checklistHero/ChecklistFilters.vue";

defineProps<{
  donePct: number
  doneCount: number
  totalCount: number
  activeFilter: FilterValue
}>()

defineEmits<{
  'filter-change': [value: FilterValue]
}>()
</script>

<style scoped>
.hero {
  max-width: 720px;
  margin: 0 auto;
  padding: 28px 20px 24px;
}

.hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

@media (max-width: 480px) {
  .hero {
    padding: 20px 16px 16px;
  }
}

@media (max-width: 360px) {
  .hero-inner {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
}
</style>
