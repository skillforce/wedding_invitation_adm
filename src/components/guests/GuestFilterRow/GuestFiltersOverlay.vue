<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Popover from 'primevue/popover'
import BottomDrawer from '@/components/shared/BottomDrawer.vue'
import GuestFilterPanelContent from '@/components/guests/GuestFilterRow/GuestFilterPanelContent.vue'
import type { GuestProfileFilterState } from '@/components/guests/GuestFilterRow/GuestProfileFilter.vue'
import type { GuestFilter } from '@/components/guests/GuestFilterRow/GuestFilterRow.vue'

const props = defineProps<{
  responseFilter: GuestFilter
  profileFilter: GuestProfileFilterState
  hasInvitationUrl?: boolean
}>()

const emit = defineEmits<{
  'update:responseFilter': [value: GuestFilter]
  'update:profileFilter': [value: GuestProfileFilterState]
}>()

const popoverRef = ref<InstanceType<typeof Popover> | null>(null)
const isDrawerOpen = ref(false)
const isMobile = ref(false)

function syncViewportMode() {
  if (typeof window === 'undefined') return
  isMobile.value = window.innerWidth < 640
}

function toggle(event: MouseEvent) {
  if (isMobile.value) {
    isDrawerOpen.value = !isDrawerOpen.value
    return
  }

  popoverRef.value?.toggle(event)
}

function hide() {
  popoverRef.value?.hide()
  isDrawerOpen.value = false
}

onMounted(() => {
  syncViewportMode()
  window.addEventListener('resize', syncViewportMode)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewportMode)
})

defineExpose({ toggle, hide })
</script>

<template>
  <Popover ref="popoverRef">
    <GuestFilterPanelContent
      :response-filter="responseFilter"
      :profile-filter="profileFilter"
      :has-invitation-url="hasInvitationUrl"
      @update:response-filter="emit('update:responseFilter', $event)"
      @update:profile-filter="emit('update:profileFilter', $event)"
    />
  </Popover>

  <BottomDrawer :open="isDrawerOpen" @close="hide">
    <GuestFilterPanelContent
      :response-filter="responseFilter"
      :profile-filter="profileFilter"
      :has-invitation-url="hasInvitationUrl"
      @update:response-filter="emit('update:responseFilter', $event)"
      @update:profile-filter="emit('update:profileFilter', $event)"
    />
  </BottomDrawer>
</template>
