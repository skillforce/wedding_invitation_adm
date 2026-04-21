<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useScenarioStore } from '@/stores/scenario'
import { useAppCommonStore } from '@/stores/app_common'
import ScenarioIconPicker from '../icon-picker/ScenarioIconPicker.vue'
import { SCENARIO_NOTE_MAX_LENGTH } from '@/constants/scenario'
import type { ScenarioPointIcon } from '@/types/scenario'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ 'update:visible': [value: boolean] }>()

const { t } = useI18n()
const store = useScenarioStore()
const appCommon = useAppCommonStore()

const form = ref({ time: '12:00', title: '', icon: 'ceremony' as ScenarioPointIcon, note: '' })
const timeError = ref(false)
const saving = ref(false)

watch(() => props.visible, (val) => {
  if (val) {
    form.value = { time: '12:00', title: '', icon: 'ceremony', note: '' }
    timeError.value = false
  }
})

async function submit() {
  if (!form.value.title.trim()) return
  timeError.value = false
  saving.value = true
  try {
    await store.addPoint({
      time: form.value.time,
      title: form.value.title.trim(),
      icon: form.value.icon,
      note: form.value.note.trim() || undefined,
    })
    emit('update:visible', false)
  } catch (err: unknown) {
    const msg = (err as { serverMessage?: string })?.serverMessage ?? ''
    if (msg === 'errors.scenario.timeAlreadyExists') {
      timeError.value = true
      appCommon.showError(new Error(msg))
    } else {
      appCommon.showError(new Error(msg || 'errors.scenario.failedToCreate'))
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Dialog
    :visible="visible"
    :header="t('scenario.addPoint')"
    modal
    :breakpoints="{ '640px': '92vw' }"
    style="width: 400px"
    @update:visible="$emit('update:visible', $event)"
  >
    <form class="add-form" @submit.prevent="submit">

      <div class="field">
        <label class="field-label">{{ t('scenario.fields.icon') }}</label>
        <ScenarioIconPicker
          :icon="form.icon"
          :is-editing="true"
          @select="form.icon = $event"
        />
      </div>

      <div class="field">
        <label class="field-label">{{ t('scenario.fields.time') }}</label>
        <input
          v-model="form.time"
          type="time"
          step="60"
          class="time-input"
          :class="{ 'time-input--error': timeError }"
          @input="timeError = false"
        />
        <small v-if="timeError" class="field-error">{{ t('errors.scenario.timeAlreadyExists') }}</small>
      </div>

      <div class="field">
        <label class="field-label">{{ t('scenario.fields.title') }}</label>
        <InputText
          v-model="form.title"
          :placeholder="t('scenario.newPoint')"
          maxlength="50"
          class="w-full"
          autofocus
        />
      </div>

      <div class="field">
        <label class="field-label">{{ t('scenario.fields.note') }}</label>
        <div class="note-wrap">
          <textarea
            v-model="form.note"
            :placeholder="t('scenario.notePlaceholder')"
            :maxlength="SCENARIO_NOTE_MAX_LENGTH"
            class="note-textarea"
            rows="3"
          />
          <span class="note-counter" :class="{ 'note-counter--full': form.note.length >= SCENARIO_NOTE_MAX_LENGTH }">
            {{ form.note.length }}/{{ SCENARIO_NOTE_MAX_LENGTH }}
          </span>
        </div>
      </div>

      <div class="form-actions">
        <Button
          type="button"
          :label="t('scenario.cancel')"
          severity="secondary"
          text
          @click="$emit('update:visible', false)"
        />
        <Button
          type="submit"
          :label="t('scenario.save')"
          :loading="saving"
          :disabled="!form.title.trim()"
        />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
.add-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 4px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.field-error {
  font-size: 12px;
  color: var(--p-red-500, #ef4444);
}

.time-input {
  height: 40px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-soft);
  color: var(--color-text-primary);
  font-size: 16px;
  font-weight: 600;
  color-scheme: inherit;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
  box-sizing: border-box;
}

.time-input:focus {
  border-color: var(--scenario-icon-accent);
}

.time-input--error {
  border-color: #ef4444;
  box-shadow: 0 0 0 1px #ef4444;
}

.note-wrap {
  position: relative;
}

.note-textarea {
  width: 100%;
  height: 72px;
  resize: none;
  padding: 8px 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-soft);
  color: var(--color-text-primary);
  font-size: 16px;
  font-family: inherit;
  line-height: 1.5;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.note-textarea:focus {
  border-color: var(--scenario-icon-accent);
}

.note-textarea::placeholder {
  color: var(--color-text-muted);
}

.note-counter {
  position: absolute;
  right: 10px;
  bottom: 6px;
  font-size: 16px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.note-counter--full {
  color: #e8927a;
  font-weight: 700;
}

.field :deep(.p-inputtext) {
  font-size: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
}
</style>