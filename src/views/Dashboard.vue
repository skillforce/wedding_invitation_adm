<script setup lang="ts">
import { computed, onMounted } from "vue";
import Card from "primevue/card";
import Message from "primevue/message";
import { useGuestsStore } from "@/stores/guests";
import GuestsList from "@/components/GuestsList.vue";

const guestsStore = useGuestsStore();
const guests = computed(() => guestsStore.guests);

onMounted(async () => {
  if (!guestsStore.guests.length) {
    await guestsStore.fetchGuests();
  }
});
</script>

<template>
  <div class="dashboard-page">
    <Card class="dashboard-card">
      <template #title>Панель управления</template>
      <template #content>
        <Message v-if="guestsStore.error" severity="error" size="small" variant="simple">
          {{ guestsStore.error }}
        </Message>

        <p v-else-if="guestsStore.isLoading">Загрузка гостей...</p>
        <p v-else-if="guests.length === 0">Нет гостей в списке.</p>

        <GuestsList v-else :guests="guests" />
      </template>
    </Card>
  </div>
</template>

<style scoped>
.dashboard-page :deep(.dashboard-card) {
  background: transparent;
  border: none;
  box-shadow: none;
  color: var(--color-text-primary);
}

.dashboard-page {
  padding: 0.5rem;
}

.dashboard-card {
  width: 100%;
  max-width: 950px;
}

.description {
  margin-top: 0;
}
</style>
