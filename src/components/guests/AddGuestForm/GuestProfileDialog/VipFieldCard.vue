<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ChoicePills from '../ChoicePills.vue'
import FieldCard from '../FieldCard.vue'
import type { ChoiceOption } from '../types'

defineProps<{
  options: ChoiceOption[]
  invalid: boolean
}>()

defineEmits<{
  select: [key: string]
}>()

const { t } = useI18n()
</script>

<template>
  <FieldCard
    :label="t('guests.profile.vipLabel')"
    :invalid="invalid"
  >
    <ChoicePills :options="options" @select="$emit('select', $event)" />
  </FieldCard>
</template>
