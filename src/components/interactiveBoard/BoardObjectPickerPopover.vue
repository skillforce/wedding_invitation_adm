<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Popover from 'primevue/popover'
import { SeatingShape } from '@/stores/seating'

type ObjectOption = {
  shape: SeatingShape
  labelKey: string
  iconClass: string
}

const emit = defineEmits<{
  pick: [shape: SeatingShape]
}>()

const { t } = useI18n()
const popoverRef = ref<InstanceType<typeof Popover> | null>(null)

const objectOptions = computed<ObjectOption[]>(() => [
  { shape: SeatingShape.Circle, labelKey: 'seating.shapeTable', iconClass: 'shape-circle' },
  { shape: SeatingShape.Rect, labelKey: 'seating.shapeNewlywedTable', iconClass: 'shape-rect' },
  { shape: SeatingShape.Pillar, labelKey: 'seating.shapePillar', iconClass: 'shape-pillar' },
])

function toggle(event: MouseEvent) {
  popoverRef.value?.toggle(event)
}

function hide() {
  popoverRef.value?.hide()
}

function pickObject(shape: SeatingShape) {
  hide()
  emit('pick', shape)
}

defineExpose({ toggle, hide })
</script>

<template>
  <Popover ref="popoverRef">
    <div class="object-picker">
      <p class="object-picker-title">{{ t('seating.addObjectTitle') }}</p>
      <button
        v-for="option in objectOptions"
        :key="option.shape"
        class="object-option"
        @click="pickObject(option.shape)"
      >
        <span class="shape-icon" :class="option.iconClass" />
        <span>{{ t(option.labelKey) }}</span>
      </button>
    </div>
  </Popover>
</template>

<style scoped>
.object-picker {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 180px;
  padding: 4px 0;
}

.object-picker-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 0 0 6px 0;
  padding: 0 4px;
}

.object-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.18s ease;
  text-align: left;
}

.object-option:hover {
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
  background: var(--board-toolbar-text, #5a7a9a);
  opacity: 0.75;
}

.shape-rect {
  width: 26px;
  height: 14px;
  border-radius: 3px;
  background: var(--board-toolbar-text, #5a7a9a);
  opacity: 0.75;
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
