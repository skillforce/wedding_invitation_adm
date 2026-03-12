<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Stage } from 'konva/lib/Stage'
import type { SeatingShape } from '@/stores/seating'
import burgerIconUrl from '@/assets/burger_menu_icon.svg'
import BoardMobileMainDrawer from './BoardMobile/BoardMobileMainDrawer.vue'
import BoardMobileObjectDrawer from './BoardMobile/BoardMobileObjectDrawer.vue'

defineProps<{ isFitted: boolean; stageRef: { getNode(): Stage } | null }>()
const emit = defineEmits<{ addObject: [shape: SeatingShape]; openWorkspaceSettings: [] }>()

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
    />

    <BoardMobileObjectDrawer
      :open="objectOpen"
      @close="objectOpen = false"
      @pick="pickObject"
    />

    <button class="fab" :aria-label="t('a11y.openMenu')" @click="mainOpen = true">
      <img :src="burgerIconUrl" class="fab-icon" :alt="t('a11y.openMenu')" />
    </button>
  </div>
</template>

<style scoped>
.board-mobile-menu {
  display: none;
}

@media (max-width: 639px) {
  .board-mobile-menu {
    display: block;
  }

  .fab {
    position: absolute;
    top: 20px;
    left: 16px;
    z-index: var(--z-drawer-trigger);
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
}
</style>
