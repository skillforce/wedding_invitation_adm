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
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid rgba(56, 69, 88, 0.45);
  background: linear-gradient(145deg, #dde3eb 0%, #a8b3c2 45%, #78859a 100%);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.5),
    inset 0 -2px 3px rgba(30, 38, 52, 0.25),
    0 2px 4px rgba(30, 38, 52, 0.25);
}

.shape-pillar::before {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 2px;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.32) 0 1px,
      rgba(255, 255, 255, 0) 1px 4px
    );
  opacity: 0.9;
}
</style>
