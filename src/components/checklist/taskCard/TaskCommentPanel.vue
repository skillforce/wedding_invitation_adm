<template>
  <div class="comment-panel" @click.stop>
    <p v-if="task.comment && !editingComment" class="comment-display" @click="startEditing">
      {{ task.comment }}
      <span class="comment-edit-hint">tap to edit</span>
    </p>
    <div v-else class="comment-input-wrap">
      <textarea
        ref="commentInputRef"
        v-model="commentDraft"
        class="comment-textarea"
        placeholder="Leave a comment…"
        rows="2"
        maxlength="200"
        @blur="saveComment"
        @keydown.enter.prevent="saveComment"
        @click.stop
      />
      <div class="comment-actions">
        <button
          class="comment-save-btn"
          :disabled="!commentDraft.trim() && !task.comment"
          @click.stop="saveComment"
        >
          {{ commentDraft.trim() ? 'Save' : 'Remove' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useChecklistStore } from '@/stores/checklist'
import type { Task } from '@/stores/checklist'

const props = defineProps<{ task: Task; phaseId: string }>()
const emit = defineEmits<{ close: [] }>()

const store = useChecklistStore()

const editingComment = ref(!props.task.comment)
const commentDraft = ref(props.task.comment ?? '')
const commentInputRef = ref<HTMLTextAreaElement | null>(null)

async function startEditing() {
  editingComment.value = true
  commentDraft.value = props.task.comment ?? ''
  await nextTick()
  commentInputRef.value?.focus()
}

function saveComment() {
  store.updateTaskComment(props.phaseId, props.task.id, commentDraft.value.trim())
  editingComment.value = false
  if (!commentDraft.value.trim()) emit('close')
}
</script>

<style scoped>
.comment-panel {
  padding: 0 14px 12px;
  border-top: 1px solid var(--color-border);
}

.comment-display {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
  padding: 10px 0 4px;
  cursor: text;
  word-break: break-word;
}

.comment-edit-hint {
  display: block;
  font-size: 11px;
  color: var(--color-text-muted);
  opacity: 0.6;
  margin-top: 4px;
}

.comment-input-wrap { padding-top: 10px; }

.comment-textarea {
  display: block;
  width: 100%;
  background: rgba(122, 173, 140, 0.06);
  border: 1px solid rgba(122, 173, 140, 0.3);
  border-radius: 8px;
  color: var(--color-text-primary);
  font-size: 16px;
  line-height: 1.5;
  padding: 8px 10px;
  outline: none;
  resize: none;
  transition: border-color 0.15s ease;
  font-family: inherit;
  box-sizing: border-box;
}

.comment-textarea:focus { border-color: #7aad8c; }

.comment-textarea::placeholder {
  color: var(--color-text-muted);
  opacity: 0.6;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
}

.comment-save-btn {
  height: 32px;
  padding: 0 14px;
  border-radius: 6px;
  border: none;
  background: #7aad8c;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
  min-width: 60px;
}

.comment-save-btn:disabled { opacity: 0.4; cursor: default; }
.comment-save-btn:not(:disabled):hover { opacity: 0.85; }

@media (max-width: 480px) {
  .comment-panel { padding: 0 12px 12px; }

  .comment-textarea { font-size: 16px; }

  .comment-save-btn {
    width: 100%;
    height: 38px;
    font-size: 14px;
  }

  .comment-actions { margin-top: 8px; }
}
</style>
