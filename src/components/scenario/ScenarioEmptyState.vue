<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getIconUrl } from "@/components/scenario/icon-picker/scenarioIconOptions.ts";

const { t } = useI18n()
const ceremonyUrl = getIconUrl('ceremony')
</script>

<template>
  <div class="scenario-empty">
    <div class="empty-icon">
      <img :src="ceremonyUrl" alt="" class="empty-img" />
    </div>
    <p class="empty-text">{{ t('scenario.empty') }}</p>
  </div>
</template>



<style scoped>
.scenario-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 64px 0;
  color: var(--color-text-muted);
}

.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--scenario-icon-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: var(--scenario-icon-filter);
  opacity: 0.4;
}

.empty-text {
  font-size: 14px;
  margin: 0;
}
</style>
