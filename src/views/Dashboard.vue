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
      <template #title>Dashboard</template>
      <template #content>
        <p class="description">You are logged in. Guests list is below.</p>

        <Message v-if="guestsStore.error" severity="error" size="small" variant="simple">
          {{ guestsStore.error }}
        </Message>

        <p v-else-if="guestsStore.isLoading">Loading guests...</p>
        <p v-else-if="guests.length === 0">No guests found.</p>

        <GuestsList v-else :guests="guests" />
      </template>
    </Card>
  </div>
</template>

<style scoped>
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
