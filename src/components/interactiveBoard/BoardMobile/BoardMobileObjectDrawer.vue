<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { SeatingShape } from '@/stores/seating'
import BottomDrawer from '@/components/shared/BottomDrawer.vue'

defineProps<{ open: boolean }>()

const emit = defineEmits<{
  close: []
  pick: [shape: SeatingShape]
}>()

const { t } = useI18n()
</script>

<template>
  <BottomDrawer :open="open" @close="emit('close')">
    <nav class="drawer-nav">
      <p class="drawer-section-title">{{ t('seating.addObjectTitle') }}</p>
      <button class="action-btn" @click="emit('pick', 'circle')">
        <span class="shape-icon shape-circle" />
        <span>{{ t('seating.shapeTable') }}</span>
      </button>
      <button class="action-btn" @click="emit('pick', 'rect')">
        <span class="shape-icon shape-rect" />
        <span>{{ t('seating.shapeNewlywedTable') }}</span>
      </button>
      <button class="action-btn" @click="emit('pick', 'pillar')">
        <span class="shape-icon shape-pillar" />
        <span>{{ t('seating.shapePillar') }}</span>
      </button>
    </nav>
  </BottomDrawer>
</template>

<style scoped>
.drawer-nav {
  display: grid;
  gap: 0.5rem;
}

.drawer-section-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 0 0 4px 0;
  padding: 0 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.action-btn:hover:not(:disabled) {
  background: var(--color-hover);
}

.shape-icon {
  display: block;
  flex-shrink: 0;
}

.shape-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-text-secondary);
  opacity: 0.65;
}

.shape-rect {
  width: 28px;
  height: 15px;
  border-radius: 3px;
  background: var(--color-text-secondary);
  opacity: 0.65;
}

.shape-pillar {
  width: 18px;
  height: 26px;
  border-radius: 50%;
  background: radial-gradient(ellipse at 35% 30%, #b0b0c8 0%, #5a5a72 55%, #2e2e40 100%);
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.45);
}
</style>
