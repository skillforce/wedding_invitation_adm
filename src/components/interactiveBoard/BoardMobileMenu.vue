<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Stage } from 'konva/lib/Stage'
import type { SeatingShape } from '@/stores/seating'
import burgerIconUrl from '@/assets/burger_menu_icon.svg'
import BoardMobileMainDrawer from './BoardMobile/BoardMobileMainDrawer.vue'
import BoardMobileObjectDrawer from './BoardMobile/BoardMobileObjectDrawer.vue'

defineProps<{ isFitted: boolean; stageRef: { getNode(): Stage } | null }>()
const emit = defineEmits<{ addObject: [shape: SeatingShape]; openWorkspaceSettings: []; autoSeat: []; fitToStage: [] }>()

const { t } = useI18n()
const mainOpen = ref(false)
const objectOpen = ref(false)

function openObjectDrawer() {
  mainOpen.value = false
  objectOpen.value = true
}

function pickObject(shape: SeatingShape) {
  objectOpen.value = false
  emit('addObject', shape)
}
</script>

<template>
  <div class="board-mobile-menu">
    <BoardMobileMainDrawer
      :open="mainOpen"
      :is-fitted="isFitted"
      :stage-ref="stageRef"
      @close="mainOpen = false"
      @open-object-drawer="openObjectDrawer"
      @open-settings-drawer="emit('openWorkspaceSettings')"
      @auto-seat="emit('autoSeat')"
    />

    <BoardMobileObjectDrawer
      :open="objectOpen"
      @close="objectOpen = false"
      @pick="pickObject"
    />

    <button class="fab" :aria-label="t('a11y.openMenu')" @click="mainOpen = true">
      <img :src="burgerIconUrl" class="fab-icon" :alt="t('a11y.openMenu')" />
    </button>

    <button
      class="fab fab--fit"
      :aria-label="t('seating.viewWorkspace')"
      :disabled="isFitted"
      @click="emit('fitToStage')"
    >
      <i class="pi pi-expand fab-icon--pi" />
    </button>
  </div>
</template>

<style scoped>
.board-mobile-menu {
  display: none;
}

@media (max-width: 739px) {
  .board-mobile-menu {
    display: block;
  }

  .fab {
    position: absolute;
    top: 20px;
    left: 16px;
    z-index: 10;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid var(--board-toolbar-border);
    background: var(--board-toolbar-bg);
    backdrop-filter: blur(8px);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fab-icon {
    width: 22px;
    height: 22px;
    filter: var(--color-icon-filter);
  }

  .fab--fit {
    top: 20px;
    left: auto;
    right: 16px;
  }

  .fab--fit:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .fab-icon--pi {
    font-size: 1.1rem;
    color: var(--board-toolbar-text);
  }
}
</style>
