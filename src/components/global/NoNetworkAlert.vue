<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useIsOnline } from '@/composables/useIsOnline'
import wifiOffUrl from '@/assets/wifi_off.svg'

const { t } = useI18n()
const isOnline = useIsOnline()
</script>

<template>
  <Teleport to="body">
    <Transition name="banner">
      <div
        v-if="!isOnline"
        class="no-network-banner"
        role="status"
        aria-live="polite"
      >
        <img :src="wifiOffUrl" class="no-network-icon" alt="" aria-hidden="true" />
        <span class="no-network-title">{{ t('noNetwork.title') }}</span>
        <span class="no-network-sub">{{ t('noNetwork.subtitle') }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.no-network-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: calc(env(safe-area-inset-top) + 0.55rem) 1rem 0.55rem;
  background: #334155;
  color: #cbd5e1;
  font-size: 0.8rem;
  font-weight: 400;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.15);
}

.no-network-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  opacity: 0.9;
  filter: brightness(0) invert(1) opacity(0.6);
}

.no-network-sub {
  opacity: 0.8;
  font-weight: 400;
}

.no-network-sub::before {
  content: '·';
  margin-right: 0.5rem;
}

.banner-enter-active,
.banner-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.banner-enter-from,
.banner-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
