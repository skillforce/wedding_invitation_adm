<script setup lang="ts">
import { computed, ref } from 'vue'
import ScenarioIconPalette from './ScenarioIconPalette.vue'
import { getIconUrl } from './scenarioIconOptions'
import type { ScenarioPointIcon } from '@/types/scenario'

const props = defineProps<{
  icon: ScenarioPointIcon
  isEditing: boolean
}>()

const emit = defineEmits<{ select: [value: ScenarioPointIcon] }>()

const open = ref(false)
const iconUrl = computed(() => getIconUrl(props.icon))

function pick(value: ScenarioPointIcon) {
  emit('select', value)
  open.value = false
}
</script>

<template>
  <div
    class="scenario-icon-wrap"
    :class="{ 'scenario-icon-wrap--editable': isEditing }"
    @click.stop="isEditing && (open = !open)"
  >
    <img :src="iconUrl" :alt="icon" class="icon-img" />
    <i v-if="isEditing" class="pi pi-pencil edit-hint" />

    <Transition name="picker-drop">
      <div v-if="open" class="picker-shell">
        <ScenarioIconPalette :model-value="icon" @select="pick" />
      </div>
    </Transition>
  </div>
</template>



<style scoped>
.scenario-icon-wrap {
  flex-shrink: 0;
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--scenario-icon-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.scenario-icon-wrap--editable {
  cursor: pointer;
  border: 1px dashed var(--scenario-icon-accent);
}

.scenario-icon-wrap--editable:hover {
  background: var(--scenario-icon-bg-active);
}

.scenario-icon-wrap--editable:hover .icon-img {
  opacity: 0.3;
}

.scenario-icon-wrap--editable:hover .edit-hint {
  opacity: 1;
}

.icon-img {
  width: 26px;
  height: 26px;
  object-fit: contain;
  filter: var(--scenario-icon-filter);
  transition: opacity 0.15s;
}

.edit-hint {
  position: absolute;
  font-size: 12px;
  color: var(--scenario-icon-accent);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}

.picker-shell {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 50;
}

.picker-drop-enter-active { animation: pdIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.picker-drop-leave-active { animation: pdIn 0.15s ease reverse; }
@keyframes pdIn {
  from { opacity: 0; transform: translateY(-6px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>