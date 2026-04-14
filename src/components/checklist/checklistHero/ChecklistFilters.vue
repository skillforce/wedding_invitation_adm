<template>
  <div class="filter-row">
    <button
      v-for="f in filters"
      :key="f.value"
      class="filter-pill"
      :class="{ 'filter-pill--active': activeFilter === f.value }"
      @click="$emit('filter-change', f.value)"
    >
      <i :class="f.icon" class="filter-icon" />
      <span class="pill-text">{{ t(f.labelKey) }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ChecklistFilter } from '@/types/checklist'

defineProps<{
  activeFilter: ChecklistFilter
}>()

defineEmits<{
  'filter-change': [value: ChecklistFilter]
}>()

const { t } = useI18n()

const filters = [
  { value: ChecklistFilter.All, labelKey: 'checklist.filter.all', icon: 'pi pi-list' },
  { value: ChecklistFilter.Todo, labelKey: 'checklist.filter.todo', icon: 'pi pi-circle' },
  { value: ChecklistFilter.Done, labelKey: 'checklist.filter.done', icon: 'pi pi-check-circle' },
  { value: ChecklistFilter.High, labelKey: 'checklist.filter.priority', icon: 'pi pi-star-fill' },
]
</script>

<style scoped>
.filter-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: 100px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.filter-pill:hover {
  border-color: #7aad8c;
  color: var(--color-text-primary);
}

.filter-pill:focus-visible {
  outline: 2px solid #7aad8c;
  outline-offset: 2px;
}

.filter-pill--active {
  background: #7aad8c;
  border-color: #7aad8c;
  color: #fff;
}

.filter-icon {
  font-size: 12px;
}

@media (max-width: 480px) {
  .pill-text {
    display: none;
  }

  .filter-pill {
    padding: 0 12px;
  }
}
</style>
