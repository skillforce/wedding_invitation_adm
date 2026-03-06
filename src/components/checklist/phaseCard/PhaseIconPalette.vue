<template>
  <div class="icon-picker" @click.stop>
    <div class="icon-groups">
      <button
        v-for="group in groups"
        :key="group.value"
        type="button"
        class="group-pill"
        :class="{ 'group-pill--active': activeGroup === group.value }"
        @click="activeGroup = group.value"
      >
        {{ group.label }}
      </button>
    </div>

    <div v-if="filteredIcons.length" class="icon-grid">
      <button
        v-for="iconOption in filteredIcons"
        :key="iconOption.value"
        type="button"
        class="icon-option"
        :class="{ 'icon-option--active': modelValue === iconOption.value }"
        :title="iconOption.label"
        @click="$emit('select', iconOption.value)"
      >
        <i :class="iconOption.value" />
      </button>
    </div>

    <div v-else class="icon-empty">
      <i class="pi pi-search" />
      <span>No icons found</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { PHASE_ICON_GROUPS, PHASE_ICON_OPTIONS } from './phaseIconOptions'
import type { PhaseIconGroup } from './phaseIconOptions'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  select: [value: string]
}>()

const activeGroup = ref<'all' | PhaseIconGroup>('all')

const groups = [
  { value: 'all' as const, label: 'All' },
  ...PHASE_ICON_GROUPS,
]

const filteredIcons = computed(() =>
  PHASE_ICON_OPTIONS.filter((iconOption) =>
    activeGroup.value === 'all' || iconOption.group === activeGroup.value,
  ),
)
</script>

<style scoped>
.icon-picker {
  width: min(280px, calc(100vw - 32px));
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(10px);
}

.icon-groups {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.icon-groups::-webkit-scrollbar {
  display: none;
}

.group-pill {
  flex-shrink: 0;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: rgba(122, 173, 140, 0.08);
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.15s ease;
}

.group-pill:hover {
  color: var(--color-text-primary);
  border-color: rgba(122, 173, 140, 0.35);
}

.group-pill--active {
  background: #7aad8c;
  color: #fff;
  border-color: #7aad8c;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 6px;
  max-height: 232px;
  overflow-y: auto;
  padding-right: 2px;
}

.icon-option {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.icon-option:hover {
  background: var(--color-hover);
  color: var(--color-text-primary);
}

.icon-option--active {
  background: rgba(122, 173, 140, 0.2);
  border-color: #7aad8c;
  color: #7aad8c;
}

.icon-empty {
  height: 96px;
  border-radius: 12px;
  border: 1px dashed rgba(122, 173, 140, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-text-muted);
  font-size: 12px;
}

.icon-empty i {
  font-size: 14px;
  opacity: 0.7;
}

@media (max-width: 480px) {
  .icon-picker {
    width: min(260px, calc(100vw - 28px));
    padding: 10px;
  }

  .icon-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
</style>
