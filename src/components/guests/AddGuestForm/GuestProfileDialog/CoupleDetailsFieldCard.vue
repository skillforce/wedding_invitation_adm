<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import ChoicePills from '../ChoicePills.vue'
import FieldCard from '../FieldCard.vue'
import type { ChoiceOption } from '../types'

defineProps<{
  coupleAlreadyInGuestList: boolean | null
  coupleId: string | null
  coupleGuestListOptions: ChoiceOption[]
  guestOptions: Array<{ label: string; value: string }>
  invalidCoupleAlreadyInList: boolean
  invalidCoupleId: boolean
}>()

defineEmits<{
  select: [key: string]
  'update:coupleId': [value: string | null]
}>()

const { t } = useI18n()
</script>

<template>
  <FieldCard
    :label="t('guests.profile.coupleInGuestListLabel')"
    :invalid="invalidCoupleAlreadyInList"
    wide
  >
    <div class="couple-field-stack">
      <ChoicePills :options="coupleGuestListOptions" @select="$emit('select', $event)" />
      <Select
        v-if="coupleAlreadyInGuestList"
        :model-value="coupleId"
        :options="guestOptions"
        option-label="label"
        option-value="value"
        filter
        :placeholder="t('guests.profile.coupleSelectPlaceholder')"
        :invalid="invalidCoupleId"
        class="field-select"
        @update:model-value="$emit('update:coupleId', $event)"
      />
    </div>
  </FieldCard>
</template>

<style scoped>
.couple-field-stack {
  display: grid;
  gap: 0.75rem;
  min-width: 0;
}

.field-select {
  width: 100%;
  min-width: 0;
}

.couple-field-stack :deep(.p-select) {
  width: 100%;
  min-width: 0;
}
</style>
