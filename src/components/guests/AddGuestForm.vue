<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

defineProps<{
  isAdding: boolean
}>()

const emit = defineEmits<{
  add: [name: string]
}>()

const { t } = useI18n()
const newGuestName = ref('')

function submitAdd() {
  const name = newGuestName.value.trim()
  if (name.length < 3) return
  emit('add', name)
  newGuestName.value = ''
}


const isAddGuestButtonDisabled = computed(() => newGuestName.value.trim().length < 3)
</script>

<template>
  <form class="add-form" @submit.prevent="submitAdd">
    <InputText
      v-model="newGuestName"
      :placeholder="t('guests.addGuestPlaceholder')"
      class="add-input"

    />
    <Button
      type="submit"
      :loading="isAdding"
      :disabled="isAddGuestButtonDisabled"
      :aria-label="t('a11y.addGuest')"
      icon="pi pi-plus"
      size="small"
    />
  </form>
</template>

<style scoped>
.add-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.add-input {
  flex: 1;
}
</style>
