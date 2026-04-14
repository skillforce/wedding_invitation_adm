<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { UsersViewDto } from '@/api/users'
import UserAvatar from '@/components/shared/UserAvatar.vue'

defineProps<{ user: UsersViewDto }>()

const { t } = useI18n()
</script>

<template>
  <button class="user-card">
    <UserAvatar :src="user.profile.profileImg" :size="42" variant="default" />
    <div class="user-info">
      <span class="user-login">{{ user.login }}</span>
      <span class="user-email">{{ user.profile.email ?? '—' }}</span>
    </div>
    <span
      class="status-badge"
      :class="user.profile.isConfirmed ? 'status-active' : 'status-pending'"
    >
      {{ user.profile.isConfirmed ? t('userManagement.statusActive') : t('userManagement.statusPending') }}
    </span>
  </button>
</template>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  background: var(--color-sidebar-bg);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  color: var(--color-text-primary);
  box-shadow: var(--shadow-card);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.user-card:hover {
  border-color: var(--color-primary, #6366f1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-login {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.user-email {
  font-size: 13px;
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 3px 9px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-active {
  background: color-mix(in srgb, #22c55e 15%, transparent);
  color: #16a34a;
}

.status-pending {
  background: color-mix(in srgb, #f59e0b 15%, transparent);
  color: #b45309;
}
</style>