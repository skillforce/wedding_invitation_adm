<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ChoicePills from '../ChoicePills.vue'
import FieldCard from '../FieldCard.vue'
import type { ChoiceOption } from '../types'

defineProps<{
  coupleOptions: ChoiceOption[]
  invalid: boolean
}>()

defineEmits<{
  select: [key: string]
}>()

const { t } = useI18n()
</script>

<template>
  <FieldCard
    :label="t('guests.profile.withCoupleLabel')"
    :invalid="invalid"
  >
    <div class="couple-field-row">
      <ChoicePills :options="coupleOptions" @select="$emit('select', $event)" />
    </div>
  </FieldCard>
</template>

<style scoped>
.couple-field-row {
  display: flex;
  align-items: center;
  gap: 2.75rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>

