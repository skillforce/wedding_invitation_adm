<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import InputNumber from 'primevue/inputnumber'
import ChoicePills from '../ChoicePills.vue'
import FieldCard from '../FieldCard.vue'
import type { ChoiceOption } from '../types'

defineProps<{
  hasKidsAttending: boolean | null
  amountOfKids: number | null
  options: ChoiceOption[]
  invalid: boolean
}>()

defineEmits<{
  select: [key: string]
  'update:amountOfKids': [value: number | null]
}>()

const { t } = useI18n()
</script>

<template>
  <FieldCard
    :label="t('guests.profile.kidsLabel')"
    :invalid="invalid"
  >
    <div class="kids-field-row">
      <ChoicePills :options="options" @select="$emit('select', $event)" />
      <div v-if="hasKidsAttending" class="kids-count-row">
        <InputNumber
          input-id="kids-count-input"
          :model-value="amountOfKids"
          :min="1"
          :max="10"
          show-buttons
          class="kids-count-input"
          @update:model-value="$emit('update:amountOfKids', $event)"
        />
      </div>
    </div>
  </FieldCard>
</template>

<style scoped>
.kids-field-row {
  display: flex;
  align-items: center;
  gap: 2.75rem;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.kids-count-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.kids-count-input {
  width: 80px;
}

.kids-count-input:deep(.p-inputnumber-input) {
  width: 90px;
  height: 40px;
}

@media (max-width: 640px) {
  .kids-field-row {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .kids-count-row {
    gap: 0.45rem;
  }
}
</style>
