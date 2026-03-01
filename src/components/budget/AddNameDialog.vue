<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useBudgetStore } from '@/stores/budget'
import InputWithError from '@/components/shared/InputWithError.vue'

const props = defineProps<{
  mode: 'section' | 'item'
  sectionId?: string
}>()

const store = useBudgetStore()
const { t } = useI18n()

const visible = ref(false)
const name = ref('')
const inputRef = ref<InstanceType<typeof InputWithError> | null>(null)
const isInvalid = computed(() => !name.value.trim())

const header = computed(() =>
  props.mode === 'section' ? t('budget.newSectionTitle') : t('budget.newItemTitle'),
)
const placeholder = computed(() =>
  props.mode === 'section' ? t('budget.sectionNamePlaceholder') : t('budget.itemNamePlaceholder'),
)

function open() {
  name.value = ''
  visible.value = true
}

function confirm() {
  inputRef.value?.touch()
  if (isInvalid.value) return
  if (props.mode === 'section') {
    store.addSection(name.value.trim())
  } else if (props.sectionId) {
    store.addItem(props.sectionId, name.value.trim())
  }
  visible.value = false
}

defineExpose({ open })
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :header="header"
    :style="{ width: '360px' }"
    modal
  >
    <div class="dialog-form">
      <InputWithError
        ref="inputRef"
        v-model="name"
        :placeholder="placeholder"
        :invalid="isInvalid"
        :error-message="t('budget.nameRequired')"
        :autofocus="true"
        :maxlength="100"
        @keydown.enter="confirm"
      />
    </div>
    <template #footer>
      <Button :label="t('budget.cancel')" severity="secondary" text @click="visible = false" />
      <Button :label="t('budget.confirm')" @click="confirm" />
    </template>
  </Dialog>
</template>

<style scoped>
.dialog-form {
  padding: 0.5rem 0;
}
</style>